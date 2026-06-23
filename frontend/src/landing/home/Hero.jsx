import React from 'react'

const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3003";

function Hero() {
   return (
      <div className='container p-5 '>
        <div className='row text-center'>
         <img src="/img/homeHero.png" alt=""  className='mb-5'/>
         <h1 className='mt-5'>Invest here</h1>
         <p>Best investing etc</p>
         <a href={dashboardUrl} style={{width:"17%", margin:"0 auto"}}>
            <button className='p-3 btn btn-primary' style={{width:"100%"}}>Signup</button>
         </a>
        </div>

      </div>
    );
}

export default Hero;