import React from 'react'

function Hero() {
   return (
      <div className='container p-5 '>
        <div className='row text-center'>
         <img src="/img/homeHero.png" alt=""  className='mb-5'/>
         <h1 className='mt-5'>Invest here</h1>
         <p>Best investing etc</p>
         <button className='p-3 btn btn-primary' style={{width:"17%", margin:"0 auto"}}>Signup</button>
        </div>

      </div>
    );
}

export default Hero;