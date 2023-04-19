// App.js
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
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [message, setMessage] = useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <Account>
      {message && <div className="notification">{message}</div>}
      <Routes>
        {/** Protected Routes */}
        <Route path="app" element={<ProtectedRoutes Component={MainApp} />} />
        <Route path="accountpage" element={<ProtectedRoutes Component={AccountPage} />} />
        <Route path="interviewhistorypage" element={<ProtectedRoutes Component={InterviewHistoryPage} />} />
  
        {/** Public Routes */}
        <Route path="/" element={<PublicRoutes />} />
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </Account>
  );
}

export default App;
