import "./App.css";
import Login from "./components/Login";
import NoMatch from "./components/NoMatch";
import { Route, Routes } from "react-router";
import MainApp from "./components/MainApp";
import HospitalDashboard from "./components/hospital/hospitalDashboard";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path={'/app'} element={<MainApp />} />2
        <Route path="*" element={<NoMatch />} />
        <Route path="/dashboard" element={<HospitalDashboard />} />
      </Routes>
    </>
  );
}

export default App;
