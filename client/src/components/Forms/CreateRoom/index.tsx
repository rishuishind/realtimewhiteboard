
const CreateRoom = () => {
  return (
    <div className="border-2 border-black h-96 w-auto">
      <h3 className="font-bold text-center text-blue-700">Create Room</h3>
      <form className="p-4">
        <input type="text" placeholder="Enter your name" className="py-1 px-1 border-2 mb-2 rounded-sm" />
        <div className="flex gap-1">
          <input type="text" placeholder="Generate room code" className="py-1 px-1 border-2 mb-2 rounded-sm" />
          <button className=" bg-blue-700 text-white rounded-l px-2 py-1">Generate</button>
          <button className=" border-2 border-red-600 text-red-500 rounded-lg px-2 py-1
          ">Coppy</button>
        </div>
        <button className=" bg-blue-700 text-white px-10 py-2 rounded-lg w-full mt-3">Generate Room</button>
      </form>
    </div>
  )
}

export default CreateRoom