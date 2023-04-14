//Displays user profile information including name, email, company, and department. 
//It also displays the user's interview history, including the interview ID, date, and duration. 
//The user's data is fetched from an API endpoint using Axios, and the component uses hooks such as useState and useEffect 
//to manage state and handle the component lifecycle.


import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./auth/Account";
import axios from "axios";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const session = await getSession();
        const response = await axios.post(process.env.REACT_APP_LOGIN_FETCH_PROFILE_API_ENDPOINT, {
          managerAccountId: session.idToken.payload.sub,
        });
        setUserProfile(response.data.userProfile);
        setInterviewHistory(response.data.interviewHistory);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [getSession, userProfile, interviewHistory]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {userProfile && (
        <div>
          <p>Name: {userProfile.Name}</p>
          <p>Email: {userProfile.Email}</p>
          <p>Company: {userProfile.HiringManagerCompany}</p>
          <p>Department: {userProfile.HiringManagerDept}</p>
        </div>
      )}
      <h2>Interview History</h2>
      {interviewHistory.length === 0 && <p>No interviews found</p>}
      {interviewHistory.map((interview, index) => (
        <div key={index}>
          <p>Interview ID: {interview.interviewId}</p>
          <p>Date: {interview.date}</p>
          <p>Duration: {interview.duration}</p>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
