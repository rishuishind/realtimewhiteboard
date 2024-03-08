import Form from "../components/Forms"
import { Socket } from "socket.io-client"

interface HomepageProps {
  socket: Socket;
}

const Homepage:React.FC<HomepageProps> = ({socket}) => {
  return (
    <>
    <Form socket={socket}/>
    </>
  )
}

export default Homepage