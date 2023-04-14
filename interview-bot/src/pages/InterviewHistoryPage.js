import React, { useState } from 'react';
import InterviewBox from './elements/InterviewBox';
import ProtectedRoutes from '../components/ProtectedRoutes';

function InterviewHistoryPage() {
  const [selectedInterview, setSelectedInterview] = useState(null);

  const interviews = [
    {
      name: "John Smith",
      jobTitle: "Software Developer",
      date: "April 1, 2023",
      image: "https://example.com/john-smith.jpg",
      details: "John had a strong background in web development and was able to answer all of the interview questions with ease. He seemed like a great fit for our team."
    },
    {
      name: "Jane Doe",
      jobTitle: "Product Manager",
      date: "April 2, 2023",
      image: "https://example.com/jane-doe.jpg",
      details: "Jane was a great communicator and had a lot of experience managing product roadmaps. However, she struggled with some of the technical questions in the interview."
    },
    {
      name: "Bob Johnson",
      jobTitle: "Marketing Specialist",
      date: "April 3, 2023",
      image: "https://example.com/bob-johnson.jpg",
      details: "Bob had a lot of experience in the marketing industry and was able to provide great insights on how to improve our advertising campaigns. However, he was less comfortable with the more technical aspects of the role."
    }
  ];

  const handleInterviewClick = (interview) => {
    if (selectedInterview === interview) {
      setSelectedInterview(null);
    } else {
      setSelectedInterview(interview);
    }
  };

  return (
    <div className="interview-history-page">
      <h1>Interview History Page</h1>
      <div className="interview-box-container">
        {interviews.map((interview, index) => (
          <InterviewBox
            key={index}
            name={interview.name}
            jobTitle={interview.jobTitle}
            date={interview.date}
            image={interview.image}
            details={interview.details}
            isSelected={selectedInterview === interview}
            onClick={() => handleInterviewClick(interview)}
          />
        ))}
      </div>
      {selectedInterview && (
        <div className="expanded-interview-box">
          <h2>{selectedInterview.name}</h2>
          <img src={selectedInterview.image} alt={selectedInterview.name} />
          <h3>{selectedInterview.jobTitle}</h3>
          <p>{selectedInterview.details}</p>
        </div>
      )}
    </div>
  );
}

export default InterviewHistoryPage;
