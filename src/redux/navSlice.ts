// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavState {
  sortBy: string;
  lastDismissedLocationSuggestion:string | null
}

const initialState: NavState = {
  sortBy: "name",
  lastDismissedLocationSuggestion: null,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setPlayerSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setLastDismissedLocationSuggestion: (state, action: PayloadAction<string | null>) => {
      state.lastDismissedLocationSuggestion = action.payload;
    },
  },
});

export const { setPlayerSortBy,setLastDismissedLocationSuggestion } = navSlice.actions;

export default navSlice.reducer;
