import axios from 'axios';

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://travel-agency-0n8l.onrender.com';


export const getDestinationsFromAPI = async () => {
  const response = await axios.get(`${API_URL}/destinations`);
  return response.data.data;
};

export const getDestinationFromAPI = async destinationId => {
  const response = await axios.get(`${API_URL}/destinations/${destinationId}`);
  return response.data.data;
};

export const addDestinationToAPI = async (destinationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/destinations`,
    destinationData,
    config
  );

  return response.data.data;
};

export const updateDestinationFromAPI = async (
  destinationId,
  updatedData,
  token
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/destinations/${destinationId}`,
    updatedData,
    config
  );
  return response.data.data;
};

export const deleteDestinationFromAPI = async (destinationId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(
    `${API_URL}/destinations/${destinationId}`,
    config
  );

  return response.data.data.id;
};

const destinationsService = {
  getDestinationsFromAPI,
  getDestinationFromAPI,
  addDestinationToAPI,
  updateDestinationFromAPI,
  deleteDestinationFromAPI,
};

export default destinationsService;
