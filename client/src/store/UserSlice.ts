import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface initialUserType{
    uuid?:string|null;
    name:string,
    roomId?:number|null,
    userId:number|null,
    host:boolean,
    presenter:boolean
    user:[]
}

const initialUserInfo:initialUserType = {uuid:uuidv4(),name:'',roomId:null,userId:null,host:false,presenter:false,user:[]}

const userSlice = createSlice({
    name:'user_slice',
    initialState:initialUserInfo,
    reducers:{
        createUID:(state)=>{
            const newID = uuidv4();
            state.uuid=newID;
        },
        setUser:(state,action)=>{
            state.name = action.payload.name;
            state.roomId=action.payload.roomId;
            state.userId=action.payload.userId;
            state.host=action.payload.host;
            state.presenter = action.payload.presenter;
        },
        addUser:(state,action)=>{
            state.user=action.payload;
        }
    }
});
export const userActions = userSlice.actions;
export default userSlice;