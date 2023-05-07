//a "Settings" section with "ChangePassword" and "ChangeEmail" components for logged-in users, 
//using the AccountContext for session management.

import React, { useEffect, useContext, useState } from "react";
import { AccountContext } from "./Account";
import ChangePassword from "./ChangePassword";
import ChangeEmail from "./ChangeEmail";

export default () => {
  const { getSession } = useContext(AccountContext);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getSession().then(() => {
      setLoggedIn(true);
    });
  }, []);

  return (
    <div className="settings">
      {loggedIn && (
        <>
          <h2>Settings</h2>
          <ChangePassword />
          <ChangeEmail />
        </>
      )}
    </div>
  );
};
