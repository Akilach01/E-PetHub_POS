import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard'; // we'll create this next

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Add more routes like /products, /customers, etc. with same pattern */}
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;