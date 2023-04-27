import React, { useEffect, useState } from "react"; //delete useState when moving into production!
import { Link } from "react-router-dom";
import "./Landing.css";
import startAnimation from "../animations/blocks-animation.js";
import Features from "./elements/Features";
import "./elements/scroll-animation.css"; 
import PricingCards from "./elements/PricingCards";
import { Modal } from '@mantine/core';  //delete when moving into production!

const Landing = () => {
  const [modalOpened, setModalOpened] = useState(true); //delete when moving into production!

  const handleModalClose = () => {  //delete when moving into production!
    setModalOpened(false);  //delete when moving into production!
  };   //delete when moving into production!

  useEffect(() => {
    document.body.classList.add("has-animations");
    startAnimation();

    return () => {
      document.body.classList.remove("has-animations");
    };
  }, []);

  return (
    <div className="App">
      <Modal  //delete this whole modal statement (lines 28-40) when moving into production!
      opened={modalOpened}  
      onClose={handleModalClose}  
      transition="rotate-left"  
      classNames={{ content: 'warning-modal-content' }}  
    >  
      <div className="p-4"> 
        <span role="img" aria-label="Warning">
          ⚠️
        </span>{' '}
        Warning: this website is currently in active development. As such, please expect functionality to be limited or impaired.
      </div>
    </Modal> 
      <div className="bg-shapes"></div>
      <div className="centered-container">
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
