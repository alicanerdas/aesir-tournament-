import { create } from 'zustand';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  updateDoc
} from 'firebase/firestore';

const generateId = () => Math.random().toString(36).substr(2, 9);

const useStore = create((set, get) => ({
  tournaments: [],
  registrations: [],
  initialized: false,

  initFirebase: () => {
    if (get().initialized) return;

    // Listen to tournaments
    const unsubTournaments = onSnapshot(collection(db, 'tournaments'), (snapshot) => {
      const tournaments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by createdAt descending
      tournaments.sort((a, b) => b.createdAt - a.createdAt);
      set({ tournaments });
    });

    // Listen to registrations
    const unsubRegistrations = onSnapshot(collection(db, 'registrations'), (snapshot) => {
      const registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ registrations });
    });

    set({ initialized: true });
  },

  addTournament: async (name, type) => {
    const id = generateId();
    const newTournament = { name, type, status: 'open', createdAt: Date.now() };
    await setDoc(doc(db, 'tournaments', id), newTournament);
    return id;
  },

  deleteTournament: async (tournamentId) => {
    await deleteDoc(doc(db, 'tournaments', tournamentId));
    // Also delete associated registrations
    const { registrations } = get();
    const toDelete = registrations.filter(r => r.tournamentId === tournamentId);
    for (const reg of toDelete) {
      await deleteDoc(doc(db, 'registrations', reg.id));
    }
  },

  addRegistration: async (tournamentId, players, clanName) => {
    const id = generateId();
    const newReg = { tournamentId, players, clanName, registeredAt: Date.now() };
    await setDoc(doc(db, 'registrations', id), newReg);
    return id;
  },

  deleteClan: async (registrationId) => {
    await deleteDoc(doc(db, 'registrations', registrationId));
  },

  startMatchmaking: async (tournamentId) => {
    const { registrations, tournaments } = get();
    const teams = registrations.filter(r => r.tournamentId === tournamentId);

    // Shuffle teams
    const shuffled = [...teams].sort(() => Math.random() - 0.5);

    // Create bracket rounds
    const rounds = buildBracket(shuffled);

    await updateDoc(doc(db, 'tournaments', tournamentId), {
      status: 'started',
      bracket: rounds
    });
  },

  advanceWinner: async (tournamentId, roundIndex, matchIndex, winnerIndex) => {
    const tournament = get().tournaments.find(t => t.id === tournamentId);
    if (!tournament || !tournament.bracket) return;

    const bracket = JSON.parse(JSON.stringify(tournament.bracket));
    const match = bracket[roundIndex][matchIndex];

    if (!match) return;
    match.winner = winnerIndex;

    // Advance to next round if exists
    if (roundIndex + 1 < bracket.length) {
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const slot = matchIndex % 2 === 0 ? 0 : 1;
      if (!bracket[roundIndex + 1][nextMatchIndex]) {
        bracket[roundIndex + 1][nextMatchIndex] = { teams: [null, null] };
      }
      bracket[roundIndex + 1][nextMatchIndex].teams[slot] = match.teams[winnerIndex];
    }

    await updateDoc(doc(db, 'tournaments', tournamentId), { bracket });
  }
}));

function buildBracket(teams) {
  // Pad to nearest power of 2
  const size = Math.pow(2, Math.ceil(Math.log2(Math.max(teams.length, 2))));
  const padded = [...teams];
  while (padded.length < size) padded.push(null); // BYE

  const rounds = [];
  let current = [];
  for (let i = 0; i < padded.length; i += 2) {
    current.push({ teams: [padded[i], padded[i + 1]], winner: null });
  }
  rounds.push(current);

  while (current.length > 1) {
    const nextRound = [];
    for (let i = 0; i < current.length; i += 2) {
      nextRound.push({ teams: [null, null], winner: null });
    }
    rounds.push(nextRound);
    current = nextRound;
  }

  return rounds;
}

export default useStore;
