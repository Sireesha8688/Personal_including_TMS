  import "./App.css";
  import Login from "./components/Login";
  import NoMatch from "./components/NoMatch";
  import { Route, Routes } from "react-router";
  import MainApp from "./components/MainApp";

  function App() {
    return (
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path={`/app`} element={<MainApp />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </>
    );

  }


  export default App;