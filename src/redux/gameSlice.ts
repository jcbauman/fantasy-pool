// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game, GameStat, GameStatKeys } from "../types";
import { defaultGameStat } from "../utils/constants";

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
      const baseStats = action.payload.playerIds.map((playerId) => {
        return {
          playerId,
          ...defaultGameStat,
        };
      });
      const resolvedGame: Game = {
        id: "",
        playerIds: action.payload.playerIds,
        timestamp: action.payload.timestamp,
        location: action.payload.location,
        statsByPlayer: baseStats,
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
    updateStat: (state, action: PayloadAction<GameStat[]>) => {
      if (state.currentGame) {
        state.currentGame.statsByPlayer = action.payload;
      }
    },
  },
});

export const { initializeGame, clearGame, setLastGameId, updateStat } =
  gameSlice.actions;

export default gameSlice.reducer;
