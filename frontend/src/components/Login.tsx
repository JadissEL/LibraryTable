import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon, 
  BookOpenIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface LoginProps {
  onLogin: (token: string, userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('/users/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Call the onLogin callback with the token and user data
        onLogin(token, user);
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dots">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-md mb-5 animate-float relative">
            <div className="absolute inset-0 bg-white/10 rounded-xl blur-md"></div>
            <BookOpenIcon className="icon-lg text-white relative z-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to access your library bookings
          </p>
        </div>
        
        <div className="card shadow-md border border-gray-100 hover:border-indigo-200/50 transition-all duration-300">
          {error && (
            <div className="alert alert-danger mb-6" role="alert">
              <div className="alert-icon">
                <ExclamationCircleIcon className="icon-sm text-red-500" />
              </div>
              <div className="alert-content">
                <div className="alert-message">{error}</div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email-address" className="form-label">
                Email address
              </label>
              <div className="relative mt-1 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="icon-sm text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" aria-hidden="true" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10 border-gray-300 focus:border-indigo-500 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative mt-1 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="icon-sm text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10 border-gray-300 focus:border-indigo-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign in
                    <ArrowRightIcon className="ml-2 -mr-1 icon-sm" aria-hidden="true" />
                  </span>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
