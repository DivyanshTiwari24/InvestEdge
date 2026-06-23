import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const backendUrl = "https://invest-edge-iota.vercel.app";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    axios.get(`${backendUrl}/allHoldings`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch((err) => console.error(err));
  }, [generalContext.refreshTrigger]); // Listen for refreshes

  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const totalInvestment = allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
  const currentValue = allHoldings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
  const totalPL = currentValue - totalInvestment;
  const plPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;
  const isProfit = totalPL >= 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  const investmentParts = formatCurrency(totalInvestment).split('.');
  const currentParts = formatCurrency(currentValue).split('.');

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfitStock = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfitStock ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={profClass}>{stock.net}</td>
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
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {currentParts[0]}.<span>{currentParts[1]}</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={isProfit ? "profit" : "loss"}>
            {formatCurrency(totalPL)} ({isProfit ? "+" : ""}{plPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;