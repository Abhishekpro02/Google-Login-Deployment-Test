import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import User from "./pages/User";
import { useAuthContext } from "./context/AuthContext";
import ProtectedRoute from "./Protectedroute";

const App = () => {
  const { authUser } = useAuthContext();
  const isAuthenticated = authUser !== null;
  console.log(isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<User />} />
        </Route>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
