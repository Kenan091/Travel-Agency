import axios from 'axios';

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://travel-agency-0n8l.onrender.com';

export const getFeedbacksFromAPI = async () => {
  const response = await axios.get(`${API_URL}/feedbacks`);
  return response.data.data;
};

export const addFeedbackToAPI = async feedbackData => {
  const response = await axios.post(`${API_URL}/feedbacks`, feedbackData);
  return response.data.data;
};

export const deleteFeedbackFromAPI = async (feedbackId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(
    `${API_URL}/feedbacks/${feedbackId}`,
    config
  );

  return response.data.data.id;
};

const feedbacksService = {
  getFeedbacksFromAPI,
  addFeedbackToAPI,
  deleteFeedbackFromAPI,
};

export default feedbacksService;
