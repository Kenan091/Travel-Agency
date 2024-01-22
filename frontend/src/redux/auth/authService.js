import axios from 'axios';
const API_URL = 'http://localhost:5000/auth';

// Async function for user registration
export const register = async userData => {
  const response = await axios.post(`${API_URL}/register`, userData);

  return response.data;
};

// Async function for user login
export const login = async credentials => {
  const response = await axios.post(`${API_URL}/login`, credentials);

  return response.data;
};

// Async function for user logout
export const logout = () => {
  localStorage.removeItem('user');
};

// Async function for getting the current logged-in user
export const getMeFromAPI = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/auth/me`, config);
  console.log(response);
  return response.data;
};

// Async function for updating user details
export const updateDetailsFromAPI = async (updatedDetails, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/updatedetails`,
    updatedDetails,
    config
  );

  return response.data;
};

// Async function for updating user password
export const updatePasswordFromAPI = async passwordData => {
  const response = await axios.put(`${API_URL}/updatepassword`, passwordData);

  return response.data;
};

// Async function for forgetting password
export const forgotPasswordFromAPI = async email => {
  const response = await axios.post(`${API_URL}/forgotpassword`, { email });

  return response.data;
};

// Async function for resetting password
export const resetPasswordFromAPI = async (resetToken, newPassword) => {
  const response = await axios.put(`${API_URL}/resetpassword/${resetToken}`, {
    password: newPassword,
  });

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMeFromAPI,
  updateDetailsFromAPI,
  updatePasswordFromAPI,
  forgotPasswordFromAPI,
  resetPasswordFromAPI,
};

export default authService;
