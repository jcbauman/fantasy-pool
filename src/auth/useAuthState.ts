import { useEffect, useMemo, useState } from "react";
import { Player, User } from "../types";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setPlayer, setUserId, signOutAndClearIds } from "../redux/playerSlice";
import { useAppContext } from "../context/AppContext";

const USER_ID_KEY = "FANTASY_POOL_USER_ID";

interface AuthState {
  userId: string | null;
  user: User | undefined;
  player: Player | null;
  isAuthed: boolean;
  signOut: () => void;
  signIn: (userId: string) => void;
}

export const useAuthState = (): AuthState => {
  const { player, userId } = useSelector((state: RootState) => state.player);
  const { users, players } = useAppContext();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    const storedId = localStorage.getItem(USER_ID_KEY);
    if (storedId && storedId !== userId) dispatch(setUserId(storedId));
  }, [dispatch, userId]);

  useEffect(() => {
    const linkedUser = users.find((u) => u.id === userId);
    const linkedPlayer = players.find((u) => u.linkedUserId === userId);
    setUser(linkedUser);
    if (linkedPlayer) dispatch(setPlayer(linkedPlayer));
  }, [userId, dispatch, users, players]);

  const signOut = (): void => {
    localStorage.removeItem(USER_ID_KEY);
    window.location.reload();
    dispatch(signOutAndClearIds());
  };

  const signIn = (userId: string): void => {
    localStorage.setItem(USER_ID_KEY, userId);
    dispatch(setUserId(userId));
  };

  const isAuthed = useMemo(() => {
    return Boolean(userId);
  }, [userId]);

  return {
    userId,
    user,
    player,
    isAuthed,
    signOut,
    signIn,
  };
};
