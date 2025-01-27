import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  hideInactivePlayers: boolean;
  gameStartSoundEffect: boolean;
  useOldGameEntryInterface?: boolean;
}

const initialState: SettingsState = {
  hideInactivePlayers: false,
  gameStartSoundEffect: true,
  useOldGameEntryInterface: false,
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
    setUseOldGameEntryInterface: (state, action: PayloadAction<boolean>) => {
      state.useOldGameEntryInterface = action.payload;
    },
  },
});

export const {
  setHideInactivePlayers,
  setGameStartSoundEffect,
  setUseOldGameEntryInterface,
} = settingsSlice.actions;

export default settingsSlice.reducer;
