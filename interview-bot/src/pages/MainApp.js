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
  const navigate = useNavigate();
  const { logout } = useContext(AccountContext);


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
    } catch (error) {
      console.error('Error saving data to DynamoDB:', error);
      alert('Error saving data. Please try again.');
    }
  };      

  return (
      <div className="App min-h-screen text-gray-100">
        <Banner onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
             <>
                <h1 className="text-4xl font-bold mb-4">
                  Self-service, automated, first call screening.
                </h1>
                <div className="typed-text-container">
                  <div id="typed-text" className="text-2xl mb-4"></div>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 bg-gray-800 p-6 rounded-lg form-container">
          <div className="form-content flex">
            <div className="form-inputs">
              <div>
                <label htmlFor="resume" className="block">Upload Resume:</label>
                <input type="file" id="resume" onChange={handleResumeUpload} className="mt-1 p-1 border border-gray-300" />
              </div>
              <div>
                <label htmlFor="jobDescription" className="block">Upload Job Description:</label>
                <input type="file" id="jobDescription" onChange={handleJobDescriptionUpload} className="mt-1 p-1 border border-gray-300" />
              </div>
              <div>
                <label htmlFor="numQuestions" className="block">Number of Interview Questions:</label>
                <input
                  type="number"
                  id="numQuestions"
                  min="1"
                  step="1"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                  className="mt-1 p-1 border border-gray-300 text-gray-700"
                />
              </div>
            </div>
            <div className="form-instructions ml-4">
              <p>Please upload the candidate's resume, the job description, and specify the desired number of interview questions to generate.</p>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Generate Interview Questions</button>
        </form>
  
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
                placeholder="Candidate Name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="p-1 border border-gray-300 w-full"
              />
              <input
                type="email"
                placeholder="Candidate Email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="p-1 border border-gray-300 w-full"
              />
              <input
                type="text"
                placeholder="Hiring Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="p-1 border border-gray-300 w-full"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="p-1 border border-gray-300 w-full"
              />
              <input
                type="text"
                placeholder="Candidate Phone Number"
                value={candidatePhoneNumber}
                onChange={(e) => setCandidatePhoneNumber(e.target.value)}
                className="p-1 border border-gray-300 w-full"
              />
              <button type="button" onClick={handleConfirmAndSaveQuestions} className="bg-blue-600 text-white px-4 py-2 rounded">Confirm and Save Questions</button>
            </div>
          </div>
         )}
       </>
      </div>
    </div>
 );

}

export default App;