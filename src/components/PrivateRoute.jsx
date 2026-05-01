import { Navigate } from 'react-router-dom';

// В реальном проекте здесь будет проверка токена
const PrivateRoute = ({ children }) => {
  const isAuthenticated = true; // пока всегда true
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;