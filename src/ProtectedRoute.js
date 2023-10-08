import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.user.isLoggedIn);
  console.log('isAuth', isAuthenticated);

  return isAuthenticated ? <Route {...rest} element={element} /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
