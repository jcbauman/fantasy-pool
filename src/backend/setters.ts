import { addDoc, doc, updateDoc } from "firebase/firestore";
import { Game, Player, User } from "../types";
import { auth, db } from "./firebase/firebaseConfig";
import {
  GAMES_COLLECTION,
  PLAYERS_COLLECTION,
  USERS_COLLECTION,
} from "./firebase/controller";
import { createUserWithEmailAndPassword } from "firebase/auth";

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

export const setupNewUser = async (
  email: string,
  password: string
): Promise<string | undefined> => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    try {
      const newUser: Omit<User, "id"> = { email, fbID: user.uid ?? "" };
      const docRef = await addDoc(USERS_COLLECTION, newUser);
      return docRef.id;
    } catch (e) {
      console.error(e);
    }
  } catch (error) {
    console.error(error);
  }
};

export const createNewPlayer = async (
  player: Omit<Player, "id">,
  onSuccess: () => void,
  onFailure: () => void
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(PLAYERS_COLLECTION, { ...player });
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
