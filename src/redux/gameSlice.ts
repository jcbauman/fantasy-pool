// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game } from "../types";
import { v4 as uuidv4 } from "uuid";

interface PlayerState {
  game: Game | null;
  gameIsInProgress: boolean;
}

const initialState: PlayerState = {
  game: null,
  gameIsInProgress: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initializeGame: (
      state,
      action: PayloadAction<Omit<Game, "id" | "statsByPlayer">>
    ) => {
      const resolvedGame: Game = {
        id: uuidv4(),
        playerIds: action.payload.playerIds,
        timestamp: action.payload.timestamp,
        location: action.payload.location,
        statsByPlayer: [],
      };
      state.game = resolvedGame;
      state.gameIsInProgress = true;
    },
    clearGame: (state, _action: PayloadAction<void>) => {
      state.game = null;
      state.gameIsInProgress = false;
    },
  },
});

export const { initializeGame, clearGame } = gameSlice.actions;

export default gameSlice.reducer;
