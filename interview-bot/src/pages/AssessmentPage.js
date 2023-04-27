import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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

  const fetchPsychometricQuestions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/get-psychometric-questions`);
      const data = response.data;
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

  const handleSubmit = async () => {
    if (assessmentStatus === 'Completed') {
      alert('Sorry, this test can only be taken once.');
      return;
    }
  
    // Collect user's answers and submit them to your API
    const answers = {
        psychometric: psychometricQuestions.map((question) => ({
          questionId: question.QuestionId,
          answer: Number(document.querySelector(`input[name="psychometric-${question.QuestionId}"]:checked`)?.value) || 0,
        })),
        situational: situationalQuestions.map((question) => ({
          questionId: question.QuestionId,
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
  
  const PsychometricQuestion = ({ question }) => {
    return (
      <div className="psychometric-question">
        <p>{question.QuestionId}. {question.QuestionText}</p>
        <div className="answer-options">
          <label><input type="radio" name={`psychometric-${question.QuestionId}`} value="1" /> Strongly Disagree</label>
          <label><input type="radio" name={`psychometric-${question.QuestionId}`} value="2" /> Disagree</label>
          <label><input type="radio" name={`psychometric-${question.QuestionId}`} value="3" /> Neither Agree nor Disagree</label>
          <label><input type="radio" name={`psychometric-${question.QuestionId}`} value="4" /> Agree</label>
          <label><input type="radio" name={`psychometric-${question.QuestionId}`} value="5" /> Strongly Agree</label>
        </div>
      </div>
    );
  };
  
  const SituationalQuestion = ({ question }) => {
    return (
      <div className="situational-question">
        <p>{question.QuestionId}. {question.QuestionText}</p>
        <div className="answer-options">
          {question.AnswerChoices.map((choice, index) => (
            <label key={index}>
              <input type="radio" name={`situational-${question.QuestionId}`} value={index + 1} />
              {choice}
            </label>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h2>Psychometric Questions</h2>
      {psychometricQuestions.map((question) => (
        <PsychometricQuestion key={question.QuestionId} question={question} />
      ))}
      <h2>Situational Assessment Questions</h2>
      {situationalQuestions.map((question) => (
        <SituationalQuestion key={question.QuestionId} question={question} />
      ))}
      <button onClick={handleSubmit}>Submit Assessment</button>
    </div>
  );  
}

export default Assessment;
