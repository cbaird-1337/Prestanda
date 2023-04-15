// ProtectedRoutes.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountContext } from './auth/Account';
import { unstable_useSyncExternalStore } from 'react'; // Add this line

const ProtectedRoutes = ({ Component }) => {
  console.log("AccountContext:", AccountContext);
  
  const contextValue = unstable_useSyncExternalStore(AccountContext); // Add this line
  const { getSession } = useContext(contextValue); // Update this line

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    getSession()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, [getSession]);

  console.log("isLoggedIn:", isLoggedIn);

  return isLoggedIn ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
