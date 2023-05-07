import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountContext } from './auth/Account';
import Landing from '../pages/Landing';

const PublicRoutes = () => {
  const { isLoggedIn } = useContext(AccountContext);

  return isLoggedIn ? <Navigate to="/app" /> : <Landing />;
};

export default PublicRoutes;
