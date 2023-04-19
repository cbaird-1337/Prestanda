import React, { useState } from 'react';
import './App.css';
import Landing from '../pages/Landing';
import Login from './auth/Login';
import Signup from './auth/Signup';
import MainApp from '../pages/MainApp';
import AccountPage from '../pages/AccountPage';
import InterviewHistoryPage from '../pages/InterviewHistoryPage';
import ProtectedRoutes from './ProtectedRoutes'; // Import the ProtectedRoute component
import PublicRoutes from './PublicRoutes'; // Import the PublicRoutes component
import Account, { AccountContext } from './auth/Account';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const isProtectedRoute = (path) => {
    return path === '/app' || path === '/accountpage' || path === '/interviewhistorypage';
  };

  return (
    <Account>
      {message && <div className="notification">{message}</div>}
      <Routes>
        {/** Protected Routes */}
        <Route path="app/*" element={<ProtectedRoutes Component={MainApp} />} />
        <Route path="accountpage/*" element={<ProtectedRoutes Component={AccountPage} />} />
        <Route path="interviewhistorypage/*" element={<ProtectedRoutes Component={InterviewHistoryPage} />} />
  
        {/** Public Routes */}
        <Route path="/" element={<PublicRoutes isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<Landing />} />
      </Routes>

      {/* Check if the user is logged in and trying to access a public route */}
      {isLoggedIn && !isProtectedRoute(location.pathname) && <Navigate to="/app" />}
      
      {/* Check if the user is logged out and trying to access a protected route */}
      {!isLoggedIn && isProtectedRoute(location.pathname) && <Navigate to="/" />}
    </Account>
  );
}

export default App;
