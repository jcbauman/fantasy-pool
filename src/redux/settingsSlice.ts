import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  hideInactivePlayers: boolean;
  gameStartSoundEffect: boolean;
  useOriginalGameEntryInterface?: boolean;
}

const initialState: SettingsState = {
  hideInactivePlayers: false,
  gameStartSoundEffect: true,
  useOriginalGameEntryInterface: false,
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
    setUseOriginalGameEntryInterface: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.useOriginalGameEntryInterface = action.payload;
    },
  },
});

export const {
  setHideInactivePlayers,
  setGameStartSoundEffect,
  setUseOriginalGameEntryInterface,
} = settingsSlice.actions;

export default settingsSlice.reducer;
