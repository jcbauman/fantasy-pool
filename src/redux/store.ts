// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import playerReducer from "./playerSlice";
import gameReducer from "./gameSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  player: playerReducer,
  game: gameReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
