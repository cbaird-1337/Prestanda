// LandingCounterBanner.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LandingCounterBanner.css';

const LandingCounterBanner = () => {
  const [lastCommit, setLastCommit] = useState('');
  const [interviews, setInterviews] = useState(0);
  const [assessments, setAssessments] = useState(0);

  useEffect(() => {
    const fetchLastCommit = async () => {
      const token = process.env.REACT_APP_GITHUB_TOKEN;
      const repo = 'cbaird-1337/Prestanda';
      const config = {
        headers: { Authorization: `token ${token}` },
      };
      const response = await axios.get(`https://api.github.com/repos/${repo}/commits`, config);
      const lastCommitDate = new Date(response.data[0].commit.author.date);
      setLastCommit(lastCommitDate.toLocaleString());
    };

    fetchLastCommit();
  }, []);

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
      <div className="counter">
        <span className="counter-value">{lastCommit}</span>
        <span className="counter-label">Last Commit:</span>
      </div>
      <div className="counter">
        <span className="counter-value">{interviews}</span>
        <span className="counter-label"> Interview Screenings Performed</span>
      </div>
      <div className="counter">
        <span className="counter-value">{assessments}</span>
        <span className="counter-label"> Psychometric Assessments Scheduled</span>
      </div>
    </div>
  );
};

export default LandingCounterBanner;
