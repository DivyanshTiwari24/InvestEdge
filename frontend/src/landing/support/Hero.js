import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-5 " id="supportWrapper">
        <h4>Support Portal</h4>
        <a href="" className="text-decoration-none">Track Tickets</a>
      </div>

      <div className="row p-5 ">
        <div className="col-8 p-3">
          <h1 className="fs-3">
            Search for an answer or browse help topics to create a ticket
          </h1>
          <input placeholder="Eg. how do I activate F&O" style={{width:"48rem"}} />
          <br />
          <a href="" className="me-4 text-decoration-none" >Track account opening</a>
          <a href=""className="me-4  text-decoration-none">Track segment activation</a>
          <a href=""className="me-4  text-decoration-none">Intraday margins</a>
          <a href=""className="ms-2  text-decoration-none">Kite user manual</a>
        </div>
        <div className="col-4 p-3">
          <h1 className="fs-3">Featured</h1>
          <ol>
            <li className="mb-2 ">
              <a href="" className="text-decoration-none" >Current Takeovers and Delisting - January 2024</a>
            </li>
            <li>
              <a href="" className="text-decoration-none">Latest Intraday leverages - MIS & CO</a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;    