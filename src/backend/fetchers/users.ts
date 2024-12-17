import {
  addDoc,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { User } from "../../types";
import { USERS_COLLECTION } from "../firebase/controller";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

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
