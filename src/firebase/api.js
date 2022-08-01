import { firebase, db } from './config.js'
import { mobileCheck } from './helpers.js';
import TEAMS from '../statics/teams.json';

export const getTeamInfo = ({ teamId }) => {
  return TEAMS[teamId];
}

export const getUser = async ({uid}) => {
  try {
    const userQuery = await db.collection('users').where("uid", "==", uid).get();
    if (userQuery.empty) return;
    const user = userQuery.docs[0].data();
    return user;
  } catch(err) {
    alert(err);
  }
}

export const addDbUser = async ({ uid, name, email }) => {
  try {
    await db.collection('users').add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, name, email, avatar: 'avatar1.svg'});
    return { uid, name, email, avatar: 'avatar1.svg' };
  } catch(err) {
    throw new Error(err);
  }
}

export const signInProvider = async ({provider}) => {
  try {
    let providerAuth;
    if (provider === 'google') {
      providerAuth = new firebase.auth.GoogleAuthProvider();
    }
    const method = mobileCheck() ? 'signInWithRedirect' : 'signInWithPopup';
    const { user, additionalUserInfo } = await firebase.auth()[method](providerAuth);
    if (additionalUserInfo.isNewUser) {
      try {
        firebase.auth().signInWithRedirect(providerAuth);
      } catch(err) {
        console.log(err);
      }
    }
  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
}

export const addAvatarsToRanking = async () => {
  const rankingRef = db.collection('rankings');
  const rankingQuery = await rankingRef.get();
  const usersRef = db.collection('users');
  const userQuery = await usersRef.get();
  for (let doc of userQuery.docs) {
    const { avatar, uid } = doc.data();
    for (let doc of rankingQuery.docs) {
      const { uid: rankingUid } = doc.data();
      if (rankingUid === uid) {
        console.log(`${uid} updated ${avatar}`);
        await doc.ref.update({ avatar });
      }
    }
  }
}

export const createUser = async ({name, email, password}) => {
  try {
    const { additionalUserInfo, user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
    if (additionalUserInfo.isNewUser) {
      await addDbUser({ uid: user.uid, name, email });
    }
  } catch(err) {
    throw new Error(err);
  }
};

export const signInCustom = async ({email, password}) => {
  try {
    const methods = await firebase.auth().fetchSignInMethodsForEmail(email);
    if (methods.length && !methods.includes('password')) {
      throw new Error('There is no user record corresponding to this identifier');
    }
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch(err) {
    throw new Error(err);
  }
}

export const onSignOut = async () => {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export const getCompetitions = async () => {
  try {
    const currentSeason = 2020;
    const req = db.collection('competition_seasons').where('season', '==', currentSeason);
    const snap = await req.get();
    const competitions = [];
    for (let docs of snap.docs) {
      competitions.push(docs.data());
    }
    return competitions;
  } catch(err) {
    throw new Error(err);
  }
}

export const listenToPlayersPoints = ({ playersIds, cb }) => {
  const listeners = playersIds.filter(p => p).map(({ pId, mId }) => {
    const ref = db.collection('players_matches_stats').doc(`${pId}-${mId}`);
    return ref.onSnapshot(doc => {
      const statistics = doc.data();    
      if (statistics && typeof statistics.points === 'number') {
        cb(Object.assign({}, { points: statistics.points, playerId: pId }));
      }
    });
  });
  return listeners;
}

export const getPlayersPoints = async ({ playersIds }) => {
  const players = [];
  await Promise.all(playersIds.filter(pId => pId).map(async ({ pId, mId }) => {
    const query = db.collection('players_matches_stats').doc(`${pId}-${mId}`);
    const snap = await query.get();
    if (snap.exists) {
      players.push(Object.assign({}, { points: snap.data().points, playerId: pId }));
    }
  }));
  return players;
}

export const getPlayerMatchStats = async ({ playerId, matchId }) => {
  const path = `${playerId}-${matchId}`;
  const req = db.collection('players_matches_stats').doc(path).collection('stats');
  const snap = await req.get();
  if (snap.empty) return {};
  return snap.docs[0].data();
}

export const getFixtureMatches = async ({ competitionId, matchday }) => {
  const req = db.collection('matches')
      .where('competitionId', '==', competitionId)
      .where('matchday', '==', matchday)
  const snap = await req.get();
  if (snap.empty) return [];
  const fixture = snap.docs.map(doc => Object.assign(doc.data(), {
    teams: [
      TEAMS[doc.data().teams[0]],
      TEAMS[doc.data().teams[1]]
    ],
    matchId: doc.id
  }));
  return fixture.sort((a, b) => a.startDate - b.startDate);
}

export const getUserTourneys = ({ uid, cb }) => {
  try {
    const req = db.collection('users_tourneys')
      .where('uid', '==', uid)
      .where('closed', '==', false);
    const observer = req.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(({ type, doc }) => {
        cb({type, tourney: doc.data()});
      });
    });
    return observer;
  } catch(err) {
    throw new Error(err);
  }
}

export const getTourney = async ({ tourneyId, uid, cb }) => {
  try {
    const req = db.collection('tourneys').doc(tourneyId);
    const observer = req.onSnapshot(async doc => {
      if (!doc.exists) return;
      const tourney = doc.data();
      if (!tourney.currentMatchday) {
        const { currentMatchday, currentFixtureStatus } = await getCompetitionInfo({competitionId: tourney.competitions[0]});
        Object.assign(tourney, { currentMatchday, currentFixtureStatus });
      }
      const generalRanking = await getRanking({ tourneyId: tourney.tourneyId, matchday: 0 });
      const userRanking = generalRanking.find((user) => user.uid === uid);
      if (generalRanking && userRanking) {
        Object.assign(tourney, { generalRanking, totalUserPoints: userRanking.points, userPosition: generalRanking.indexOf(userRanking)+1});
      }
      cb(tourney);
    })
    return observer;
  } catch(err) {
    throw new Error(err);
  }
}


export const getRanking = async ({ tourneyId, matchday }) => {
  try {
    const req = db.collection('rankings')
        .where('tourneyId', '==', tourneyId)
        .where('matchday', '==', matchday).orderBy('points', 'desc').limit(25);
    const rankingSnap = await req.get();
    const rankingDocs = rankingSnap.docs;
    const ranking = rankingDocs.map(doc => doc.data());
    return ranking;
  } catch(err) {
    throw new Error(err);
  }
}

export const isUserInTourney = async ({ tourneyId, uid }) => {
  try {
    const req = db.collection('users_tourneys').where('tourneyId', '==', tourneyId).where('uid', '==', uid);
    const snap = await req.get();
    return !snap.empty;
  } catch(err) {
    throw new Error(err);
  }
}

function convertArrayToObject(array, key) {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const getPlayerPosNames = (formationSelected) => {
  const defenders = formationSelected[1];
  const midfielders = formationSelected[2];
  if (defenders === 4 && midfielders === 3) {
    return ['gk', 'lb', 'cb', 'cb', 'rb', 'mc', 'mco', 'mc', 'st', 'st', 'st'];
  }
}

export const getPlayerDraft = async ({ tourney, selectedMatchday, uid, onlyDraft=false }) => {
  const { tourneyId } = tourney;
  const draftPath = `${tourneyId}-${uid}-${selectedMatchday}`;
  const draftQuery = db.collection('drafts').doc(draftPath);
  const draftSnap = await draftQuery.get();
  if (!draftSnap.exists) {
    if (onlyDraft) {
      // jornada comenzada
      return { type: 'generateDraft',  players: Array(11).fill(null), formation: [1, 4, 3, 3] };
    }
    return { type: 'generateDraft',  players: Array(11).fill(null), formation: [1, 4, 3, 3] };
  }
  let { players, formation } = draftSnap.data();
  if (onlyDraft && players.filter(p => p).length === 11) {
    return { type: 'onlyDraft', players, formation };
  };
  const candidatesRef = db.collection('drafts_candidates').doc(draftPath);
  const candidatesSnap = await candidatesRef.get();
  const { candidates } = candidatesSnap.data();
  return { type: 'fullDraft', candidates, players, formation };
}

const mergeLineupWithPlayers = async (lineup, selected) => {
  const posWithPlayers = await Promise.all(
    lineup.map(async (pos, index) => {
      const playerId = selected[index].playerId
      if (Boolean(playerId)) {
        const player = await getPlayersInfo({ playerIds: [playerId] });
        return player[0];
      } else {
        return await pos;
      }
    })
  );
  return posWithPlayers;
}

export const getCompetitionInfo = async ({ competitionId, season=2020 }) => {
  const req = db.collection('competition_seasons')
    .where('competitionId', '==', competitionId)
    .where('season', '==', season)
  const snap = await req.get();
  return snap.docs[0].data();
}

export const getPlayerSeasonStats = async ({ playerId, season }) => {
  const req = db.collection('players_stats').doc(`${playerId}-${season}`);
  const snap = await req.get();
  return snap.exists ? snap.data() : null;
}

export const getTeamNextMatch = async ({ teamId, competitionId, matchday }) => {
  console.log({teamId, competitionId, matchday});
  const query = db.collection('matches')
    .where('competitionId', '==', competitionId)
    .where('matchday', '==', matchday)
    .where('teams', 'array-contains-any', [teamId]);
  const snap = await query.get();
  return !snap.empty ? snap.docs[0].data() : null;
}

export const getAllPlayers = async () => {
  const req = db.collection('players');
  const snap = await req.get();
  const players = [];
  for (let doc of snap.docs) {
    players.push(Object.assign(doc.data(), {playerId: doc.id}));
  }
  return convertArrayToObject(players, 'playerId');
}

// CALLABLE FUNCTIONS
export const addTourney = async ({ name, competitions, season, sport}) => {
  try {
    const req = firebase.functions().httpsCallable('addTourney');
    const snap = await req({ name, competitions, season, sport });
    return snap.data;
  } catch(err) {
    throw new Error(err);
  }
}

export const deleteTourney = async ({ tourney }) => {
  try {
    const req = firebase.functions().httpsCallable('deleteTourney');
    const snap = await req({ tourney });
    return snap.data;
  } catch(err) {
    throw new Error(err);
  }
}

export const initDraft = async ({ tourney, competitionId }) => {
  try {
    const req = firebase.functions().httpsCallable('initDraft');
    const draft = await req({ tourney, competitionId });
    return draft;
  } catch(err) {
    throw new Error(err);
  }
}

export const selectDraftPlayer = async ({
  tourney, player, uid, playerIdx
}) => {
  try {
    const {currentMatchday: matchday, competitions, tourneyId} = tourney;
    const { playerId, teamId } = player;
    const path = `${tourneyId}-${uid}-${matchday}`;
    const draftRef = db.collection('drafts').doc(path);
    const matchId = await getMatchId({ competitionId: competitions[0], teamId, matchday });
    await db.runTransaction(async (t) => {
      const snap = await t.get(draftRef);
      let { players } = snap.data();
      players[playerIdx] = { pId: playerId, mId: matchId };
      t.update(draftRef, { players });
    });
  } catch(err) {
    throw new Error(err);
  }
}

const getMatchId = async ({competitionId, matchday, teamId}) => {
  const matchQuery = db.collection('matches')
    .where('competitionId', '==', competitionId)
    .where('matchday', '==', matchday)
    .where('teams', 'array-contains-any', [teamId]);
  const matchSnap = await matchQuery.get();
  return matchSnap.docs[0].id;
}

export const getDraftPick = async ({ tourney, position }) => {
  try {
    const req = firebase.functions().httpsCallable('getDraftPick');
    const snap = await req({ tourney, position });
    const playerIds = snap.data;
    const players = await getPlayersInfo({ playerIds });
    return players;
  } catch(err) {
    throw new Error(err);
  }
}

const getPlayersInfo = async ({ playerIds }) => {
  const players = await Promise.all(
    playerIds.map(async playerId => {
      const req = db.collection('players').doc(playerId);
      const snap = await req.get();
      return Object.assign(snap.data(), { playerId });
    })
  );
  return players;
}

export const joinTourney = async ({ tourneyId  }) => {
  try {
    const req = firebase.functions().httpsCallable('joinTourney');
    const snap = await req({ tourneyId });
    return snap.data;
  } catch(err) {
    throw new Error(err);
  }
}