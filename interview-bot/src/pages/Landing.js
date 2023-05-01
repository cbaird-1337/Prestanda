import React, { useEffect, useState } from "react"; //delete useState when moving into production!
import { Link } from "react-router-dom";
import "./Landing.css";
import startAnimation from "../animations/blocks-animation.js";
import Features from "./elements/Features";
import "./elements/scroll-animation.css"; 
import PricingCards from "./elements/PricingCards";
import { Button } from "@mantine/core";

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
      <div className="button-row">
        <Link to="/blog">
          <Button color="white" variant="outline" hover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
            Blog
          </Button>
        </Link>
        <Link to="/Signup">
          <Button color="white" variant="outline" hover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
            Sign Up
          </Button>
        </Link>
        <Link to="/login">
          <Button color="white" variant="outline" hover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
            Login
          </Button>
        </Link>
      </div>
      <div className="centered-container">
        <div className="login-container">
        <div className="login-header">
        <h1 className="header-title">Prestanda. Hiring Done Right.</h1>
        <p className="header-text">Automate first-round interviews, saving time and expanding your talent pipeline.</p>
        <p className="header-text">Personalized AI-generated interview questions based on each candidate's resume and target role.</p>
        <p className="header-text">Affordable, comprehensive psychometric assessments deployed earlier for data-driven evaluations.</p>
        <p className="header-text">Reduce bias and promote equal opportunities by focusing on candidate qualities that truly matter.</p>
        </div>
          <div className="button-group">
            <Link to="/Signup" className="landing-button signup-button">
              Setup a Free Account
            </Link>
          </div>
        </div>
        <div className="content-container">
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
      </div>
      <div className="features-container">
        <Features />
        <div className="pricing-container pt-2 md:pt-2 lg:pt-1">
        <PricingCards />
      </div>
    </div>
   </div>
  );  
};

export default Landing;
