// PublicRoutes.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AccountContext } from './auth/Account';

const useCheckSession = (accountContext) => {
  const user = localStorage.getItem('user');
  if (user) {
    return true;
  } else {
    return false;
  }
};

const PublicRoutes = () => {
  const accountContext = useContext(AccountContext);
  const isLoggedIn = useCheckSession(accountContext);

  return isLoggedIn ? <Navigate to="/app" /> : <Outlet />;
};

export default PublicRoutes;
