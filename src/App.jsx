import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Map from "./Map";
import Chosen from "./Chosen";
import Admin from "./Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/chosen" element={<Chosen />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
