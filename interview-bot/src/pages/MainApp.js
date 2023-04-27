//defines the behavior and layout of a web application. It contains state variables and functions to handle file uploads, 
//generate interview questions based on uploaded files, refine generated questions, and save questions and 
//candidate information to an AWS DynamoDB table. It also uses other React components and React Router for navigation. 


import React, { useState, useEffect, useContext } from 'react';
import './MainApp.css';
import axios from 'axios';
import aws from 'aws-sdk';
import awsConfig from '../aws-config';
import Typed from 'typed.js';
import Luminaire from '../components/Luminaire';
import Banner from '../components/Banner';
import { AccountContext } from "../components/auth/Account";
import { useNavigate } from 'react-router-dom';
import AccountPage from './AccountPage';
import InterviewHistoryPage from './InterviewHistoryPage';
import Protected from '../components/ProtectedRoutes';
import Landing from './Landing';
import ProtectedRoutes from '../components/ProtectedRoutes';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import AssessmentScheduler from '../components/AssessmentScheduler';

aws.config.update(awsConfig);
const dynamodb = new aws.DynamoDB.DocumentClient();

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [luminaireOn, setLuminaireOn] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AccountContext);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  //form to fill out candidate information for saving to s3
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState('');

  useEffect(() => {
    try {
      const typedText = new Typed('#typed-text', {
        strings: [
          'No worrying about backlogs...^2000',
          'No worrying about calendars...^2000',
          'No worrying about contracts...^2000',
          'No worrying about hidden fees...^2000',
          'Never miss out on the right talent...^2000',
        ],
        typeSpeed: 50,
        backSpeed: 30,
        smartBackspace: true,
        loop: false,
        startDelay: 1000,
      });
    
      return () => {
        typedText.destroy();
      };
    } catch (error) {
      console.error('Error initializing Typed.js:', error);
    }
  }, []);

  //logging, delete this later
  useEffect(() => {
    console.log('App component mounted');
    console.log(`Current location: ${window.location.href}`);
  }, []);
 //delete above segment

  const handleResumeUpload = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleJobDescriptionUpload = (event) => {
    setJobDescriptionFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!resumeFile || !jobDescriptionFile) {
      alert('Please upload both the resume and job description files');
      return;
    }
  
    setIsLoading(true); // Set isLoading to true before making the API call
  
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescriptionFile);
    formData.append('numberOfQuestions', numQuestions);
  
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_UPLOAD_URL, formData);
      setQuestions(response.data.questions);
    } catch (err) {
      console.error('Error:', err.message);
      alert('Error generating questions. Please try again.');
    }
  
    setIsLoading(false); // Set isLoading back to false after the API call is finished
  };
  
  const handleRefineSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the backend API to refine the questions
      const response = await axios.post(process.env.REACT_APP_BACKEND_REFINE_URL, {
        questions,
        prompt: refinePrompt,
      });
  
      // Update the questions state with the refined questions from the API response
      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error);
    }
  };  

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openConfirmationModal = () => {
    console.log('Opening confirmation modal'); // Add this line
    setShowConfirmationModal(true);
  };  

  // handleConfirmAndSaveQuestions function to save questions and candidate details to s3
  const handleConfirmAndSaveQuestions = async (event) => {
    event.preventDefault();

    if (!candidateName || !candidateEmail || !companyName || !jobTitle) {
      alert('Please fill out all the fields before saving.');
      return;
    }

    const lowerCaseCandidateName = candidateName.toLowerCase();
    const lowerCaseCompanyName = companyName.toLowerCase();
    const lowerCaseJobTitle = jobTitle.toLowerCase();
    const countryCode = '+1'; // Set the desired country code here
    const sanitizedPhoneNumber = candidatePhoneNumber.replace(/[-\s]/g, '');

    // Prepend the country code if it's not already present
    const phoneNumberWithCountryCode = sanitizedPhoneNumber.startsWith(countryCode) ? sanitizedPhoneNumber : countryCode + sanitizedPhoneNumber;

    const interviewData = {
      candidateName: lowerCaseCandidateName,
      candidateEmail,
      companyName: lowerCaseCompanyName,
      jobTitle: lowerCaseJobTitle,
      candidatePhoneNumber: phoneNumberWithCountryCode,
      numQuestions: questions.length // Add numQuestions field to the JSON document
    };

    // Add each question as an individual attribute with a prefix (e.g., question1, question2, etc.)
    questions.forEach((question, index) => {
      interviewData[`question${index + 1}`] = question;
    });

    try {
      const params = {
        TableName: 'PrestandaInterviewBot',
        Item: interviewData
      };

      await dynamodb.put(params).promise();
      alert('Questions and candidate information saved successfully!');
      
      // Call the backend API to send SES email to the candidate
      const sesResponse = await axios.post(process.env.REACT_APP_BACKEND_SEND_EMAIL_URL, {
        candidateName: lowerCaseCandidateName,
        candidateEmail,
        companyName: lowerCaseCompanyName,
        jobTitle: lowerCaseJobTitle,
        candidatePhoneNumber: phoneNumberWithCountryCode,
      });

      if (sesResponse.data.success) {
        alert('Email sent successfully to the candidate.');
      } else {
        alert('Error sending email. Please try again.');
      }

    } catch (error) {
      console.error('Error saving data and sending email:', error);
      alert('Error saving data and sending email. Please try again.');
    }
  };
  
  return (
    <div className="App min-h-screen text-gray-100">
      <Banner onLogout={handleLogout} />
      <div className="main-content pt-20"> {/* Add this wrapper div with a custom className */}
        <div className="container mx-auto px-4 py-8">
          <>
            <h1 className="text-4xl font-bold mb-4">
              Self-service, automated, first call interview screening.
            </h1>
            <div className="typed-text-container">
              <div id="typed-text" className="text-2xl mb-4"></div>
            </div>
            <div className="forms-container flex flex-col space-y-8">
             <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-gray-800 p-6 rounded-lg form-container"
             >
              <div className="form-content">
                <div className="form-inputs">
                  <div>
                    <label htmlFor="resume" className="block">
                      Upload Resume:
                    </label>
                    <input
                      type="file"
                      id="resume"
                      onChange={handleResumeUpload}
                      className="mt-1 p-1 border border-gray-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="jobDescription" className="block">
                      Upload Job Description:
                    </label>
                    <input
                      type="file"
                      id="jobDescription"
                      onChange={handleJobDescriptionUpload}
                      className="mt-1 p-1 border border-gray-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="numQuestions" className="block">
                      Number of Interview Questions:
                    </label>
                    <input
                      type="number"
                      id="numQuestions"
                      min="1"
                      step="1"
                      value={numQuestions}
                      onChange={(e) =>
                        setNumQuestions(parseInt(e.target.value, 10))
                      }
                      className="mt-1 p-1 border border-gray-300 text-gray-700"
                    />
                  </div>
                </div>
                <div className="form-instructions">
                  <p>
                  <strong style={{ color: "#ffdb58" }}>Step 1:</strong> Upload the candidate's resume, the job
                    description you're hiring for, and the desired number of interview
                    questions to generate.
                  </p>
                  <p style={{ marginTop: "1rem" }}>
                  <strong style={{ color: "#ffdb58" }}>Supported file formats:</strong> .docx, .pdf &amp; .txt
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Generate Interview Questions
              </button>
            </form>

            <div>
              <AssessmentScheduler
                candidateName={candidateName}
                candidateEmail={candidateEmail}
              />
            </div>
          </div>
  
        {isLoading && <Luminaire />}
  
        {questions.length > 0 && (
          <div className="preview mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Generated Interview Questions:</h2>
            <ol className="list-decimal list-inside">
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ol>
            <div>
              <form onSubmit={handleRefineSubmit} className="space-y-4 mt-8">
                <label htmlFor="refinePrompt" className="block">Refine the interview questions further:</label>
                <textarea
                  id="refinePrompt"
                  rows="10"
                  cols="30"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  className="mt-1 p-1 border border-gray-300 w-full"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Refine Questions</button>
              </form>
            </div>
            <div className="space-y-4 mt-8">
              <input
                type="text"
                placeholder="Candidate Full Name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="p-1 border border-gray-300 w-full input-black-text"
              />
              <input
                type="email"
                placeholder="Candidate Email Address"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="p-1 border border-gray-300 w-full input-black-text"
              />
              <input
                type="text"
                placeholder="Hiring Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="p-1 border border-gray-300 w-full input-black-text"
              />
              <input
                type="text"
                placeholder="Hiring Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="p-1 border border-gray-300 w-full input-black-text"
              />
              <input
                type="tel"
                placeholder="Candidate Phone Number"
                value={candidatePhoneNumber}
                onChange={(e) => setCandidatePhoneNumber(e.target.value)}
                className="p-1 border border-gray-300 w-full input-black-text"
              />
              <button type="button" onClick={openConfirmationModal} className="bg-blue-600 text-white px-4 py-2 rounded">Schedule Phone Screening</button>
            </div>
          </div>
         )}
        {/* Add this code block right before the </> closing tag */}
        <Transition show={showConfirmationModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setShowConfirmationModal(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                  Confirmation
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-white">
                    We are going to email the candidate with instructions to complete the phone screening using the following information:
                  </p>
                  <p className="text-sm text-white mt-2">Name: {candidateName}</p>
                  <p className="text-sm text-white">Email: {candidateEmail}</p>
                  <p className="text-sm text-white">Phone: {candidatePhoneNumber}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                    onClick={(event) => {
                      setShowConfirmationModal(false);
                      handleConfirmAndSaveQuestions(event);
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() => setShowConfirmationModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
       </>
      </div>
     </div> {/* Close the wrapper div */}
    </div>
 );

}

export default App;