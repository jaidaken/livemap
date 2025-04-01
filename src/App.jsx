import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Map from "./Map";
import Chosen from "./Chosen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/chosen" element={<Chosen />} />
      </Routes>
    </Router>
  );
}

export default App;
