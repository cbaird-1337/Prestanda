//Allows users to log in with their email and password, using the AccountContext for authentication, 
//and navigates to the main app upon successful login.

import React, { useState, useContext } from "react";
import { AccountContext } from "./Account";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { authenticate } = useContext(AccountContext);

  const onSubmit = (event) => {
    event.preventDefault();

    authenticate(email, password)
      .then((data) => {
        console.log("Logged in!", data);
        navigate("/app");
      })
      .catch((err) => {
        console.error("Failed to login", err);
        setErrorMessage("Incorrect username or password");
      });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="email" className="login-text-color">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        <label htmlFor="password" className="login-text-color">Password</label>
        <input
          type="password" // Set input type to password
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
