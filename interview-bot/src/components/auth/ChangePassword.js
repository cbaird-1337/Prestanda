//component that allows logged-in users to change their password by entering their current password and a new password, 
//using the AccountContext for session management and handling the password change functionality.


import React, { useState, useContext } from "react";
import { AccountContext } from "./Account";

export default () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { getSession } = useContext(AccountContext);

  const onSubmit = (event) => {
    event.preventDefault();

    getSession().then(({ user }) => {
      user.changePassword(password, newPassword, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(result);
        }
      });
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Current password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <label>New password</label>
        <input
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />

        <button type="submit">Change password</button>
      </form>
    </div>
  );
};
