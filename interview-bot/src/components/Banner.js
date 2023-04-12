import React from "react";
import { Link } from "react-router-dom";
import "./Banner.css";
import { AccountContext } from "./auth/Account";

function Banner() {
  const { logout } = React.useContext(AccountContext);

  const handleLogoutClick = (event) => {
    event.preventDefault();
    console.log("Logout button clicked");
    logout(() => {
      console.log("Logout callback executed");
      // Add any necessary actions upon logout here
    });
  };

  return (
    <div className="banner">
      <div>
        <Link to="/account" className="banner-link">
          Account
        </Link>
        <Link to="/interview-history" className="banner-link">
          Interview History
        </Link>
        <a href="/" className="banner-link" onClick={handleLogoutClick}>
          Logout
        </a>
      </div>
    </div>
  );
}

export default Banner;
