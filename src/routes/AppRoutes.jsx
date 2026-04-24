import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ExpensesPage from '../pages/ExpensesPage';
import Analysis from '../pages/Analysis';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import ExpensesPageMobile from '../pages/ExpensesPageMobile';
import CreateNewExpenses from '../pages/CreateNewExpenses';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ExpensesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/myExpenses"
        element={
          <ProtectedRoute>
            <ExpensesPageMobile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/newExpenses"
        element={
          <ProtectedRoute>
            <CreateNewExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;