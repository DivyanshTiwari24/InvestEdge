import React, { useState, useEffect } from "react";

import Menu from "./Menu";
// items only on top left+Menu
const TopBar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2} </p>
          <p className="percent"> </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
        <button onClick={toggleTheme} className="theme-toggle-btn" style={{ marginLeft: "20px", background: "none", border: "1px solid #ccc", padding: "5px 10px", cursor: "pointer", borderRadius: "4px", color: "inherit" }}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
