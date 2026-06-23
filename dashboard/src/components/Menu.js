import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LightModeOutlined, DarkModeOutlined } from "@mui/icons-material";

const Menu = ({ theme, toggleTheme }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const navigate = useNavigate();

  // 1. Check if the token exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Destroy the token
    navigate("/login"); // Send them to the login page
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <ul className="nav-menus">
        <li>
          <Link
            style={{ textDecoration: "none" }}
            to="/"
            onClick={() => handleMenuClick(0)}
          >
            <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
              Dashboard
            </p>
          </Link>
        </li>
        <li>
          <Link
            style={{ textDecoration: "none" }}
            to="/orders"
            onClick={() => handleMenuClick(1)}
          >
            <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
              Orders
            </p>
          </Link>
        </li>
        <li>
          <Link
            style={{ textDecoration: "none" }}
            to="/holdings"
            onClick={() => handleMenuClick(2)}
          >
            <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
              Holdings
            </p>
          </Link>
        </li>
        <li>
          <Link
            style={{ textDecoration: "none" }}
            to="/positions"
            onClick={() => handleMenuClick(3)}
          >
            <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
              Positions
            </p>
          </Link>
        </li>
      </ul>

      <div className="profile-section">
        {/* Modern Icon-Based Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          style={{ 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            borderRadius: "50%",
            transition: "all 0.2s ease"
          }}
          className="theme-toggle-icon"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <DarkModeOutlined style={{ fontSize: "20px" }} /> : <LightModeOutlined style={{ fontSize: "20px" }} />}
        </button>

        <hr className="menu-vertical-hr" />
        
        {isAuthenticated ? (
          <div className="profile" onClick={handleLogout} style={{ cursor: "pointer" }}>
            <div className="avatar">Hi</div>
            <p className="username" style={{ cursor: "pointer" }}>Logout</p>
          </div>
        ) : (
          <div className="auth-links" style={{ display: "flex", gap: "15px" }}>
            <Link to="/login" style={{ textDecoration: "none", color: "#4184f3", fontWeight: "500" }}>
              Login
            </Link>
            <Link to="/signup" style={{ textDecoration: "none", color: "#ff5722", fontWeight: "500" }}>
              Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;