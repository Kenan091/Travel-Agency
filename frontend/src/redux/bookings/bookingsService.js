import axios from 'axios';

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://travel-agency-0n8l.onrender.com';


export const getBookingsFromAPI = async destinationId => {
  let response;

  if (destinationId) {
    response = await axios.get(
      `${API_URL}/destinations/${destinationId}/bookings`
    );
  } else {
    response = await axios.get(`${API_URL}/bookings`);
  }
  return response.data.data;
};

export const getBookingFromAPI = async bookingId => {
  const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
  return response.data.data;
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
  return response.data.data;
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

  return response.data.message;
};

export const updateBookingFromAPI = async (bookingId, updatedData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/bookings/${bookingId}`,
    updatedData,
    config
  );
  return response.data.data;
};

export const deleteBookingFromAPI = async (bookingId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(
    `${API_URL}/bookings/${bookingId}`,
    config
  );
  return response.data.data.id;
};

const bookingsService = {
  getBookingsFromAPI,
  getBookingFromAPI,
  createBookingInAPI,
  checkDestinationBookingFromAPI,
  updateBookingFromAPI,
  deleteBookingFromAPI,
};

export default bookingsService;
