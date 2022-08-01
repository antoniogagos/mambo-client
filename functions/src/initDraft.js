const functions = require('firebase-functions');
const championsRefs = require('../football_champions_league.json');

// ! deprecated
//  * Should use 
// ? Question how is it done

async function getRemainingTeams({ competitionId, season, matchday }) {
  const query = db.collection('matches')
    .where('competitionId', '==', competitionId)
    .where('season', '==', season)
    .where('matchday', '==', matchday);
  const querySnap = await query.get();
  const fixture = [];
  for (let match of querySnap.docs) {
    fixture.push(...match.data().teams);
  }
  return fixture;
}

module.exports = async (data, context) => {
  const uid = context.auth.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "You need to be authenticated"
    );
  }
  const { tourney, competitionId } = data;
  try {
    const batch = db.batch();
    let playersRef;
    const matchdayRef = db.collection("competition_seasons").where("competitionId", "==", competitionId);
    const matchdaySnap = await matchdayRef.get();
    const { currentMatchday, season } = matchdaySnap.docs[0].data();
    let players;
    if (competitionId === "football_champions_league") {
      const remainingTeams = await getRemainingTeams({
        competitionId: 'football_champions_league',
        matchday: currentMatchday,
        season,
      });
      players = [];
      await Promise.all(remainingTeams.map(async teamId => {
        const ref = db.collection('players').where('teamId', '==', teamId);
        const snap = await ref.get();
        const docs = snap.docs;
        docs.map((doc) => {
          const player = Object.assign(doc.data(), { playerId: doc.id });
          players.push(player);
        });
      }));
    } else {
      playersRef = db.collection("players").where("competitionId", "==", competitionId);
    }
    if (!players) {
      const playersSnap = await playersRef.get();
      players = playersSnap.docs.map((doc) => Object.assign(doc.data(), { playerId: doc.id }));
    }
    if (competitionId === "football_champions_league") {
      console.log('shuffling');
      players = shuffle(players);
      console.log('already shuffled');
    } else {
      players = shuffle(players.filter(p => p.competitionId === competitionId && Boolean(p.teamId)));
    }
    console.log({ currentMatchday, season });
    const totalPositionsPlayers = { g: 4, d: 20, m: 20, a: 12 };
    const initial = { g: 0, d: 0, m: 0, a: 0 };
    const positionsName = {
      d: ["RB", "LB", "D", "CB"],
      m: ["LM", "CM", "M", "CDM", "CAM", "RM", "LW", "RW"],
      a: ["F", "ST", "CF"],
      g: ["GK", "G"],
    };
    const draft = generateDraftStars(competitionId);
    console.log('draft stars generated');
    const playersDraft = {};
    while (Object.values(initial).reduce((curr, total) => curr + total) < 56) {
      const shuffledPositions = shuffle(Object.keys(totalPositionsPlayers));
      for (let position of shuffledPositions) {
        const total = totalPositionsPlayers[position];
        const current = initial[position];
        const randomStars = shuffle(draft)[0];
        if (current < total) {
          const playersFiltered = players.filter((p) => {
            const positionsList = positionsName[position];
            return positionsList.includes(p.position) && p.stars === randomStars;
          });
          const randomPos = getRandomInt(0, playersFiltered.length - 1);
          const player = shuffle(playersFiltered)[randomPos];
          if (
            playersDraft[position] &&
            playersDraft[position].includes(player.playerId)
          )
            continue;
          if (playersDraft[position]) {
            playersDraft[position].push(player.playerId);
          } else {
            playersDraft[position] = [player.playerId];
          }
          initial[position]++;
          draft.splice(draft.indexOf(randomStars), 1);
        }
      }
    }
    const formation = [1, 4, 3, 3];
    const positions = ["g", "d", "m", "a"];
    const candidates = [];
    formation.forEach((f, index) => {
      const position = positions[index];
      for (let i = 0; i < f; i++) {
        const from = i * 4;
        const to = from + 4;
        candidates.push(...playersDraft[position].slice(from, to));
      }
    });
    const draftPath = `${tourney.tourneyId}-${uid}-${currentMatchday}`;
    const draftRef = db.collection("drafts").doc(draftPath);
    const draftCandidatesRef = db.collection("drafts_candidates").doc(draftPath);
    const params = {
      competitionId, season, matchday: currentMatchday,
      tourneyId: tourney.tourneyId, formation, uid,
    }
    batch.set(draftRef, { ...params, players: Array(11).fill(null) });
    batch.set(draftCandidatesRef, { ...params, candidates });
    try {
      await batch.commit();
      return { type: "fullDraft", formation, candidates };
    } catch (err) {
      console.log(err, err.message);
    }
  } catch (err) {
    throw new functions.https.HttpsError("initDraft Function Error", err);
  }
};

function generateDraftStars(competitionId) {
  let draft;
  if (competitionId === "football_champions_league") {
    draft = [
      4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
    ];
  } else {
    draft = [
      4, 4,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      1, 1, 1,
    ];
  }
  const generatedNumber = getRandomInt(1, 10);
  if (competitionId === "football_champions_league") {
    draft.push(...[5, 5]);
  }
  if (
    generatedNumber === 8 ||
    generatedNumber === 9 ||
    generatedNumber === 10
  ) {
    draft.push(5);
  }
  while (draft.length < 56) {
    const n = getRandomInt(1, 4);
    draft.push(n);
  }
  return draft;
};

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}