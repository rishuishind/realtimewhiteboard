import { Socket } from "socket.io-client";
import CreateRoom from "./CreateRoom"
import JoinRoom from "./JoinRoom"

interface HomepageProps {
  socket: Socket;
}

const Form: React.FC<HomepageProps> = ({socket}) => {
  return (
    <div className="flex items-center h-[100vh] justify-around bg-gradient-to-r from-orange-300 bg-red-400">
        <CreateRoom socket={socket}/>
        <JoinRoom socket={socket}/>
    </div>
  )
}

export default Form