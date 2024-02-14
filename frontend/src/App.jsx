import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Notfound from "./components/Notfound";
import Tracking from "./components/Tracking";
import Diet from "./components/Diet";

import { UserContext } from "./contexts/UserContext";
import { useState } from "react";
import Private from "./components/Private";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("newtrition-user"))
  );
  console.log("Initial loggedUser:", loggedUser);

  return (
    <>
      <div>
        <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
          <BrowserRouter>
            <Routes>
              <Route path={`${BACKEND_URL}/`} element={<Login />} />
              <Route path={`${BACKEND_URL}/login`} element={<Login />} />
              <Route path={`${BACKEND_URL}/register`} element={<Register />} />
              <Route
                path={`${BACKEND_URL}/tracking`}
                element={<Private Component={Tracking} />}
              />
              <Route path={`${BACKEND_URL}/diet`} element={<Private Component={Diet} />} />
              <Route path="*" element={<Notfound />} />
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </div>
    </>
  );
}

export default App;
