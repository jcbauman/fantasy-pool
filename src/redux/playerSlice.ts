// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../types";

interface PlayerState {
  player: Player | null;
  userId: string | null;
}

const initialState: PlayerState = {
  player: null,
  userId: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (state, action: PayloadAction<Player>) => {
      state.player = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    signOutAndClearIds: (state) => {
      state.player = null;
      state.userId = null;
    },
  },
});

export const { setPlayer, setUserId, signOutAndClearIds } = playerSlice.actions;

export default playerSlice.reducer;
