import {
  addDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Player } from "../../types";
import { firestore, PLAYERS_COLLECTION } from "../firebase/controller";
import { db } from "../firebase/firebaseConfig";

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

export const createNewPlayer = async (
  player: Omit<Player, "id">,
  onSuccess: () => void,
  onFailure: () => void
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(PLAYERS_COLLECTION, {
      ...player,
    });
    onSuccess();
    return docRef.id;
  } catch (e) {
    console.error("Unable to add player, missing permissions");
    onFailure?.();
  }
};

export const updateCurrentPlayer = async (
  player: Omit<Player, "id">,
  playerId: string,
  onSuccess?: () => void,
  onError?: () => void
): Promise<void> => {
  try {
    const docRef = doc(db, "players", playerId);
    await updateDoc(docRef, player);
    onSuccess?.();
  } catch (e) {
    console.error("Unable to add player, missing permissions");
    onError?.();
  }
};
