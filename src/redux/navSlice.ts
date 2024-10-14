// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavState {
  sortBy: string;
}

const initialState: NavState = {
  sortBy: "name",
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setPlayerSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setPlayerSortBy } = navSlice.actions;

export default navSlice.reducer;
