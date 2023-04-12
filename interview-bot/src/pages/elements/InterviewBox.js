import React, { useState } from 'react';
import './InterviewBox.css';

function InterviewBox({ name, jobTitle, date, questions, answers, imageUrl }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBoxClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`interview-box${isExpanded ? ' expanded' : ''}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={handleBoxClick}
    >
      <div className="interview-box-content">
        <h2>{name}</h2>
        <h3>{jobTitle}</h3>
        <p>{date}</p>
        {isExpanded && (
          <div className="interview-box-details">
            <ul>
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
            {answers && (
              <div className="interview-box-answers">
                <h4>Interview Answers:</h4>
                <p>{answers}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewBox;
