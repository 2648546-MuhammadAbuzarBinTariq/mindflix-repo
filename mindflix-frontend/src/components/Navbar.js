import React from "react";
import { Link } from "react-router-dom";

function Navbar({ isLoggedIn, username, role, onSignOut }) {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {!isLoggedIn && <li><Link to="/signup">Signup</Link></li>}
        {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
        
        {isLoggedIn && role === "admin" && <li><Link to="/upload">Upload</Link></li>} {/* Only admins */}
        {isLoggedIn && <li><Link to="/profile">View Profile</Link></li>}
      </ul>
      {isLoggedIn && (
        <div>
          <span>Welcome, {username}!</span>
          <button onClick={onSignOut}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
