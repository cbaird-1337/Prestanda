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
import Account, { AccountContext } from './auth/Account';
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

  return [isLoggedIn, setIsLoggedIn];
}

function App() {
  const accountContext = useContext(AccountContext);
  const [isLoggedIn, setIsLoggedIn] = useState(useCheckSession(accountContext));
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
        {/** Wrap all Route under ProtectedRoutes element */}
        <Route path="/" element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
          <Route path="/" element={<InnerContent />}>
            <Route path="/app" element={<Navigate replace to="MainApp" />} />
            <Route path="app" element={<MainApp />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="interview-history" element={<InterviewHistoryPage />} />
          </Route>
        </Route>

        {/** Public Routes */}
        {/** Wrap all Route under PublicRoutes element */}
        <Route path="landing" element={<PublicRoutes isLoggedIn={isLoggedIn} />}>
          <Route path="/" element={<Landing/>}/>
        </Route>
        <Route path="login" element={<PublicRoutes isLoggedIn={isLoggedIn} />}>
          <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        </Route>
        <Route path="/" element={<Signup />} />
        <Route path="signup" element={<PublicRoutes isLoggedIn={isLoggedIn} />}>
          <Route path="/" element={<Signup />} />
        </Route>
      </Routes>
    </Account>
  );
}

export default App;