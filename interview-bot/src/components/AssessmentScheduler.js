import React, { useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { TextInput, Loader, Modal, Paper, Text } from '@mantine/core';
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
  candidatePhoneNumber,
  setLoading,
  setSuccessModalOpened
) => {
  setLoading(true);

  try {
    const managerAccountId = await getManagerAccountId();
    if (!managerAccountId) {
      console.error('Failed to get manager account ID');
      setLoading(false);
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
      assessmentStatus: "Pending",
    };

    await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/schedule-assessment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // Increment the assessment counter
    await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/update-counters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ counterType: "assessment" }),
    });

    setLoading(false);
    setSuccessModalOpened(true);
  } catch (error) {
    setLoading(false);
    console.error("Error while creating the assessment:", error);
  }
};

const AssessmentScheduler = () => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [successModalOpened, setSuccessModalOpened] = useState(false);

  const toggleSuccessModal = () => setSuccessModalOpened(!successModalOpened);

  return (
    <>
      <Modal
        opened={successModalOpened}
        onClose={toggleSuccessModal}
        title="Invitation Sent!"
      >
        <Paper
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          padding="md"
          shadow="xs"
          >
          <Text>
            We've sent an email to {candidateName} at the following address{' '}
            {candidateEmail} with instructions for taking their assessment. Once
            the candidate has completed the assessment we will send you the results
            via email. Please note that you can also view all of your candidates'
            assessments from the "Interview History" page.
          </Text>
        </Paper>
      </Modal>
  
      <div className="mt-20 mb-24 max-w-2xl mx-auto p-8 rounded-lg bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
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
            onChange={(e) => setCandidateName(e.target.value)}
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
            onChange={(e) => setCandidateEmail(e.target.value)}
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
            onChange={(e) => setCompanyName(e.target.value)}
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
            onChange={(e) => setJobTitle(e.target.value)}
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
            onChange={(e) => setCandidatePhoneNumber(e.target.value)}
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
                  candidatePhoneNumber,
                  setLoading,
                  setSuccessModalOpened
                )
              }
              color="blue"
              className="mt-4"
              disabled={loading}
            >
              Submit
            </Button>
            {loading && <Loader className="ml-4" />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentScheduler;
