import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AssessmentPage.css';
import { Button } from '@mantine/core';

function Assessment() {
  const [assessmentStatus, setAssessmentStatus] = useState(null);
  const [psychometricQuestions, setPsychometricQuestions] = useState([]);
  const [situationalQuestions, setSituationalQuestions] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState({});
  const [psychometricAnswers, setPsychometricAnswers] = useState({});
  const [situationalAnswers, setSituationalAnswers] = useState({});

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
      setPsychometricQuestions(data);
    } catch (error) {
      console.error('Error fetching psychometric questions:', error);
    }
  };  

  const fetchSituationalQuestions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/get-situational-questions`);
      const data = response.data;
      setSituationalQuestions(data);
    } catch (error) {
      console.error('Error fetching situational questions:', error);
    }
  };

    //submit assessment handler
  const handleSubmit = async () => {
    if (assessmentStatus === 'Completed') {
      alert('Sorry, this test can only be taken once.');
      return;
    }
  
    // Collect user's answers and submit them to your API
    const PsychometricAnswers = Object.keys(psychometricAnswers).map((key) => ({
      QuestionId: Number(key),
      ReverseCoded: psychometricQuestions.find((q) => q.QuestionId === Number(key)).ReverseCoded,
      Category: psychometricQuestions.find((q) => q.QuestionId === Number(key)).Category,
      Answer: psychometricAnswers[key],
    }));
  
    const SituationalAnswers = Object.keys(situationalAnswers).map((key) => ({
      QuestionId: Number(key),
      Category: situationalQuestions.find((q) => q.QuestionId === Number(key)).Category,
      Answer: situationalAnswers[key],
    }));

  const answers = {
    AssessmentId: assessmentId,
    PsychometricAnswers: PsychometricAnswers,
    SituationalAnswers: SituationalAnswers,
  };
    
   // Calculate the unanswered questions
  const newUnansweredQuestions = {};
    PsychometricAnswers.forEach((answer) => {
      if (answer.Answer === 0) {
        newUnansweredQuestions[`psychometric-${answer.QuestionId}`] = true;
      }
    });
    SituationalAnswers.forEach((answer) => {
      if (answer.Answer === 0) {
        newUnansweredQuestions[`situational-${answer.QuestionId}`] = true;
      }
    });

    setUnansweredQuestions(newUnansweredQuestions);
    const allQuestionsAnswered = Object.keys(newUnansweredQuestions).length === 0;

    if (!allQuestionsAnswered) {
      alert('Please answer all questions before submitting.');
      return;
    }

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
        <div>Neutral</div>
        <div>Agree</div>
        <div>Strongly Agree</div>
      </div>
    );
  };  

  const handleAnswerChange = (questionType, questionId, answer) => {
    if (questionType === 'psychometric') {
      setPsychometricAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
    } else if (questionType === 'situational') {
      setSituationalAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
    }
  
    setUnansweredQuestions((prevUnanswered) => {
      const newUnanswered = { ...prevUnanswered };
      if (answer > 0) {
        delete newUnanswered[`${questionType}-${questionId}`];
      } else {
        newUnanswered[`${questionType}-${questionId}`] = true;
      }
      return newUnanswered;
    });
  };  

  const PsychometricQuestion = ({ question }) => {
    const isUnanswered = unansweredQuestions[`psychometric-${question.QuestionId}`];
    const currentAnswer = psychometricAnswers[question.QuestionId] || 0;
    return (
      <div className={`question-row ${isUnanswered ? 'unanswered' : ''}`}>
        <div>{question.QuestionText}</div>
        {question.AnswerChoices.map((choice, index) => (
          <label key={index} className="answer-option">
            <input
              type="radio"
              name={`psychometric-${question.QuestionId}`}
              value={index + 1}
              checked={currentAnswer === index + 1}
              onChange={(e) =>
                handleAnswerChange("psychometric", question.QuestionId, Number(e.target.value))
              }
            />
          </label>
        ))}
      </div>
    );
  };  

  const SituationalQuestion = ({ question }) => {
    const isUnanswered = unansweredQuestions[`situational-${question.QuestionId}`];
    const currentAnswer = situationalAnswers[question.QuestionId] || 0;
    return (
      <div className={`situational-question ${isUnanswered ? 'unanswered' : ''}`}>
        <p>{question.QuestionText}</p>
        <div className="answer-options">
          {question.AnswerChoices.map((choice, index) => (
            <label key={index}>
              <input
                type="radio"
                name={`situational-${question.QuestionId}`}
                value={index + 1}
                checked={currentAnswer === index + 1}
                onChange={(e) =>
                  handleAnswerChange("situational", question.QuestionId, Number(e.target.value))
                }
              />
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
