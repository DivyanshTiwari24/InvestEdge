import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
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
      <div className="menus">
        <ul>
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
        <hr />
        
        {/* 2. THE FIX: Conditional Rendering based on the token */}
        {isAuthenticated ? (
          <div className="profile" onClick={handleLogout} style={{ cursor: "pointer" }}>
            <div className="avatar">Hi</div>
            <p className="username" style={{ cursor: "pointer" }}>Logout</p>
          </div>
        ) : (
          <div className="auth-links" style={{ display: "flex", gap: "15px", marginLeft: "20px" }}>
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