import { useState } from "react"
import { useDispatch } from "react-redux"
import { Socket } from "socket.io-client"
import {v4 as uuidv4} from 'uuid'
import { userActions } from "../../../store/UserSlice"
import { useNavigate } from "react-router-dom"


interface Props{
  socket:Socket
}
const JoinRoom:React.FC<Props> = ({socket}) => {
  const [name,setName] = useState<string>('');
  const [room,setRoom] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleJoinRoom=()=>{
    const roomData = {
      name,
      roomId:room,
      userId:uuidv4(),
      host:false,
      presenter:false
    }
    socket.emit('userJoined',roomData);
    dispatch(userActions.setUser(roomData));
    navigate(`/room/${room}`);
  }
  return (
    <div className="border-2 border-black h-96 w-3/12 bg-white">
      <h3 className="font-bold text-center text-blue-700">Join Room</h3>
      <form className="p-4 flex flex-col">
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your name" className="py-1 px-1 border-2 mb-2 rounded-sm" />
        <input type="text" value={room} onChange={(e)=>setRoom(e.target.value)} placeholder="Enter room code" className="py-1 px-1 border-2 mb-2 rounded-sm" />
        <button onClick={handleJoinRoom} className=" bg-blue-700 text-white px-10 py-2 rounded-lg w-full mt-3">Join Room</button>
      </form>
    </div>
  )
}

export default JoinRoom