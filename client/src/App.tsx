import { Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Roompage from "./pages/Roompage"
import { io,Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

function App() {

  const server = 'http://localhost:5000';
  const connectionOptions:any={
    "force new connection":true,
    reconnectionAttempts:"Infinity",
    timeout:10000,
    transports:["websocket"],
  }

  const socket:Socket = io(server,connectionOptions);
     useEffect(()=>{
    socket.on("broadcastMessageUserJoin",(name)=>{
      console.log('name is ',name);
      toast.info(`${name} has joined the Room`);
    })
  },[socket])

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
