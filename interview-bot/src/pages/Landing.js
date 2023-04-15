// Landing Page - should be openly accessible to anyone and provide options to allow for login and sign up

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import "../animations/blocks-animation.css";
import startBlocksAnimation from '../animations/blocks-animation';

const Landing = () => {
  useEffect(() => {
    startBlocksAnimation();
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
    </div>
  );
};

export default Landing;
