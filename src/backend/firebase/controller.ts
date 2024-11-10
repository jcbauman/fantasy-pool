import { collection, getFirestore } from "firebase/firestore";
import { app } from "./firebaseConfig";

export const firestore = getFirestore(app);

// collection
export const GAMES_COLLECTION = collection(firestore, "games");
export const USERS_COLLECTION = collection(firestore, "users");
export const PLAYERS_COLLECTION = collection(firestore, "players");
export const LEAGUE_COLLECTION = collection(firestore, "leagues");
export const LOCATIONS_COLLECTION = collection(firestore, "locations");

//setters
