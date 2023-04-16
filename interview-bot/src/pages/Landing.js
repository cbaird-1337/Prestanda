import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import startAnimation from "../animations/blocks-animation.js";

const Landing = () => {
  useEffect(() => {
    document.body.classList.add("has-animations");
    startAnimation();

    return () => {
      document.body.classList.remove("has-animations");
    };
  }, []);

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
      {/* Add 'hero-figure' class to the container */}
      <div className="box-animation-container hero-figure anime-element">
        <div className="hero-figure-box hero-figure-box-01" data-rotation="45deg"></div>
        <div className="hero-figure-box hero-figure-box-02" data-rotation="-45deg"></div>
        <div className="hero-figure-box hero-figure-box-03" data-rotation="0deg"></div>
        <div className="hero-figure-box hero-figure-box-04" data-rotation="-135deg"></div>
        <div className="hero-figure-box hero-figure-box-05"></div>
        <div className="hero-figure-box hero-figure-box-06"></div>
        <div className="hero-figure-box hero-figure-box-07"></div>
        <div className="hero-figure-box hero-figure-box-08" data-rotation="-22deg"></div>
        <div className="hero-figure-box hero-figure-box-09" data-rotation="-52deg"></div>
        <div className="hero-figure-box hero-figure-box-10" data-rotation="-50deg"></div>
      </div>
    </div>
  );
};

export default Landing;
