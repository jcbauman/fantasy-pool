import {
  addDoc,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { SESSIONS_COLLECTION } from "./firebase/controller";
import { Game, GameStat, Session } from "../types";
import { db } from "./firebase/firebaseConfig";
import { getStatsForPlayerGames } from "../pages/playersList/utils/playerUtils";

export const useFetchSessions = (): Session[] => {
  const [sessions, setSessions] = useState<Session[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      SESSIONS_COLLECTION,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setSessions(
          snapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Session, "id">;
            return {
              id: doc.id,
              ...data,
            };
          })
        );
      }
    );
    return () => unsubscribe();
  }, []);
  return sessions;
};

export const getSessionsForPlayer = async (
  playerId: string
): Promise<Session[] | undefined> => {
  if (!playerId) return;
  const q = query(
    SESSIONS_COLLECTION,
    where("playerIds", "array-contains", playerId)
  );

  try {
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents as Session[];
  } catch (error) {
    console.error("Error querying sessions: ", error);
    return [];
  }
};

export const addNewSession = async (
  session: Omit<Session, "id">
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(SESSIONS_COLLECTION, { ...session });
    return docRef.id;
  } catch (e) {
    console.error("Unable to add session, missing permissions");
  }
};

export const updateExistingSession = async (
  resolvedSession: Omit<Session, "id">,
  sessionId: string,
  onSuccess?: () => void,
  onError?: () => void
): Promise<void> => {
  try {
    const docRef = doc(db, "sessions", sessionId);
    await updateDoc(docRef, resolvedSession);
    onSuccess?.();
  } catch (e) {
    console.error("Unable to update session, missing permissions");
    onError?.();
  }
};

export const addGameToExistingSession = async (
  session: Session,
  newGame: Game,
  onSuccess?: () => void,
  onError?: () => void
): Promise<void> => {
  // const resolvedSession = combineGameToExistingSession(session, newGame);
  // if (resolvedSession) {
  //   const { id, ...sessionNoId } = resolvedSession;
  //   await updateExistingSession(sessionNoId, id, onSuccess, onError);
  // } else {
  //   onError?.();
  // }
};

export const createNewSessionFromGames = async (
  games: Game[],
  scoringMatrix: { [key: string]: number }
): Promise<string | undefined> => {
  try {
    const firstGame = games?.[0];
    if (!firstGame) throw new Error("No games");
    const playerIdArrays = games.map((g) => g.playerIds);
    let playerIds = [...new Set(playerIdArrays.flat())];

    let statsByPlayer: GameStat[] = [];
    playerIds.forEach((playerId) => {
      const stats = getStatsForPlayerGames(playerId, games, scoringMatrix);
      statsByPlayer.push(stats);
    });
    const resolvedSession: Session = {
      ...firstGame,
      games,
      playerIds,
      statsByPlayer,
    };
    const docRef = await addDoc(SESSIONS_COLLECTION, { ...resolvedSession });
    return docRef.id;
  } catch (e) {
    console.error(`Unable to add session, ${e}`);
  }
};
