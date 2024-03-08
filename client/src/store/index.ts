import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice, { initialUserType } from "./UserSlice";

// Define your rootReducer by combining all individual reducers
const rootReducer = combineReducers({
  user: userSlice.reducer,
  // Add more reducers as needed
});

// Define the type for the entire Redux store state
export type RootState = ReturnType<typeof rootReducer>;

// Define the initial state types
export interface StoreType {
  user: initialUserType;
  // Add more initial state types as needed
}

// Create the Redux store with the rootReducer
const store = configureStore({
  reducer: rootReducer,
});

export default store;
