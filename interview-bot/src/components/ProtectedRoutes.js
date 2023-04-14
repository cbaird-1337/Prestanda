import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AccountContext } from './auth/Account';

const ProtectedRoutes = ({ Component }) => {
  console.log(AccountContext);
  const { getSession } = useContext(AccountContext);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    getSession().then(() => setIsLoggedIn(true)).catch(() => setIsLoggedIn(false));
  }, [getSession]);

  // Render the passed Component inside the Outlet
  return isLoggedIn ? (
    <Outlet>
      <Component />
    </Outlet>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoutes;
