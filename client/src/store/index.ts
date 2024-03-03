import { configureStore } from "@reduxjs/toolkit";
import userSlice, { initialUserType } from "./UserSlice";

export interface storeType{
    user:initialUserType
}
const store = configureStore({
    reducer:{user:userSlice.reducer}
})

export default store;