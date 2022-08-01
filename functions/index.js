'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const initDraft = require('./src/initDraft');

admin.initializeApp();
global.db = admin.firestore();

exports.initDraft = functions.https.onCall(initDraft);

exports.addTourney = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  if (!uid) {
    throw new functions.https.HttpsError('failed-precondition', 'You need to be authenticated');
  }
  const { name, competitions, season, sport } = data;
  const compQuery = db.collection('competition_seasons')
    .where('competitionId', '==', competitions[0])
    .where('season', '==', season);
  const compSnap = await compQuery.get();
  const { currentMatchday } = compSnap.docs[0].data();
  try {
    const batch = db.batch();
    const tourneyRef = db.collection('tourneys').doc();
    const tourneyData = {
      name, ownerId: uid, competitions, status: 'notstarted',
      season, sport, playersCount: 0, tourneyId: tourneyRef.id,
      sinceMatchday: currentMatchday
    }
    batch.set(tourneyRef, tourneyData);
    const userTourneyRef = db.collection('users_tourneys').doc();
    batch.set(userTourneyRef, {
      uid,
      tourneyId: tourneyRef.id,
      closed: false,
      joinedOn: admin.firestore.FieldValue.serverTimestamp()
    });
    await batch.commit();
    return tourneyData;
  } catch (err) {
    throw new functions.https.HttpsError('invalid-argument', err.message);
  }
});

exports.deleteTourney = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  const { tourneyId, ownerId } = data.tourney;
  if (uid !== ownerId) {
    throw new functions.https.HttpsError('failed-precondition', "Only the owner of the tournament can delete it");
  }
  try {
    const batch = db.batch();
    const usersRef = db.collection('users_tourneys').where('tourneyId', '==', tourneyId);
    const usersSnap = await usersRef.get();
    usersSnap.docs.forEach(doc => batch.update(doc.ref, { closed: true }) );
    await batch.commit();
    return null;
  } catch (err) {
    throw new functions.https.HttpsError('invalid-argument', err.message);
  }
});

exports.joinTourney = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  if (!uid) {
    throw new functions.https.HttpsError('failed-precondition', 'You need to be authenticated');
  }
  const { tourneyId } = data;
  try {
    const userTourneyRef = db.collection('users_tourneys').where('tourneyId', '==', tourneyId).where('uid', '==', uid);
    const snap = await userTourneyRef.get();
    if (snap.empty) {
      await db.collection('users_tourneys').add({
        uid,
        tourneyId,
        closed: false,
        joinedOn: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    return;
  } catch (err) {
    throw new functions.https.HttpsError('invalid-argument', err.message);
  }
});

exports.getDraftPick = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  if (!uid) throw new functions.https.HttpsError('failed-precondition', 'You need to be authenticated');
  try {
    const { tourney, position } = data;
    const matchdayRef = db.collection('competition_seasons').where('competitionId', '==', tourney.competitions[0]);
    const matchdaySnap = await matchdayRef.get();
    const { currentMatchday } = matchdaySnap.docs[0].data();
    const draftPath = `${tourney.tourneyId}-${uid}-${currentMatchday}`;
    const draftRef = db.collection('drafts').doc(draftPath);
    const snap = await draftRef.get();
    const draft = snap.data();
    let remainingPlayers;
    if (draft.shown) {
      remainingPlayers = draft[position].filter(p => !draft['shown'].includes(p)).splice(0, 4);
    } else {
      remainingPlayers = draft[position].splice(0, 4);
    }
    await db.collection('drafts')
      .doc(draftPath)
      .set({ shown: admin.firestore.FieldValue.arrayUnion(...remainingPlayers)}, { merge: true });
    return shuffle(remainingPlayers);
  } catch (err) {
    throw new functions.https.HttpsError('getDraftPick Function Error', err);
  }
});

exports.selectDraftPlayer = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  if (!uid) {
    throw new functions.https.HttpsError('failed-precondition', 'You need to be authenticated');
  }
  try {
    const { playerId, tourneyId, competitionId, teamId, positionNumber } = data;
    const matchdayRef = db.collection('competition_seasons').where('competitionId', '==', competitionId);
    const matchdaySnap = await matchdayRef.get();
    const { currentMatchday } = matchdaySnap.docs[0].data();
    const matchQuery = db.collection('matches')
        .where('competitionId', '==', competitionId)
        .where('matchday', '==', currentMatchday)
        .where('teams', 'array-contains-any', [teamId]);
    const matchSnap = await matchQuery.get();
    const matchId = matchSnap.docs[0].id;
    const draftRef = db.collection('drafts').doc(`${tourneyId}-${uid}-${currentMatchday}`);
    await db.runTransaction(async (t) => {
      const doc = await t.get(draftRef);
      const { selected } = doc.data();
      selected[positionNumber] = {playerId, matchId};
      t.update(draftRef, {selected});
    });
  } catch(err) {
    throw new functions.https.HttpsError('selectDraftPlayer error', err);
  }
});

exports.updateNewUserTourneyInfo = functions.firestore
  .document('users_tourneys/{docId}')
  .onCreate(async (snap, context) => {
    const { tourneyId, uid } = snap.data();
    try {
      const batch = db.batch();
      const playersCountRef = db.collection('tourneys').doc(tourneyId);
      batch.update(playersCountRef, { playersCount: admin.firestore.FieldValue.increment(1) });
      const rankingRef = db.collection('rankings').doc(`${tourneyId}-${uid}-0`);
      const userRef = await db.collection('users').where("uid", "==", uid).get();
      const { name } = userRef.docs[0].data();
      batch.set(rankingRef, { points: 0, matchday: 0, tourneyId, uid, name });
      await batch.commit();
    } catch (err) {
      console.warn('ERROR updateNewUserTourneyInfo', { err });
    }
  });