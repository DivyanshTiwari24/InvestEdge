import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  
  // Realistic initial indices values
  const [nifty, setNifty] = useState(23540.60);
  const [niftyChange, setNiftyChange] = useState(120.30);
  const [niftyPercent, setNiftyPercent] = useState(0.51);

  const [sensex, setSensex] = useState(77325.20);
  const [sensexChange, setSensexChange] = useState(380.20);
  const [sensexPercent, setSensexPercent] = useState(0.49);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Simulate real-time stock market fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate random tick updates (small changes)
      const niftyTick = (Math.random() - 0.48) * 4.0; // Slightly positive bias
      const sensexTick = (Math.random() - 0.48) * 12.0;

      setNifty((prev) => {
        const nextVal = prev + niftyTick;
        const diff = nextVal - 23420.30;
        setNiftyChange(diff);
        setNiftyPercent((diff / 23420.30) * 100);
        return nextVal;
      });

      setSensex((prev) => {
        const nextVal = prev + sensexTick;
        const diff = nextVal - 76945.00;
        setSensexChange(diff);
        setSensexPercent((diff / 76945.00) * 100);
        return nextVal;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isNiftyUp = niftyChange >= 0;
  const isSensexUp = sensexChange >= 0;

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className={`index-points ${isNiftyUp ? "up" : "down"}`}>
            {nifty.toFixed(2)}
          </p>
          <p className={`percent ${isNiftyUp ? "up" : "down"}`}>
            {isNiftyUp ? "+" : ""}{niftyChange.toFixed(2)} ({isNiftyUp ? "+" : ""}{niftyPercent.toFixed(2)}%)
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className={`index-points ${isSensexUp ? "up" : "down"}`}>
            {sensex.toFixed(2)}
          </p>
          <p className={`percent ${isSensexUp ? "up" : "down"}`}>
            {isSensexUp ? "+" : ""}{sensexChange.toFixed(2)} ({isSensexUp ? "+" : ""}{sensexPercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <Menu theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
};

export default TopBar;
