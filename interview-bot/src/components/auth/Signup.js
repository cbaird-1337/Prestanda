//allows users to sign up with their name, email, company, department, and password, using Amazon Cognito 
//for authentication, and stores the user information in DynamoDB using an AWS API Gateway. 
//It also includes email verification and navigates to the main app upon successful registration and authentication
//test
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

  const createAccountProfile = async (name, email, hiringManagerCompany, hiringManagerDept, cognitoUserId) => {
    try {
      const response = await axios.post(process.env.REACT_APP_COGNITO_SIGNUP_TO_DYNAMO_API_ENDPOINT, {
        name: name,
        email: email,
        hiringManagerCompany: hiringManagerCompany,
        hiringManagerDept: hiringManagerDept,
        managerAccountId: cognitoUserId // Use the Cognito User ID as the managerAccountId
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
            const cognitoUserId = data.userSub; // Get the Cognito User ID from the signUp response
            const managerAccountId = await createAccountProfile(name, email, company, department, cognitoUserId);
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
    <div className="App">
      {/* Add the box-animation-container from the Landing.js */}
      <div className="box-animation-container hero-figure">
        <div className="hero-figure-box hero-figure-box-01"></div>
        <div className="hero-figure-box hero-figure-box-02"></div>
        <div className="hero-figure-box hero-figure-box-03"></div>
        <div className="hero-figure-box hero-figure-box-04"></div>
        <div className="hero-figure-box hero-figure-box-05"></div>
        <div className="hero-figure-box hero-figure-box-06"></div>
        <div className="hero-figure-box hero-figure-box-07"></div>
        <div className="hero-figure-box hero-figure-box-08"></div>
        <div className="hero-figure-box hero-figure-box-09"></div>
        <div className="hero-figure-box hero-figure-box-10"></div>
      </div>
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
  </div> 
  );
};

export default Signup;
