// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderByFields } from "../types";

interface NavState {
  sortBy: OrderByFields;
}

const initialState: NavState = {
  sortBy: OrderByFields.Name,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setPlayerSortBy: (state, action: PayloadAction<OrderByFields>) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setPlayerSortBy } = navSlice.actions;

export default navSlice.reducer;
