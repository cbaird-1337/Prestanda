import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import startAnimation from "../animations/blocks-animation.js";

const Landing = () => {
  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <div className="App">
      <div className="bg-shapes"></div>
      <div id="animation-container" className="animation-container"></div>
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome to Prestanda's Automated Interview Screening Service</h1>
          <p>Please create an account or login to proceed.</p>
        </div>
        <div className="button-group">
          <Link to="/Signup" className="landing-button signup-button">
            Create an Account
          </Link>
          <Link to="/login" className="landing-button login-button">
            Login
          </Link>
        </div>
      </div>
      {/* Add 'hero-figure' class to the container */}
      <div className="box-animation-container hero-figure">
        <div className="hero-figure-box hero-figure-box-01" style={{ transform: 'rotate(45deg)' }}></div>
        <div className="hero-figure-box hero-figure-box-02" style={{ transform: 'rotate(-45deg)' }}></div>
        <div className="hero-figure-box hero-figure-box-03" style={{ transform: 'rotate(0deg)' }}></div>
        <div className="hero-figure-box hero-figure-box-04" style={{ transform: 'rotate(-135deg)' }}></div>
        <div className="hero-figure-box hero-figure-box-05"></div>
        <div className="hero-figure-box hero-figure-box-06"></div>
        <div className="hero-figure-box hero-figure-box-07"></div>
        <div className="hero-figure-box hero-figure-box-08" style={{ transform: 'rotate(-22deg)' }}></div>
        <div className="hero-figure-box hero-figure-box-09" style={{ transform: 'rotate(-52deg)' }}></div>
        <div className="hero-figure-box hero-figure-box-10" style={{ transform: 'rotate(-50deg)' }}></div>
      </div>
    </div>
  );
};

export default Landing;
