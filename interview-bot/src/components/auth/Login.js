//Allows users to log in with their email and password, using the AccountContext for authentication, 
//and navigates to the main app upon successful login.

import React, { useState, useContext } from "react";
import { AccountContext } from "./Account";
import { useNavigate } from "react-router-dom";
import UserPool from "./UserPool";
import axios from "axios";

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
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="email" className="login-text-color">Email</label>
        <input
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
  );  
};

export default Login;
