import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {}, // Added price
  openSellWindow: (uid, price) => {}, // Added price
  closeBuyWindow: () => {},
  refreshTrigger: 0,
  triggerRefresh: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0); // New state for price
  const [actionType, setActionType] = useState("BUY");
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // Now accepts price
  const handleOpenBuyWindow = (uid, price) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price); 
    setActionType("BUY");
  };

  // Now accepts price
  const handleOpenSellWindow = (uid, price) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
    setActionType("SELL");
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); 
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeBuyWindow: handleCloseBuyWindow,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow 
          uid={selectedStockUID} 
          actionType={actionType} 
          initialPrice={selectedStockPrice} /* Pass price to the window */
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;