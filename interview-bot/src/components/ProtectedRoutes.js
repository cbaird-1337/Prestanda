import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AccountContext } from './auth/Account';

const ProtectedRoutes = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

const Protected = (props) => {
  const { getSession } = useContext(AccountContext);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    getSession().then(() => setIsLoggedIn(true)).catch(() => setIsLoggedIn(false));
  }, [getSession]);

  return <ProtectedRoutes {...props} isLoggedIn={isLoggedIn} />;
};

export default Protected;
