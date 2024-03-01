
const JoinRoom = () => {
  return (
    <div className="border-2 border-black h-96 w-3/12">
      <h3 className="font-bold text-center text-blue-700">Join Room</h3>
      <form className="p-4 flex flex-col">
        <input type="text" placeholder="Enter your name" className="py-1 px-1 border-2 mb-2 rounded-sm" />
        <input type="text" placeholder="Enter room code" className="py-1 px-1 border-2 mb-2 rounded-sm" />
        <button className=" bg-blue-700 text-white px-10 py-2 rounded-lg w-full mt-3">Join Room</button>
      </form>
    </div>
  )
}

export default JoinRoom