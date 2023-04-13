//allows users to sign up with their name, email, company, department, and password, using Amazon Cognito 
//for authentication, and stores the user information in DynamoDB using an AWS API Gateway. 
//It also includes email verification and navigates to the main app upon successful registration and authentication

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "./UserPool";
import VerificationModal from "./VerificationModal";
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  const authenticateUser = (email, password) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("User is signed in:", result);
        console.log("Navigating to MainApp");
        navigate("/app");
      },
      onFailure: (err) => {
        console.error("Failed to sign in:", err);
      },
    });
  };

  const createAccountProfile = async (name, email, hiringManagerCompany, hiringManagerDept, cognitoAccountId) => {
    try {
      const response = await axios.post(process.env.REACT_APP_COGNITO_SIGNUP_TO_DYNAMO_API_ENDPOINT, {
        name: name,
        email: email,
        hiringManagerCompany: hiringManagerCompany,
        hiringManagerDept: hiringManagerDept,
        managerAccountId: cognitoAccountId // Use the Cognito account ID as the managerAccountId
      });
  
      return response.data.managerAccountId;
    } catch (error) {
      console.error('Error creating account profile:', error.message);
      throw error;
    }
  };  

  const onSubmit = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      console.error("Passwords do not match.");
      return;
    }
  
    UserPool.signUp(
      email,
      password,
      [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
        { Name: "custom:HiringManagerCompany", Value: company },
        { Name: "custom:HiringManagerDept", Value: department },
        { Name: "custom:timestamp", Value: new Date().toString() },
      ],
      null,
      async (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log("User signed up:", data);
          try {
            const cognitoUser = await UserPool.getCurrentUser();
            const cognitoAccountId = cognitoUser.getUsername();
            const managerAccountId = await createAccountProfile(name, email, company, department, cognitoAccountId);
            console.log('Account profile created with ID:', managerAccountId);
          } catch (error) {
            console.error('Error creating account profile:', error.message);
          }
          setShowVerificationModal(true);
        }
      }
    );
  };  

  const verifyEmail = (code) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    console.log("Confirming registration with code:", code);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.error("Error during email verification:", err);
        return;
      }
      console.log("Email verified:", result);
      setShowVerificationModal(false);
      authenticateUser(email, password);
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
        ></input>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        <label htmlFor="company">Company</label>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />

        <label htmlFor="department">Department</label>
        <input
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
        />
                <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        ></input>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        ></input>
        <button type="submit">Signup</button>
        <VerificationModal
          isOpen={showVerificationModal}
          onSubmit={verifyEmail}
          onClose={() => setShowVerificationModal(false)}
        />
      </form>
    </div>
  );
};

export default Signup;
