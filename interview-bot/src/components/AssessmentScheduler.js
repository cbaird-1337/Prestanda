import React, { useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';

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

    const handleSubmit = async (
      candidateName,
      candidateEmail,
      companyName,
      jobTitle,
      candidatePhoneNumber
    ) => {

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

const AssessmentScheduler = () => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState('');

  return (
    <div className="bg-gradient-to-b from-gray-600 to-gray-900 rounded-md shadow-md p-6 w-3/4 mx-auto pt-8">
      <h2 className="text-2xl font-bold mb-4">
        Psychometric Assessment Scheduler
      </h2>
      <p className="mb-4">
        Our comprehensive psychometric assessment features 100 scientifically-backed IPIP questions and 10 situational judgment questions that are designed to provide a reliable and accurate evaluation of your candidate's potential. Fill out their information below to schedule an assessment:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="candidateName" className="block">
            Candidate Full Name:
          </label>
          <TextInput
            id="candidateName"
            placeholder="Candidate Full Name"
            value={candidateName}
            onChange={setCandidateName}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="candidateEmail" className="block">
            Candidate Email Address:
          </label>
          <TextInput
            type="email"
            id="candidateEmail"
            placeholder="Candidate Email Address"
            value={candidateEmail}
            onChange={setCandidateEmail}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="companyName" className="block">
            Hiring Company Name:
          </label>
          <TextInput
            id="companyName"
            placeholder="Hiring Company Name"
            value={companyName}
            onChange={setCompanyName}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="block">
            Hiring Job Title:
          </label>
          <TextInput
            id="jobTitle"
            placeholder="Hiring Job Title"
            value={jobTitle}
            onChange={setJobTitle}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="candidatePhoneNumber" className="block">
            Candidate Phone Number:
          </label>
          <TextInput
            type="tel"
            id="candidatePhoneNumber"
            placeholder="Candidate Phone Number"
            value={candidatePhoneNumber}
            onChange={setCandidatePhoneNumber}
            className="mt-1"
          />
        </div>
        <div className="col-span-2 flex justify-center">
        <Button
          type="submit"
          onClick={() =>
            handleSubmit(
              candidateName,
              candidateEmail,
              companyName,
              jobTitle,
              candidatePhoneNumber
            )
          }
          color="blue"
          className="mt-4"
        >
          Submit
        </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentScheduler;
