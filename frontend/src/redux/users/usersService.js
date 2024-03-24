import axios from 'axios';

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://travel-agency-0n8l.onrender.com';

export const getUsersFromAPI = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/users`, config);

  return response.data.data;
};

export const getUserFromAPI = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/users/${userId}`, config);
  return response.data.data;
};

export const createUserInAPI = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/users`, userData, config);
  return response.data.data;
};

export const updateUserFromAPI = async (userId, updatedData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/users/${userId}`,
    updatedData,
    config
  );
  return response.data.data;
};

export const deleteUserFromAPI = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/users/${userId}`, config);
  return response.data.data.id;
};

const usersService = {
  getUsersFromAPI,
  getUserFromAPI,
  createUserInAPI,
  updateUserFromAPI,
  deleteUserFromAPI,
};

export default usersService;
