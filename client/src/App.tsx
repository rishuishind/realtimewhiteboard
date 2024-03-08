import { Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Roompage from "./pages/Roompage"
import { io,Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "./store/UserSlice";

interface ConnectionOptions {
  "force new connection": boolean;
  reconnectionAttempts: number;
  timeout: number;
  transports: string[];
}

function App() {

  const server = 'http://localhost:5000';
  const connectionOptions:ConnectionOptions={
    "force new connection":true,
    reconnectionAttempts:9999999,
    timeout:10000,
    transports:["websocket"],
  }
  const dispatch = useDispatch();

  const socket:Socket = io(server,connectionOptions);
     useEffect(()=>{
    socket.on("broadcastMessageUserJoin",(name)=>{
      console.log('name is ',name);
      toast.info(`${name} has joined the Room`);
    })
  },[socket])
  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      console.log('User is joined ',data)
      dispatch(userActions.addUser(data.user));
    })
  },[socket,dispatch])
  useEffect(()=>{
    socket.on("allUsers",(data)=>{
      console.log('all user ',data);
      dispatch(userActions.addUser(data.user));
    })
  },[socket,dispatch]);
  useEffect(()=>{
    socket.on("userLeaveBroadcastMessage",(name)=>{
      toast.info(`${name} leave the room`);
    })
  })
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Homepage socket={socket}/>}/>
      <Route path="/room/:id" element={<Roompage socket={socket}/>}/>
    </Routes>
    </>
  )
}

export default App
