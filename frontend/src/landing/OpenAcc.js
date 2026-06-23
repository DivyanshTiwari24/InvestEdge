import React from 'react'

const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL || "https://invest-edge-1f4c.vercel.app/signup";

function OpenAcc() {
    return ( 
        <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5">Open a Zerodha account</h1>
        <p>
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
          F&O trades.
        </p>
        <a href={dashboardUrl}>
            <button
              className="p-2 btn btn-primary fs-5 mb-5"
              style={{ width: "20%", margin: "0 auto" }}
            >
              Sign up Now
            </button>
          </a>
      </div>
    </div>
  );
}
export default OpenAcc;