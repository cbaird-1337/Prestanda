// LandingCounterBanner.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LandingCounterBanner.css';
import { Paper } from '@mantine/core';
import { FaGithub } from 'react-icons/fa';

const LandingCounterBanner = () => {
  const [lastCommit, setLastCommit] = useState('');
  const [interviews, setInterviews] = useState(0);
  const [assessments, setAssessments] = useState(0);

  // fetch last github commit by calling backend api endpoint to hit Github API
  useEffect(() => {
    const fetchLastCommit = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/last-commit`);
        setLastCommit(response.data.lastCommit);
      } catch (error) {
        console.error("Error fetching last commit:", error);
      }
    };

    fetchLastCommit();
  }, []);

  //calling backend API endpoint to fetch assessment and interview counts from corresponding dynamodb table
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/fetch-counts`);
        setInterviews(response.data.interviews);
        setAssessments(response.data.assessments);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="counter-container">
      <Paper className="counter" padding="md" shadow="xs">
      <FaGithub className="github-icon" />
        <span className="counter-value">{lastCommit}</span>
        <span className="counter-label">Last Commit:</span>
      </Paper>
      <Paper className="counter" padding="md" shadow="xs">
        <span className="counter-value">{interviews}</span>
        <span className="counter-label"> Interview Screenings Scheduled</span>
      </Paper>
      <Paper className="counter" padding="md" shadow="xs">
        <span className="counter-value">{assessments}</span>
        <span className="counter-label"> Psychometric Assessments Scheduled</span>
      </Paper>
    </div>
  );  
};

export default LandingCounterBanner;
