import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  hideInactivePlayers: boolean;
  gameStartSoundEffect: boolean;
  trackAlcohol: boolean;
}

const initialState: SettingsState = {
  hideInactivePlayers: false,
  gameStartSoundEffect: true,
  trackAlcohol: false,
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
    setTrackAlcohol: (state, action: PayloadAction<boolean>) => {
      state.trackAlcohol = action.payload;
    },
  },
});

export const {
  setHideInactivePlayers,
  setGameStartSoundEffect,
  setTrackAlcohol,
} = settingsSlice.actions;

export default settingsSlice.reducer;
