// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player, User } from "../types";

interface PlayerState {
  player: Player | null;
  user: User | null;
}

const initialState: PlayerState = {
  player: null,
  user: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (state, action: PayloadAction<Player | null>) => {
      state.player = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    signOutAndClearIds: (state) => {
      state.player = null;
      state.user = null;
    },
  },
});

export const { setPlayer, setUser, signOutAndClearIds } = playerSlice.actions;

export default playerSlice.reducer;
