//defines a React context named "AccountContext" and a wrapper component "Account" that provides functions 
//for user authentication, session management, and logout functionality using Amazon Cognito. 
//The authenticate function is modified to make a POST request to a Lambda function to fetch user data and 
//merge it with authentication data. The logout function is updated to accept and execute an optional callback function.


import React, { createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "./UserPool";
import axios from "axios";

const AccountContext = createContext();

const Account = (props) => {
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
              "https://nracotkvs0.execute-api.us-east-1.amazonaws.com/prod/loginAndFetchProfile",
              {
                managerAccountId: data.idToken.payload.sub,
              }
            );

            // Merge the fetched data with the authentication data
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

  // Add a new parameter to the logout function
  const logout = (callback) => {
    const user = UserPool.getCurrentUser();
    if (user) {
      console.log("Signing out user");
      user.signOut();
    } else {
      console.log("No user to sign out");
    }
    if (callback) {
      console.log("Executing logout callback");
      callback();
    }
  };

// Pass the callback through the AccountContext.Provider
return (
  <AccountContext.Provider value={{ authenticate, getSession, logout }}>
    {props.children}
  </AccountContext.Provider>
);

};

export default Account;
export { AccountContext };
