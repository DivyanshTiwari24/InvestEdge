import React, { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://invest-edge-iota.vercel.app";

const BuyActionWindow = ({ uid, actionType, initialPrice }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice || 0.0);
  const generalContext = useContext(GeneralContext);
  
  // Custom Drag State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBuyClick = () => {
    axios.post(`${backendUrl}/newOrder`, {
      name: uid,
      qty: stockQuantity,
      price: stockPrice,
      mode: actionType || "BUY",
    }, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
    .then(() => {
      generalContext.triggerRefresh(); 
      generalContext.closeBuyWindow(); 
    })
    .catch((err) => {
      alert(err.response?.data || "Transaction failed. Check console for details.");
      console.error("Order Error:", err);
    });
  };

  const isBuy = actionType === "BUY";

  return (
    <div 
      className="container" 
      id="buy-window"
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, position: 'fixed', left: '35%', top: '20%', bottom: 'auto' }}
    >
      <div 
        className="header" 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: "move" }}
      >
        <h3>{isBuy ? "Buy" : "Sell"} {uid}</h3>
      </div>
      
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <Link className={"btn " + (isBuy ? "btn-blue" : "btn-red")} onClick={handleBuyClick} style={{backgroundColor: isBuy ? "#4184f3" : "#eb5350"}}>
            {isBuy ? "Buy" : "Sell"}
          </Link>
          <Link to="" className="btn btn-grey" onClick={() => generalContext.closeBuyWindow()}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;