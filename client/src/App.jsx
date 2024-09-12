import { Routes, Route } from "react-router-dom";
import ChatRooms from "./pages/ChatRooms"

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatRooms />} />
    </Routes>
  );
}

export default App;
