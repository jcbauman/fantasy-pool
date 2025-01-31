// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavState {
  sortBy: string;
  locationSortBy: string;
}

const initialState: NavState = {
  sortBy: "name",
  locationSortBy: "name",
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setPlayerSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setLocationSortBy: (state, action: PayloadAction<string>) => {
      state.locationSortBy = action.payload;
    },
  },
});

export const { setPlayerSortBy, setLocationSortBy } = navSlice.actions;

export default navSlice.reducer;
