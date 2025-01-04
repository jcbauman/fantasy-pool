import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  hideInactivePlayers: boolean;
  gameStartSoundEffect: boolean;
}

const initialState: SettingsState = {
  hideInactivePlayers: false,
  gameStartSoundEffect: true,
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
  },
});

export const { setHideInactivePlayers, setGameStartSoundEffect } =
  settingsSlice.actions;

export default settingsSlice.reducer;
