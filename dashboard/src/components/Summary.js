import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "https://invest-edge-iota.vercel.app" ;

const Summary = () => {
  const [profile, setProfile] = useState({ email: "", margin: 100000 });
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: "Bearer " + localStorage.getItem("token") };
    
    Promise.all([
      axios.get(`${backendUrl}/profile`, { headers }),
      axios.get(`${backendUrl}/allHoldings`, { headers })
    ])
    .then(([profileRes, holdingsRes]) => {
      setProfile(profileRes.data);
      setHoldings(holdingsRes.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error loading summary details:", err);
      setLoading(false);
    });
  }, []);

  // Formatting helpers
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(val);
  const formatCompact = (val) => {
    if (val >= 10000000) return (val / 10000000).toFixed(2) + "Cr";
    if (val >= 100000) return (val / 100000).toFixed(2) + "L";
    if (val >= 1000) return (val / 1000).toFixed(2) + "k";
    return val.toFixed(2);
  };

  const totalInvestment = holdings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
  const currentValue = holdings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
  const totalPL = currentValue - totalInvestment;
  const plPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;
  const isProfit = totalPL >= 0;

  const marginAvailable = profile.margin;
  const marginUsed = 100000 - marginAvailable; // Assume 1,00,000 standard initial balance

  if (loading) {
    return <div style={{ padding: "20px", color: "var(--text-secondary)" }}>Loading portfolio summary...</div>;
  }

  return (
    <>
      <div className="username">
        <h6>Hi, {profile.email ? profile.email.split("@")[0] : "Trader"}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatCompact(marginAvailable)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{formatCurrency(marginUsed < 0 ? 0 : marginUsed)}</span>{" "}
            </p>
            <p>
              Opening balance <span>₹{formatCurrency(100000)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={isProfit ? "profit" : "loss"}>
              {formatCompact(totalPL)}{" "}
              <small style={{ color: isProfit ? "#48c237" : "#fa764e", fontSize: "0.8rem", marginLeft: "5px" }}>
                {isProfit ? "+" : ""}{plPercent.toFixed(2)}%
              </small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{formatCurrency(currentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>₹{formatCurrency(totalInvestment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
