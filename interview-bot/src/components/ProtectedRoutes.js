// ProtectedRoutes.js
import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountContext } from './auth/Account';

const ProtectedRoutes = ({ Component }) => {
  const { getSession, isLoggedIn } = useContext(AccountContext);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    getSession()
      .then(() => {
        console.log('Session exists');
        setLoading(false);
      })
      .catch(() => {
        console.log('No session');
        setLoading(false);
      });
  }, [getSession]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return isLoggedIn ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
