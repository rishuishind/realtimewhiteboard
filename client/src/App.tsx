import { Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Roompage from "./pages/Roompage"

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/room/:id" element={<Roompage/>}/>
    </Routes>
    </>
  )
}

export default App
