// ProtectedRoutes.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountContext } from './auth/Account';

const ProtectedRoutes = ({ Component }) => {
  const { getSession, isLoggedIn } = useContext(AccountContext); // Add isLoggedIn

  React.useEffect(() => {
    getSession()
      .then(() => console.log('Session exists'))
      .catch(() => console.log('No session'));
  }, [getSession]);

  // Render the passed Component directly
  return isLoggedIn ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
