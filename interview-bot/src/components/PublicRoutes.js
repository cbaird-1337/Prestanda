// PublicRoutes.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AccountContext } from './auth/Account';
import Landing from '../pages/Landing';

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

  return (
    <Outlet>
      {!isLoggedIn && <Landing />}
      <Navigate to="/app" replace={true} />
    </Outlet>
  );
};

export default PublicRoutes;
