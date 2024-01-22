import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const { user } = useSelector(state => state?.auth);
  const userRole = user?.user?.role;

  return userRole === 'admin' ? (
    children
  ) : (
    <Navigate
      to='/auth/login'
      replace
    />
  );
};

export default AdminProtectedRoute;
