import { useEffect, useMemo, useState } from "react";
import { Player, User } from "../types";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setPlayer, setUser } from "../redux/playerSlice";
import {
  User as FBUser,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { auth } from "../backend/firebase/firebaseConfig";
import { mockUsers } from "../backend/fixtures";
import { setupNewUser } from "../backend/setters";
import { sendErrorNotification } from "../redux/notificationSlice";
import { getAppUserByUID, getPlayerByUserID } from "../backend/getters";

export interface UseAuthState {
  userId: string | null;
  user: User | null;
  player: Player | null;
  isAuthed: boolean;
  signOut: () => void;
  signIn: (
    email: string,
    password: string
  ) => Promise<UserCredential | undefined>;
  createAccount: (
    email: string,
    password: string
  ) => Promise<string | undefined>;
  fbUser: FBUser | null;
}

export const useAuthState = (): UseAuthState => {
  const { player, user } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  const [fbUser, setFbUser] = useState<FBUser | null>(null);

  useEffect(() => {
    const fetchLinkedUser = async (): Promise<void> => {
      const thisUser = await getAppUserByUID(fbUser?.uid);
      if (thisUser && thisUser.id) dispatch(setUser(thisUser));
      else {
        dispatch(setUser(null));
      }
    };
    fetchLinkedUser();
  }, [dispatch, fbUser]);

  useEffect(() => {
    const fetchLinkedPlayer = async (): Promise<void> => {
      const thisPlayer = await getPlayerByUserID(user?.id);
      if (thisPlayer && thisPlayer.id) {
        dispatch(setPlayer(thisPlayer));
      } else {
        dispatch(setPlayer(null));
      }
    };
    fetchLinkedPlayer();
  }, [user?.id, dispatch]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setFbUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  const createAccount = async (
    email: string,
    password: string
  ): Promise<string | undefined> => {
    try {
      const result = await setupNewUser(email, password);
      return result;
    } catch (error) {
      console.error(error);
      dispatch(
        sendErrorNotification("There was an error creating your account")
      );
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential | undefined> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      dispatch(sendErrorNotification("An error occurred signing in"));
      console.error(error);
      return undefined;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      dispatch(sendErrorNotification("An error occurred while signing out"));
      console.error(e);
    }
  };

  const isAuthed = useMemo(() => {
    return Boolean(fbUser);
  }, [fbUser]);

  return {
    userId: user?.id ?? null,
    user,
    fbUser,
    player,
    isAuthed,
    signOut,
    signIn,
    createAccount,
  };
};
