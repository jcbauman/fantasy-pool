import {
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
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Game, League, Player, PoolHallLocation, User } from "../types";
import {
  firestore,
  GAMES_COLLECTION,
  LOCATIONS_COLLECTION,
  PLAYERS_COLLECTION,
  RECORDS_COLLECTION,
  USERS_COLLECTION,
} from "./firebase/controller";
import { sortGamesByDate } from "../utils/gameUtils";
import { getSeasonStart, getThreeMonthsAgo } from "../utils/dateUtils";
import { SeasonRecords } from "../pages/playersList/utils/playerUtils";
import { FullSeasonRecordObject } from "./setters";

// games

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
    console.error("Error querying games: ", error);
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
    console.error("Error querying games: ", error);
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
    console.error("Error querying games: ", error);
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
    console.error("Error querying games: ", error);
    return [];
  }
};

export const useFetchUsers = (): User[] => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      USERS_COLLECTION,
      (snapshot: QuerySnapshot<DocumentData>) =>
        setUsers(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              fbID: data.fbID,
              email: data.email,
              name: data.name,
              leagueId: data.leagueId,
              isAppAdmin: data.isAppAdmin,
            };
          })
        )
    );
    return () => unsubscribe();
  }, []);
  return users;
};

export const useFetchPlayers = (): Player[] => {
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      PLAYERS_COLLECTION,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setPlayers(
          snapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Player, "id">;
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
  return players;
};

export const useFetchLocations = (): string[] => {
  const [locations, setLocations] = useState<PoolHallLocation[]>([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(LOCATIONS_COLLECTION);
        const docsData: PoolHallLocation[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<PoolHallLocation, "id">;
          return {
            id: doc.id,
            ...data,
          };
        });
        setLocations(docsData);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchDocuments();
  }, []);

  const reducedLocations = locations.map((l) => l.name);
  return [...new Set(reducedLocations)].sort();
};

export const fetchPlayerById = async (
  id: string
): Promise<Player | undefined> => {
  const docSnap = await getDoc(doc(firestore, `players/${id}`));
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<Player, "id">;
    return {
      id: docSnap.id,
      ...data,
    };
  } else {
    console.error("No player record found found for ", id);
  }
};

export const getPlayerByUserID = async (
  id?: string
): Promise<Player | undefined> => {
  if (!id) return;
  try {
    if (!id) throw new Error("No ID");
    const q = query(PLAYERS_COLLECTION, where("linkedUserId", "==", id));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents[0] as Player;
  } catch (error) {
    console.error("Error querying players: ", error);
    return undefined;
  }
};

export const fetchLeague = async (id: string): Promise<League | undefined> => {
  const docSnap = await getDoc(doc(firestore, `leagues/${id}`));
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<League, "id">;
    return {
      id: docSnap.id,
      ...data,
    };
  } else {
    console.error("No league record found for ", id);
  }
};

export const getAppUserByUID = async (
  uID?: string
): Promise<User | undefined> => {
  try {
    if (!uID) return;
    const q = query(USERS_COLLECTION, where("fbID", "==", uID));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents[0] as User;
  } catch (error) {
    console.error("Error getting user ", error);
    return undefined;
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

export const getXWeeksAgo = (weeks: number): Date => {
  const today = new Date();
  const xWeeksAgo = new Date(today.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
  return xWeeksAgo;
};

export const getPastSeasonHistoricalRecord = async (
  seasonStart?: string
): Promise<SeasonRecords | undefined> => {
  const lastSeasonEnd = seasonStart ?? getSeasonStart();
  try {
    if (!lastSeasonEnd) throw new Error("No date");
    const q = query(
      RECORDS_COLLECTION,
      where("seasonEndDate", "==", lastSeasonEnd)
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    const fullRec = documents[0] as FullSeasonRecordObject;
    return fullRec?.records;
  } catch (error) {
    console.error("Error querying historical record: ", error);
    return undefined;
  }
};
