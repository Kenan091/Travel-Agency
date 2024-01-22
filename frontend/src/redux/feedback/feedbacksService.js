import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getFeedbacksFromAPI = async () => {
  const response = await axios.get(`${API_URL}/feedbacks`);
  return response.data;
};

export const addFeedbackToAPI = async feedbackData => {
  const response = await axios.post(`${API_URL}/feedbacks`, feedbackData);
  return response.data;
};

const feedbacksService = {
  getFeedbacksFromAPI,
  addFeedbackToAPI,
};

export default feedbacksService;
