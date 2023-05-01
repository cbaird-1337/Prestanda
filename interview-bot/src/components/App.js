// App.js
import React, { useState } from 'react';
import './App.css';
import Landing from '../pages/Landing';
import Login from './auth/Login';
import Signup from './auth/Signup';
import MainApp from '../pages/MainApp';
import AccountPage from '../pages/AccountPage';
import InterviewHistoryPage from '../pages/InterviewHistoryPage';
import FeatureRequestsPage from '../pages/FeatureRequestsPage';
import BillingPage from '../pages/BillingPage'; 
import SupportPage from '../pages/SupportPage'; 
import ProtectedRoutes from './ProtectedRoutes'; 
import PublicRoutes from './PublicRoutes';
import Account, { AccountContext } from './auth/Account';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssessmentPage from '../pages/AssessmentPage';
import Blog from '../pages/Blog';


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
        <Route path="featurerequestspage" element={<ProtectedRoutes Component={FeatureRequestsPage} />} />
        <Route path="billingpage" element={<ProtectedRoutes Component={BillingPage} />} />
        <Route path="supportpage" element={<ProtectedRoutes Component={SupportPage} />} />
  
        {/** Public Routes */}
        <Route path="/" element={<PublicRoutes />} />
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/assessment/:assessmentId" element={<AssessmentPage />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Account>
  );
}

export default App;
