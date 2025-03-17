import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import LandingPage from './components/LandingPage';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

if (!process.env.REACT_APP_BACKEND_URL) {
  console.warn("REACT_APP_BACKEND_URL is not set.");
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });

          setUser(response.data.data);
          setLoading(false);
        } catch (err: any) {
          setError(err.message);
          localStorage.removeItem('token');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);

    delete axios.defaults.headers.common['Authorization'];
  };

  return { user, loading, error, login, logout };
};

const App: React.FC = () => {
  const { user, loading, error, login, logout } = useAuth();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Navbar isAuthenticated={!!user} user={user} onLogout={logout} />

        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register onLogin={login} />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <main className="py-4 container">
                  <Dashboard user={user} />
                </main>
              </ProtectedRoute>
            }
          />

          <Route
            path="/book"
            element={
              <ProtectedRoute>
                <main className="py-4 container">
                  <BookingForm user={user} />
                </main>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <main className="py-4 container">
                  <MyBookings user={user} />
                </main>
              </ProtectedRoute>
            }
          />

          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
