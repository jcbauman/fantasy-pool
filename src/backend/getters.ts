import {
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
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
  USERS_COLLECTION,
} from "./firebase/controller";
import { sortGamesByDate } from "../utils/gameUtils";

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

export const useFetchLocations = (): PoolHallLocation[] => {
  const [locations, setLocations] = useState<PoolHallLocation[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      LOCATIONS_COLLECTION,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setLocations(
          snapshot.docs.map((doc) => {
            const data = doc.data() as Omit<PoolHallLocation, "id">;
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
  return locations;
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

export const fetchDocumentsByTimestamp = async (startDate: Date) => {
  const startTimestamp = Timestamp.fromDate(startDate);

  const q = query(
    GAMES_COLLECTION,
    where("createdAt", ">=", startTimestamp),
    orderBy("createdAt", "asc") // Order results by timestamp
  );

  const querySnapshot = await getDocs(q);
  const documents: DocumentData[] = [];

  querySnapshot.forEach((doc) => {
    documents.push({
      id: doc.id,
      ...doc.data(),
    } as DocumentData);
  });

  return documents;
};
