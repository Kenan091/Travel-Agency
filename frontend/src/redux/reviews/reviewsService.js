import axios from 'axios';

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://travel-agency-0n8l.onrender.com';

export const getReviewsFromAPI = async destinationId => {
  let response = null;

  if (destinationId) {
    response = await axios.get(
      `${API_URL}/destinations/${destinationId}/reviews`
    );
  } else {
    response = await axios.get(`${API_URL}/reviews`);
  }

  return response.data.data;
};

export const getReviewFromAPI = async reviewId => {
  const response = await axios.get(`${API_URL}/reviews/${reviewId}`);
  return response.data.data;
};

export const addReviewToAPI = async (reviewData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/destinations/${reviewData.destinationId}/reviews`,
    reviewData,
    config
  );
  return response.data.data;
};

export const updateReviewFromAPI = async (reviewId, updatedData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/reviews/${reviewId}`,
    updatedData,
    config
  );
  return response.data.data;
};

export const deleteReviewFromAPI = async (reviewId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, config);
  return response.data.data;
};

const reviewsService = {
  getReviewsFromAPI,
  getReviewFromAPI,
  addReviewToAPI,
  updateReviewFromAPI,
  deleteReviewFromAPI,
};

export default reviewsService;
