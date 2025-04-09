// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import Homepage from "./component/Homepage"
// import Contact_us from "./component/Contact_us"
// import About_us from "./component/About_us";
// import User_dashboard from "./component/User_dashboard";
// // import Notification_setting from "./component/Notification_settting";

// function App() {

//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Homepage />} />
//           <Route path="/contact" element={<Contact_us />} />
//           <Route path="/about" element={<About_us />} />
//           <Route path="/dashboard" element={<User_dashboard />} />
//           {/* <Route path="/notification_setting" element={<Notification_setting />} /> */}
//         </Routes>
//       </Router>

//     </>

//   );
// }

// export default App


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Contact_us from "./pages/Contact_us";
import About_us from "./pages/About_us";
import User_dashboard from "./pages/User_dashboard";
import Scan_bills from "./pages/Scan_bills";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<Contact_us />} />
        <Route path="/about" element={<About_us />} />
        <Route path="/dashboard/*" element={<User_dashboard />} />
        <Route path="/scan_bills" element={<Scan_bills />} />
      </Routes>
    </Router>
  );
}

export default App;
