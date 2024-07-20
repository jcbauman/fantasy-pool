import { useEffect, useMemo, useState } from "react";
import { Player, User } from "../types";
import { mockPlayers, mockUsers } from "../backend/fixtures";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setPlayer, setUserId, signOutAndClearIds } from "../redux/playerSlice";

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
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    const storedId = localStorage.getItem(USER_ID_KEY);
    if (storedId && storedId !== userId) dispatch(setUserId(storedId));
  }, [dispatch, userId]);

  useEffect(() => {
    const linkedUser = mockUsers.find((u) => u.id === userId);
    const linkedPlayer = mockPlayers.find((u) => u.linkedUserId === userId);
    setUser(linkedUser);
    if (linkedPlayer) dispatch(setPlayer(linkedPlayer));
  }, [userId, dispatch]);

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
