import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AssessmentPage.css';
import { Button } from '@mantine/core';

function Assessment() {
  const [assessmentStatus, setAssessmentStatus] = useState(null);
  const [psychometricQuestions, setPsychometricQuestions] = useState([]);
  const [situationalQuestions, setSituationalQuestions] = useState([]);

  const { assessmentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessmentStatus(assessmentId);
    fetchPsychometricQuestions();
    fetchSituationalQuestions();
  }, [assessmentId]);

  const fetchAssessmentStatus = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/get-assessment-status/${id}`);
      const data = response.data;
  
      if (!data || data.status === 'Completed') {
        // Redirect to another page or show an error message when the assessment is not valid or completed
        navigate('/error'); // Replace '/error' with your desired URL or display an error message
      } else {
        setAssessmentStatus(data.status);
      }      
    } catch (error) {
      console.error('Error fetching assessment status:', error);
      // Redirect to another page or show an error message when there's an error fetching the assessment status
      navigate('/error'); // Replace '/error' with your desired URL or display an error message
    }
  };  

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  
  const fetchPsychometricQuestions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/get-psychometric-questions`);
      const data = response.data;
      shuffleArray(data); // Shuffle the questions before setting them to the state
      console.log('Psychometric questions data:', data);
      setPsychometricQuestions(data);
    } catch (error) {
      console.error('Error fetching psychometric questions:', error);
    }
  };  

  const fetchSituationalQuestions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/get-situational-questions`);
      const data = response.data;
      console.log('Situational questions data:', data); // Remove this line after verifying ALL question data is returned
      setSituationalQuestions(data);
    } catch (error) {
      console.error('Error fetching situational questions:', error);
    }
  };

  const handleSubmit = async () => {
    if (assessmentStatus === 'Completed') {
      alert('Sorry, this test can only be taken once.');
      return;
    }
  
    // Collect user's answers and submit them to your API
    const answers = {
      psychometric: psychometricQuestions.map((question) => ({
        questionId: question.QuestionId,
        reverseCoded: question.ReverseCoded,
        category: question.Category,
        answer: Number(document.querySelector(`input[name="psychometric-${question.QuestionId}"]:checked`)?.value) || 0,
      })),
      situational: situationalQuestions.map((question) => ({
        questionId: question.QuestionId,
        category: question.Category,
        answer: Number(document.querySelector(`input[name="situational-${question.QuestionId}"]:checked`)?.value) || 0,
      })),
    };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/submit-assessment`, {
        assessmentId: assessmentId,
        answers: answers,
      });
  
      if (response.status === 200) {
        alert('Assessment submitted successfully');
        setAssessmentStatus('completed');
      } else {
        throw new Error('Error submitting assessment');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };
  
  const PsychometricHeader = () => {
    return (
      <div className="header-row">
        <div>Psychometric Questions</div>
        <div>Strongly Disagree</div>
        <div>Disagree</div>
        <div>Neither Agree nor Disagree</div>
        <div>Agree</div>
        <div>Strongly Agree</div>
      </div>
    );
  };  

  const PsychometricQuestion = ({ question }) => {
    return (
      <div className="question-row">
        <div>{question.QuestionText}</div>
        {question.AnswerChoices.map((choice, index) => (
          <div key={index} className="answer-option">
            <input type="radio" name={`psychometric-${question.QuestionId}`} value={index + 1} />
          </div>
        ))}
      </div>
    );
  };  
  
  const SituationalQuestion = ({ question }) => {
    return (
      <div className="situational-question">
        <p>{question.QuestionText}</p>
        <div className="answer-options">
          {question.AnswerChoices.map((choice, index) => (
            <label key={index}>
              <input type="radio" name={`situational-${question.QuestionId}`} value={index + 1} />
              {choice.answer} {/* Extract the answer text from the choice object */}
            </label>
          ))}
        </div>
      </div>
    );
  };  
  
  return (
    <div className="assessment-page">
      <h2 className="section-title">Candidate Psychometric Assessment</h2>
      <div className="instructions">
        <p>Below you will find a pool of 100 psychometric questions to answer. There are no right or wrong answers, this assessment is designed to provide the hiring manager insights into your personality type and motivators. Please ensure that you are in a space where you can focus, and have enough time to complete the full assessment, as it cannot be saved and resumed. Please answer as honestly as possible:</p>
      </div>
      <PsychometricHeader />
      {psychometricQuestions.map((question) => (
        <PsychometricQuestion key={question.QuestionId} question={question} />
      ))}
      <h2 className="section-title">Situational Assessment Questions</h2>
      <div className="instructions">
        <p>Below you will find 10 situational judgement questions. Please select the answer that reflects the course of action you feel is best suited to the given scenario.</p>
      </div>
      {situationalQuestions.map((question) => (
        <SituationalQuestion key={question.QuestionId} question={question} />
      ))}
      <div className="submission-warning">
        Submissions are final, and you can only take this assessment once. Please ensure you have answered all questions.
      </div>
      <div className="submit-button-container">
        <Button onClick={handleSubmit} variant="outline">Submit Assessment</Button>
      </div>
    </div>
  );   
}

export default Assessment;
