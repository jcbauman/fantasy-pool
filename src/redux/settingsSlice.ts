import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  hideInactivePlayers: boolean;
  gameStartSoundEffect: boolean;
  useMultiBallEntryV1: boolean;
  hideInactiveLocations: boolean;
}

const initialState: SettingsState = {
  hideInactivePlayers: false,
  gameStartSoundEffect: true,
  useMultiBallEntryV1: false,
  hideInactiveLocations: false,
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
    setHideInactiveLocations: (state, action: PayloadAction<boolean>) => {
      state.hideInactiveLocations = action.payload;
    },
  },
});

export const {
  setHideInactivePlayers,
  setGameStartSoundEffect,
  setUseMultiBallEntryV1,
  setHideInactiveLocations,
} = settingsSlice.actions;

export default settingsSlice.reducer;
