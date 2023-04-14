// ProtectedRoutes.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ Component, context }) => {
  const { getSession } = React.useContext(context);

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
