import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in by looking for the token in localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
