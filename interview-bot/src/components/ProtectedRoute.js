import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children, showMessage }) {
  if (!isLoggedIn) {
    showMessage("You must be logged in to do that.");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
