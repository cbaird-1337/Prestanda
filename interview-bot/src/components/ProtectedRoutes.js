// ProtectedRoutes.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountContext } from './auth/Account';

const ProtectedRoutes = ({ Component }) => {
  console.log("AccountContext:", AccountContext); // Add this line
  const { getSession } = useContext(AccountContext);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    getSession()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, [getSession]);

  console.log("isLoggedIn:", isLoggedIn); // Add this line

  // Render the passed Component directly
  return isLoggedIn ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoutes;