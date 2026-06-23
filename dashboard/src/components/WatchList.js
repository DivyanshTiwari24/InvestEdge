import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import { watchlist } from "../data/data"; // dummy data array of obj
import { DoughnutChart } from "./DoughnoutChart";
import SearchIcon from "@mui/icons-material/Search";

const labels = watchlist.map((subArray) => subArray["name"]);

const WatchList = () => {
  // Add state for the search bar
  const [searchQuery, setSearchQuery] = useState("");

  // Filter the watchlist based on the input
  const filteredWatchlist = watchlist.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <SearchIcon className="ms-3"/>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Discover your next investment"
          className="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="counts"> {filteredWatchlist.length} / 50</span>
      </div>

      <ul className="list">
        {/* Map over the filtered list instead of the original one */}
        {filteredWatchlist.map((stock, index) => {
          return <WatchListItem stock={stock} key={index} />;
        })}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};
export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };
  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> 
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent ">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down " />
          ) : (
            <KeyboardArrowUp className="up " />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {/* FIX: Pass the price down to the actions! */}
      {showWatchlistActions && <WatchListActions uid={stock.name} price={stock.price} />}
    </li>
  );
};

// FIX: Accept the price as a prop
const WatchListActions = ({ uid, price }) => {
  const generalContext = useContext(GeneralContext);

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy "
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          {/* FIX: Send the price to the Context! */}
          <button className="buy" onClick={() => generalContext.openBuyWindow(uid, price)}>Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          {/* FIX: Send the price to the Context! */}
          <button className="sell" onClick={() => generalContext.openSellWindow(uid, price)}>Sell</button>
        </Tooltip>
        <Tooltip
          title="Analytics"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};