// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game } from "../types";
import { v4 as uuidv4 } from "uuid";

interface PlayerState {
  currentGame: Game | null;
  gameIsInProgress: boolean;
  lastGameId: string | null;
}

const initialState: PlayerState = {
  currentGame: null,
  gameIsInProgress: false,
  lastGameId: null,
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
      state.currentGame = resolvedGame;
      state.gameIsInProgress = true;
    },
    clearGame: (state, _action: PayloadAction<void>) => {
      state.currentGame = null;
      state.gameIsInProgress = false;
    },
    setLastGameId: (state, action: PayloadAction<string | null>) => {
      state.lastGameId = action.payload;
    },
  },
});

export const { initializeGame, clearGame, setLastGameId } = gameSlice.actions;

export default gameSlice.reducer;
