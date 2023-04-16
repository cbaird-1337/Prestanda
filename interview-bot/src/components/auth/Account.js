import React, { createContext, useState } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "./UserPool";
import axios from "axios";

const AccountContext = createContext({
  authenticate: () => {},
  getSession: () => {},
  logout: () => {},
  isLoggedIn: false
});

const Account = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      const user = UserPool.getCurrentUser();
      if (user) {
        user.getSession(async (err, session) => {
          if (err) {
            reject();
          } else {
            const attributes = await new Promise((resolve, reject) => {
              user.getUserAttributes((err, attributes) => {
                if (err) {
                  reject(err);
                } else {
                  const results = {};

                  for (let attribute of attributes) {
                    const { Name, Value } = attribute;
                    results[Name] = Value;
                  }

                  resolve(results);
                }
              });
            });

            resolve({ user, ...session, ...attributes });
          }
        });
      } else {
        reject();
      }
    });
  };

  const authenticate = async (Username, Password) => {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool: UserPool });

      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: async (data) => {
          console.log("onSuccess: ", data);

          // Make a POST request to the loginAndFetchProfile Lambda function
          try {
            const response = await axios.post(
              process.env.REACT_APP_LOGIN_FETCH_PROFILE_API_ENDPOINT,
              {
                action: 'loginAndFetchProfile',
                managerAccountId: data.idToken.payload.sub,
              }
            );

            // Merge the fetched data with the authentication data
            setIsLoggedIn(true);
            resolve({ ...data, ...response.data });
          } catch (error) {
            console.error("Error fetching user data:", error.message);
            reject(error);
          }
        },
        onFailure: (err) => {
          console.error("onFailure: ", err);
          reject(err);
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired: ", data);
          resolve(data);
        },
      });
    });
  };

  const logout = (callback) => {
    const user = UserPool.getCurrentUser();
    if (user) {
      console.log("Signing out user");
      user.signOut();
    } else {
      console.log("No user to sign out");
    }
    setIsLoggedIn(false);
    if (callback) {
      console.log("Executing logout callback");
      callback();
    }
  };

  return (
    <AccountContext.Provider value={{ authenticate, getSession, logout, isLoggedIn }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export default Account;
export { AccountContext };
