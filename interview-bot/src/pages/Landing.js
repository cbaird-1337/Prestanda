// Landing Page - should be openly accessible to anyone and provide options to allow for login and sign up

import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="App">
      <div className="bg-shapes"></div>
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