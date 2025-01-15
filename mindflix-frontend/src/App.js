import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminUpload from "./components/AdminUpload";
import VideoPlayer from "./components/VideoPlayer";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // Track the user's role

  const handleSignIn = (user, userRole) => {
    setIsLoggedIn(true);
    setUsername(user);
    setRole(userRole); // Set role when logging in
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername("");
    setRole(""); // Reset role on logout
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} username={username} role={role} onSignOut={handleSignOut} />
      <Routes>
        {/* Protected Home Page */}
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Home username={username} />
            </ProtectedRoute>
          }
        />
        {/* Public Routes */}
        <Route path="/signup" element={<Signup onSignIn={handleSignIn} />} />
        <Route path="/login" element={<Login onSignIn={handleSignIn} />} />
        
        <Route
          path="/upload"
          element={isLoggedIn && role === "admin" ? (
            <AdminUpload username={username} />
          ) : (
            <Login onSignIn={handleSignIn} />
          )}
        />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile username={username} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
