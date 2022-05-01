import React from "react";
import Navbar from "./navbar/Navbar";
import "./app.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./registration/Registration";
import Login from "./authorithation/Authorization";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { auth } from "../actions/user";

function App() {
  const isAuth = useSelector((state) => state.user.isAuth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth());
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="wrap">
          {!isAuth && (
            <Routes>
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
