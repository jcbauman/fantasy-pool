// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavState {
  sortBy: string;
  lastDismissedLocationSuggestion: string | null;
  locationSortBy: string;
}

const initialState: NavState = {
  sortBy: "name",
  lastDismissedLocationSuggestion: null,
  locationSortBy: "name",
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setPlayerSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setLastDismissedLocationSuggestion: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.lastDismissedLocationSuggestion = action.payload;
    },
    setLocationSortBy: (state, action: PayloadAction<string>) => {
      state.locationSortBy = action.payload;
    },
  },
});

export const {
  setPlayerSortBy,
  setLastDismissedLocationSuggestion,
  setLocationSortBy,
} = navSlice.actions;

export default navSlice.reducer;
