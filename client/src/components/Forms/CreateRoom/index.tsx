import { useState } from "react"
import React ,{MouseEvent} from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../store/UserSlice";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";

interface Props{
  socket:Socket
}

const CreateRoom:React.FC<Props> = ({socket}) => {
  const [name,setName] = useState<string>("");
  const uid = useSelector((state:RootState)=>state.user.uuid || '');
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleGenerateRoom=(e:MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    const roomData={
      name,
      roomId:uid,
      userId:uuidv4(),
      host:true,
      presenter:true,
    }
    dispatch(userActions.setUser(roomData));
    socket.emit("userJoined",roomData);
    navigate(`/room/${uid}`);
  }

  return (
    <div className="border-2 border-black h-96 w-3/12 bg-white">
      <h3 className="font-bold text-center text-blue-700">Create Room</h3>
      <form className="p-4">
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your name" className="py-1 px-1 border-2 mb-2 rounded-sm" />
        <div className="flex gap-1">
          <input type="text" value={uid} onChange={()=>dispatch(userActions.createUID())} placeholder="Generate room code" className="py-1 px-1 border-2 mb-2 rounded-sm" />
          <button className=" bg-blue-700 text-white rounded-l px-2 py-1" onClick={(a)=>{a.preventDefault();dispatch(userActions.createUID());}}>Generate</button>
        </div>
        <button className=" bg-blue-700 text-white px-10 py-2 rounded-lg w-full mt-3" onClick={handleGenerateRoom}>Generate Room</button>
      </form>
    </div>
  )
}

export default CreateRoom