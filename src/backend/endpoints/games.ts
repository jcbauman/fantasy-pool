import {
  addDoc,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { Game } from "../../types";
import { firestore, GAMES_COLLECTION } from "../firebase/controller";
import { sortGamesByDate } from "../../utils/gameUtils";
import { getSeasonStart, getThreeMonthsAgo } from "../../utils/dateUtils";
import { sendErrorNotification } from "../../shared-components/toasts/notificationToasts";

export const useFetchGames = (): Game[] => {
  const [games, setGames] = useState<Game[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      GAMES_COLLECTION,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setGames(
          snapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Game, "id">;
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
  return sortGamesByDate(games);
};

export const useFetchGamesAfterDate = (): Game[] => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const lastSeasonCutoff = getSeasonStart();
    const gamesQuery = query(
      GAMES_COLLECTION,
      where("createdAt", ">", Timestamp.fromDate(new Date(lastSeasonCutoff)))
    );

    const unsubscribe = onSnapshot(
      gamesQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setGames(
          snapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Game, "id">;
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
  return sortGamesByDate(games);
};

export const getGamesForPlayer = async (
  playerId: string
): Promise<Game[] | undefined> => {
  if (!playerId) return;
  const q = query(
    GAMES_COLLECTION,
    where("playerIds", "array-contains", playerId)
  );

  try {
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents as Game[];
  } catch (error) {
    sendErrorNotification(`Error querying games: ${error}`);
    return [];
  }
};

export const fetchGameById = async (id: string): Promise<Game | undefined> => {
  const docSnap = await getDoc(doc(firestore, `games/${id}`));
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<Game, "id">;
    return {
      id: docSnap.id,
      ...data,
    };
  } else {
    console.error("No game record found found for ", id);
  }
};

export const getGamesForPlayerAfterDate = async (
  playerId: string
): Promise<Game[] | undefined> => {
  if (!playerId) return;

  const cutoffDate = Timestamp.fromDate(new Date(getSeasonStart()));

  const q = query(
    GAMES_COLLECTION,
    where("playerIds", "array-contains", playerId),
    where("createdAt", ">", cutoffDate) // Add the createdAt filter
  );

  try {
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents as Game[];
  } catch (error) {
    sendErrorNotification(`Error querying games: ${error}`);
    return [];
  }
};

export const getAllGamesForLastSeason = async (): Promise<
  Game[] | undefined
> => {
  const startDate = Timestamp.fromDate(
    new Date(getSeasonStart(getThreeMonthsAgo()))
  );
  const endDate = Timestamp.fromDate(new Date(getSeasonStart()));

  const q = query(
    GAMES_COLLECTION,
    where("createdAt", "<", endDate),
    where("createdAt", ">", startDate)
  );

  try {
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents as Game[];
  } catch (error) {
    sendErrorNotification(`Error querying games: ${error}`);
    return [];
  }
};

export const getPlayerGamesForLastSeason = async (
  playerId: string
): Promise<Game[] | undefined> => {
  const startDate = Timestamp.fromDate(
    new Date(getSeasonStart(getThreeMonthsAgo()))
  );
  const endDate = Timestamp.fromDate(new Date(getSeasonStart()));

  const q = query(
    GAMES_COLLECTION,
    where("createdAt", "<", endDate),
    where("createdAt", ">", startDate),
    where("playerIds", "array-contains", playerId)
  );

  try {
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents as Game[];
  } catch (error) {
    sendErrorNotification(`Error querying games: ${error}`);
    return [];
  }
};

export const fetchGamesByTimestamp = async (
  startDate: Date
): Promise<Game[]> => {
  const startTimestamp = Timestamp.fromDate(startDate);

  const q = query(
    GAMES_COLLECTION,
    where("createdAt", ">=", startTimestamp),
    orderBy("createdAt", "asc") // Order results by timestamp
  );

  const querySnapshot = await getDocs(q);
  const documents: Game[] = [];

  querySnapshot.forEach((doc) => {
    documents.push({
      id: doc.id,
      ...doc.data(),
    } as Game);
  });

  return documents;
};

export const paginatedFetchGames = async (
  lastDoc: QueryDocumentSnapshot | null,
  pageSize: number
): Promise<{ games: Game[]; lastVisible: QueryDocumentSnapshot | null }> => {
  const q = lastDoc
    ? query(
        GAMES_COLLECTION,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      )
    : query(GAMES_COLLECTION, orderBy("createdAt", "desc"), limit(pageSize));

  const querySnapshot = await getDocs(q);
  const games: Game[] = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Game)
  );

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { games, lastVisible };
};

export const addNewGame = async (
  game: Omit<Game, "id">
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(GAMES_COLLECTION, { ...game });
    return docRef.id;
  } catch (e) {
    console.error("Unable to add game, missing permissions");
  }
};

export const updateExistingGame = async (
  resolvedGame: Omit<Game, "id">,
  gameId: string,
  onSuccess?: () => void,
  onError?: () => void
): Promise<void> => {
  try {
    const docRef = doc(db, "games", gameId);
    await updateDoc(docRef, resolvedGame);
    onSuccess?.();
  } catch (e) {
    console.error("Unable to update game, missing permissions");
    onError?.();
  }
};

export const deleteGame = async (
  gameId: string,
  onSuccess?: (msg: string) => void,
  onError?: (msg: string) => void
) => {
  try {
    // Reference to the document
    const docRef = doc(db, "games", gameId);

    // Delete the document
    if (docRef) {
      await deleteDoc(docRef);
      onSuccess?.(`Successfully deleted game ${gameId}`);
    }
  } catch (error) {
    onError?.(`Error deleting game, ${error}`);
  }
};
