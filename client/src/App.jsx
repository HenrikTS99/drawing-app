import React from "react"
import { Routes, Route } from "react-router-dom"
import RoomDashboard from "./pages/RoomDashboard"

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoomDashboard />} />
    </Routes>
  )
}

export default App
