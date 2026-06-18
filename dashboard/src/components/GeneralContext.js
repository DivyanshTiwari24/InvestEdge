import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  openSellWindow: (uid) => {},
  closeBuyWindow: () => {},
  refreshTrigger: 0,
  triggerRefresh: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [actionType, setActionType] = useState("BUY");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Tracks changes

  const handleOpenBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setActionType("BUY");
  };

  const handleOpenSellWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setActionType("SELL");
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Fires a re-fetch
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
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} actionType={actionType} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;