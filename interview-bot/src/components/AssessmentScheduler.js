import React from 'react';
import { v4 as uuidv4 } from "uuid";
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: process.env.REACT_APP_USER_POOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID,
});

const getManagerAccountId = () => {
  const currentUser = userPool.getCurrentUser();

  if (currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession((err, session) => {
        if (err) {
          console.error('Error getting user session:', err);
          reject(err);
        } else {
          const managerAccountId = session.getIdToken().payload.sub;
          resolve(managerAccountId);
        }
      });
    });
  } else {
    console.error('No user currently logged in');
    return null;
  }
};

const handleSubmit = async () => {
  // Add form validation if needed

  try {
    const managerAccountId = await getManagerAccountId();
    if (!managerAccountId) {
      console.error('Failed to get manager account ID');
      return;
    }

    const assessmentId = uuidv4(); // Generate a UUID for the assessment ID

    const requestData = {
      managerAccountId,
      assessmentId,
      candidateName,
      candidateEmail,
      companyName,
      jobTitle,
      candidatePhoneNumber,
      assessmentStatus: "pending",
    };

    await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/schedule-assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });      
  } catch (error) {
    console.error("Error while creating the assessment:", error);
  }
};

const AssessmentScheduler = ({
  candidateName,
  candidateEmail,
  companyName,
  jobTitle,
  candidatePhoneNumber,
  setCandidateName,
  setCandidateEmail,
  setCompanyName,
  setJobTitle,
  setCandidatePhoneNumber
}) => {
  return (
            <div>
            <h2 className="text-2xl font-bold mb-4">
                Schedule a psychometric assessment for this candidate
                </h2>
                <p className="mb-4">
                Want to schedule a psychometric assessment for this candidate? If so, fill out their information below and click submit:
                </p>
                <label htmlFor="candidateName" className="block">
                Candidate Full Name:
                </label>
                <input
                type="text"
                id="candidateName"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="mt-1 p-1 border border-gray-300 w-full input-black-text"
                />

                <label htmlFor="candidateEmail" className="block mt-4">
                Candidate Email Address:
                </label>
                <input
                type="email"
                id="candidateEmail"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="mt-1 p-1 border border-gray-300 w-full input-black-text"
                />

                <label htmlFor="companyName" className="block mt-4">
                Hiring Company Name:
                </label>
                <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 p-1 border border-gray-300 w-full input-black-text"
                />

                <label htmlFor="jobTitle" className="block mt-4">
                Hiring Job Title:
                </label>
                <input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="mt-1 p-1 border border-gray-300 w-full input-black-text"
                />

                <label htmlFor="candidatePhoneNumber" className="block mt-4">
                Candidate Phone Number:
                </label>
                <input
                type="tel"
                id="candidatePhoneNumber"
                value={candidatePhoneNumber}
                onChange={(e) => setCandidatePhoneNumber(e.target.value)}
                className="mt-1 p-1 border border-gray-300 w-full input-black-text"
                />

                <button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                >
                Submit
                </button>

            </div>
  );
};

export default AssessmentScheduler;
