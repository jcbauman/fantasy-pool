import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  hideInactivePlayers: boolean;
  gameStartSoundEffect: boolean;
  useMultiBallEntryV1: boolean;
}

const initialState: SettingsState = {
  hideInactivePlayers: false,
  gameStartSoundEffect: true,
  useMultiBallEntryV1: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setHideInactivePlayers: (state, action: PayloadAction<boolean>) => {
      state.hideInactivePlayers = action.payload;
    },
    setGameStartSoundEffect: (state, action: PayloadAction<boolean>) => {
      state.gameStartSoundEffect = action.payload;
    },
    setUseMultiBallEntryV1: (state, action: PayloadAction<boolean>) => {
      state.useMultiBallEntryV1 = action.payload;
    },
  },
});

export const {
  setHideInactivePlayers,
  setGameStartSoundEffect,
  setUseMultiBallEntryV1,
} = settingsSlice.actions;

export default settingsSlice.reducer;
