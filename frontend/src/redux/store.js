import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import bookingsReducer from '../redux/bookings/bookingsSlice';
import destinationsReducer from '../redux/destinations/destinationsSlice';
import feedbacksReducer from '../redux/feedback/feedbacksSlice';
import reviewsReducer from '../redux/reviews/reviewsSlice';
import usersReducer from '../redux/users/usersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingsReducer,
  destination: destinationsReducer,
  feedback: feedbacksReducer,
  review: reviewsReducer,
  user: usersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
