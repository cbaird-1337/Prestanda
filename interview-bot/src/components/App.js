// App.js
import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Landing from '../pages/Landing';
import Login from './auth/Login';
import Signup from './auth/Signup';
import MainApp from '../pages/MainApp';
import AccountPage from '../pages/AccountPage';
import InterviewHistoryPage from '../pages/InterviewHistoryPage';
import ProtectedRoutes from './ProtectedRoutes'; // Import the ProtectedRoute component
import PublicRoutes from './PublicRoutes'; // Import the PublicRoutes component
import { AccountContext } from './auth/Account';
import { Routes, Route, Navigate } from 'react-router-dom';

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

  return [isLoggedIn, setIsLoggedIn]; // Return both isLoggedIn and setIsLoggedIn
}

function App({ accountContext }) {
  const accountContext = useContext(AccountContext);
  const [isLoggedIn, setIsLoggedIn] = useCheckSession(accountContext); // Destructure isLoggedIn and setIsLoggedIn
  const [message, setMessage] = useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <>
      {message && <div className="notification">{message}</div>}
      <Routes>
        {/** Protected Routes */}
        <Route path="app" element={<ProtectedRoutes Component={MainApp} />} />
        <Route path="accountpage" element={<ProtectedRoutes Component={AccountPage} />} />
        <Route path="interviewhistorypage" element={<ProtectedRoutes Component={InterviewHistoryPage} />} />
  
        {/** Public Routes */}
        <Route path="/" element={<PublicRoutes isLoggedIn={isLoggedIn} />} />
        <Route index element={<Landing />} />
        <Route path="login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
