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
import { setupNewUser } from "../backend/setters";
import { getAppUserByUID, getPlayerByUserID } from "../backend/getters";
import { clearGame } from "../redux/gameSlice";
import { sendErrorNotification } from "../shared-components/toasts/notificationToasts";

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
  refetchPlayer: () => void;
  authLoading: boolean;
}

export const useAuthState = (): UseAuthState => {
  const { player, user } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  const [fbUser, setFbUser] = useState<FBUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [shouldRefetchPlayer, setShouldRefetchPlayer] = useState(false);

  useEffect(() => {
    const fetchLinkedUser = async (): Promise<void> => {
      const thisUser = await getAppUserByUID(fbUser?.uid);
      if (thisUser && thisUser.id) dispatch(setUser(thisUser));
      else {
        dispatch(setUser(null));
        if (fbUser?.uid) {
          sendErrorNotification("Could not fetch user");
        }
      }
      setShouldRefetchPlayer(true);
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
        if (user?.id) {
          sendErrorNotification("Could not fetch player");
        }
      }
      setShouldRefetchPlayer(false);
    };
    if (shouldRefetchPlayer) {
      fetchLinkedPlayer();
    }
  }, [user?.id, dispatch, shouldRefetchPlayer]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setFbUser(firebaseUser);
      setAuthLoading(false);
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
      sendErrorNotification("There was an error creating your account");
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
      sendErrorNotification("An error occurred signing in");
      console.error(error);
      return undefined;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      dispatch(clearGame());
    } catch (e) {
      sendErrorNotification("An error occurred while signing out");
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
    refetchPlayer: () => setShouldRefetchPlayer(true),
    authLoading,
  };
};
