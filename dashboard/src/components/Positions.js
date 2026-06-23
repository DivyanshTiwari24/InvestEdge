import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const backendUrl = "https://invest-edge-iota.vercel.app";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get(`${backendUrl}/allPositions`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      .then((res) => {
        setAllPositions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [generalContext.refreshTrigger]); // Listen for refreshes

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const totalInvestment = allPositions.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
  const currentValue = allPositions.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
  const totalPL = currentValue - totalInvestment;
  const plPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;
  const isProfit = totalPL >= 0;

  const investmentParts = formatCurrency(totalInvestment).split('.');
  const currentParts = formatCurrency(currentValue).split('.');

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const stockPL = curValue - stock.avg * stock.qty;
              const isProfitStock = stockPL >= 0.0;
              const profClass = isProfitStock ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td className="align-left">{stock.product}</td>
                  <td className="align-left">{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>{stockPL.toFixed(2)}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {investmentParts[0]}.<span>{investmentParts[1]}</span>{" "}
          </h5>
          <p>Total Investment</p>
        </div>
        <div className="col">
          <h5>
            {currentParts[0]}.<span>{currentParts[1]}</span>{" "}
          </h5>
          <p>Current Value</p>
        </div>
        <div className="col">
          <h5 className={isProfit ? "profit" : "loss"}>
            {formatCurrency(totalPL)} ({isProfit ? "+" : ""}{plPercent.toFixed(2)}%)
          </h5>
          <p>Total P&L</p>
        </div>
      </div>
    </>
  );
};

export default Positions;