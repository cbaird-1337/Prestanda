import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AccountContext } from './auth/Account';

const ProtectedRoutes = () => {
  console.log (AccountContext);
  const { getSession } = useContext(AccountContext);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    getSession().then(() => setIsLoggedIn(true)).catch(() => setIsLoggedIn(false));
  }, [getSession]);

    // Redirect unauthenticated users to the landing page
    return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
