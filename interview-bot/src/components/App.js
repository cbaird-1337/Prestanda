import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import axios from 'axios';
import aws from 'aws-sdk';
import awsConfig from '../aws-config';
import Typed from 'typed.js';
import Luminaire from './Luminaire';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ChangePassword from './auth/ChangePassword';
import ChangeEmail from './auth/ChangeEmail';
import Status from './auth/Status';
import Settings from './auth/Settings';
import MainApp from '../pages/MainApp';
import UserPool from './auth/UserPool';
import AccountPage from '../pages/AccountPage';
import InterviewHistoryPage from '../pages/InterviewHistoryPage';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import Account, { AccountContext } from './auth/Account';
import { Link } from "react-router-dom";

function useCheckSession(accountContext) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { getSession } = accountContext;
      try {
        await getSession();
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, [accountContext]);

  return [isLoggedIn, setIsLoggedIn];
}

function App() {
  const accountContext = useContext(AccountContext);
  const [isLoggedIn, setIsLoggedIn] = useCheckSession(accountContext);
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="app/*"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              showMessage={showMessage}
            >
              <MainApp />
            </ProtectedRoute>
          }
        >
          <Route path="account" element={<AccountPage />} />
          <Route path="interview-history" element={<InterviewHistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;






