import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token"); // if you are using JWT
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">
        <div>
          <img 
            src="https://raw.githubusercontent.com/github/explore/main/topics/github/github.png" 
            alt="GitHub Logo"
          />
          <h3>Github</h3>
        </div>
      </Link>

      <div>
        <Link to="/create"><p>Create a Repository</p></Link>
        <Link to="/profile"><p>Profile</p></Link>

        {/* 🔥 Logout button */}
        <p onClick={handleLogout} style={{ cursor: "pointer" }}>
          Logout
        </p>
      </div>
    </nav>
  );
};

export default Navbar;