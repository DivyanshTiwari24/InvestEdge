import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get("http://localhost:3002/allPositions", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      .then((res) => {
        setAllPositions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [generalContext.refreshTrigger]); // Listen for refreshes

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <tbody>
            {allPositions.map((stock, index) => (
              <tr key={index}>
                <td>{stock.product}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;