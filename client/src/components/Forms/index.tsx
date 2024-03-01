import CreateRoom from "./CreateRoom"
import JoinRoom from "./JoinRoom"

const Form = () => {
  return (
    <div className="flex items-center h-[100vh] justify-around">
        <CreateRoom/>
        <JoinRoom/>
    </div>
  )
}

export default Form