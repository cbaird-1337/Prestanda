import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountContext } from './auth/Account';

const ProtectedRoutes = ({ Component }) => {
  const { getSession, isLoggedIn } = useContext(AccountContext); // Add isLoggedIn here

  console.log("isLoggedIn:", isLoggedIn); // Add this line

  // Render the passed Component directly
  return isLoggedIn ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
