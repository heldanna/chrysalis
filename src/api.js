
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';


export const getSessionId = () => {
  let id = localStorage.getItem('session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('session_id', id);
  }
  return id;
};

export const fetchCurriculum = async () => {
  const res = await axios.get(`${BASE_URL}/topics/`, {
    params: { session_id: getSessionId() }
  });
  return res.data;
};

export const fetchQuestion = async (topic, difficulty) => {
  const res = await axios.post(`${BASE_URL}/question/`, {
    topic,
    difficulty,
    session_id: getSessionId()
  });
  return res.data;
};

export const fetchExplanation = async (question, options, userAnswer, correctAnswer, userExplanation, topic, difficulty) => {
  const res = await axios.post(`${BASE_URL}/explain/`, {
    question,
    options,
    user_answer: userAnswer,
    correct_answer: correctAnswer,
    user_explanation: userExplanation,
    topic,
    difficulty,
    session_id: getSessionId()
  });
  return res.data;
};