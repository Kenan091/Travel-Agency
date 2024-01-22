import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(state => state?.auth);

  const userRole = user?.user?.role;
  // const userRole = user?.responseData?.user?.role;

  return userRole === 'registeredUser' ? (
    children
  ) : (
    <Navigate
      to='/auth/login'
      replace
    />
  );
};

export default ProtectedRoute;
