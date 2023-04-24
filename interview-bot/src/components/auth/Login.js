//Allows users to log in with their email and password, using the AccountContext for authentication, 
//and navigates to the main app upon successful login.

import React, { useState, useContext } from "react";
import { AccountContext } from "./Account";
import { useNavigate } from "react-router-dom";
import UserPool from "./UserPool";
import axios from "axios";
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { authenticate } = useContext(AccountContext);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await authenticate(email, password);

      const cognitoUser = UserPool.getCurrentUser();
      if (!cognitoUser) {
        throw new Error("User not found");
      }

      const managerAccountId = cognitoUser.getUsername();

      const response = await axios.post(
        process.env.REACT_APP_LOGIN_FETCH_PROFILE_API_ENDPOINT,
        { managerAccountId }
      );

      if (response.status === 200) {
        console.log("Logged in!");
        console.log("User profile and interview history:", response.data);
        navigate("/app");
      } else {
        setErrorMessage("Failed to fetch user profile and interview history");
      }
    } catch (err) {
      console.error("Failed to login", err);
      setErrorMessage("Incorrect username or password");
    }
  };

  return (
    <div className="App">
      {/* Add the box-animation-container from the Landing.js */}
      <div className="box-animation-container hero-figure">
        <div className="hero-figure-box hero-figure-box-01"></div>
        <div className="hero-figure-box hero-figure-box-02"></div>
        <div className="hero-figure-box hero-figure-box-03"></div>
        <div className="hero-figure-box hero-figure-box-04"></div>
        <div className="hero-figure-box hero-figure-box-05"></div>
        <div className="hero-figure-box hero-figure-box-06"></div>
        <div className="hero-figure-box hero-figure-box-07"></div>
        <div className="hero-figure-box hero-figure-box-08"></div>
        <div className="hero-figure-box hero-figure-box-09"></div>
        <div className="hero-figure-box hero-figure-box-10"></div>
      </div>
      <div>
        <form onSubmit={onSubmit}>
          <label htmlFor="email" className="login-text-color">Email</label>
          <input
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value.toLowerCase())}
          ></input>
          <label htmlFor="password" className="login-text-color">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          ></input>
    
          {errorMessage && <p className="login-text-color">{errorMessage}</p>}
    
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
  
};

export default Login;
