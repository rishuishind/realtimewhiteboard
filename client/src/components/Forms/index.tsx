import CreateRoom from "./CreateRoom"
import JoinRoom from "./JoinRoom"

const Form = () => {
  return (
    <div className="flex items-center h-[100vh] justify-around bg-gradient-to-r from-orange-300 bg-red-400">
        <CreateRoom/>
        <JoinRoom/>
    </div>
  )
}

export default Form