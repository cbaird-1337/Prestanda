// ProtectedRoutes.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AccountContext } from './auth/Account';
import { unstable_useSyncExternalStore } from 'use-sync-external-store'; // Update this line

const ProtectedRoutes = ({ Component }) => {
  console.log("AccountContext:", AccountContext);
  
  const contextValue = unstable_useSyncExternalStore(() => useContext(AccountContext)); // Update this line
  const { getSession } = contextValue; // Update this line

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    getSession()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, [getSession]);

  console.log("isLoggedIn:", isLoggedIn);

  return isLoggedIn ? <Component /> : <Navigate to="/" />;
};

<<<<<<< HEAD
export default ProtectedRoutes;
=======
export default ProtectedRoutes;

>>>>>>> 1b3c5e876a98affd14bb9d3dbfe43dd986bf9108
