// src/redux/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../types";

interface NotificationState {
  open: boolean;
  message: string;
  error?: boolean;
}

const initialState: NotificationState = {
  open: false,
  message: "",
  error: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    sendSuccessNotificaton: (state, action: PayloadAction<string>) => {
      state.open = true;
      state.message = action.payload;
      state.error = false;
    },
    sendErrorNotification: (state, action: PayloadAction<string>) => {
      state.open = true;
      state.message = action.payload;
      state.error = true;
    },
    closeNotifications: (state) => {
      state.open = false;
    },
  },
});

export const {
  sendSuccessNotificaton,
  sendErrorNotification,
  closeNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
