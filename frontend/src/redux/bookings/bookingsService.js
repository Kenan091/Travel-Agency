import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getBookingsFromAPI = async destinationId => {
  let response;

  if (destinationId) {
    response = await axios.get(
      `${API_URL}/destinations/${destinationId}/bookings`
    );
  } else {
    response = await axios.get(`${API_URL}/bookings`);
  }
  return response.data;
};

export const getBookingFromAPI = async bookingId => {
  const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
  return response.data;
};

export const createBookingInAPI = async (bookingData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/bookings/${bookingData.destinationId}`,
    bookingData,
    config
  );
  return response.data;
};

export const checkDestinationBookingFromAPI = async (checkData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/bookings/check/${checkData.destinationId}`,
    checkData,
    config
  );
  return response.data;
};

export const updateBookingFromAPI = async (bookingId, updatedData) => {
  const response = await axios.put(
    `${API_URL}/bookings/${bookingId}`,
    updatedData
  );
  return response.data;
};

export const deleteBookingFromAPI = async bookingId => {
  const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
  return response.data;
};

const bookingsService = {
  getBookingsFromAPI,
  getBookingFromAPI,
  createBookingInAPI,
  updateBookingFromAPI,
  deleteBookingFromAPI,
};

export default bookingsService;
