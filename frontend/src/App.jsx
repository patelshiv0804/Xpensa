import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Contact_us from "./pages/Contact_us";
import About_us from "./pages/About_us";
import User_dashboard from "./pages/User_dashboard";
import Scan_bills from "./pages/Scan_bills";
import { ParallaxProvider } from 'react-scroll-parallax';
import "./App.css";

function App() {
  return (
    <ParallaxProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/contact" element={<Contact_us />} />
          <Route path="/about" element={<About_us />} />
          <Route path="/dashboard/*" element={<User_dashboard />} />
          <Route path="/scan_bills" element={<Scan_bills />} />
        </Routes>
      </Router>
    </ParallaxProvider>
  );
}

export default App;
