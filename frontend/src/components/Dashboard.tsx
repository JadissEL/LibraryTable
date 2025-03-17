import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CalendarIcon, 
  TableCellsIcon, 
  UserIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowTrendingUpIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  user: any;
}

interface TableStats {
  total: number;
  available: number;
  booked: number;
}

interface BookingStats {
  upcoming: number;
  past: number;
  cancelled: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [tableStats, setTableStats] = useState<TableStats>({ total: 0, available: 0, booked: 0 });
  const [bookingStats, setBookingStats] = useState<BookingStats>({ upcoming: 0, past: 0, cancelled: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch table statistics
        const tableResponse = await axios.get('/tables/stats');
        setTableStats(tableResponse.data.data);
        
        // Fetch booking statistics
        const bookingResponse = await axios.get('/bookings/stats');
        setBookingStats(bookingResponse.data.data);
      } catch (err: any) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      {/* Hero Section with Welcome Message */}
      <div className="relative mb-10 bg-gradient-to-r from-primary-700 via-primary-600 to-accent-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="flex flex-col md:flex-row items-center relative z-10 px-6 py-8 md:py-10 text-white">
          <div className="md:w-3/4 md:pr-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 animate-fadeInDown">
              Welcome, {user?.name}!
            </h1>
            <p className="text-primary-100 text-base md:text-lg max-w-2xl animate-fadeInDown delay-100">
              Manage your library table bookings from your personal dashboard. Find available tables, make reservations, and track your bookings all in one place.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3 animate-fadeInUp delay-200">
              <Link
                to="/book"
                className="btn btn-md bg-white text-primary-700 hover:bg-primary-50 shadow-md flex items-center transform transition-transform duration-300 hover:scale-105"
              >
                <TableCellsIcon className="icon-sm mr-2" />
                Book a Table
              </Link>
              <Link
                to="/my-bookings"
                className="btn btn-md btn-glass flex items-center transform transition-transform duration-300 hover:scale-105"
              >
                <CalendarIcon className="icon-sm mr-2" />
                View My Bookings
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block md:w-1/4 text-center">
            <div className="relative inline-block animate-float">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl"></div>
              <BookOpenIcon className="icon-xl text-white relative z-10" />
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger mb-6 animate-fadeIn" role="alert">
          <BellAlertIcon className="icon-sm inline-block mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Stats Overview */}
        <div className="card shadow-card border border-secondary-100 hover:border-accent-200 transition-all duration-300 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Overview</h2>
            <ArrowTrendingUpIcon className="icon-md text-accent-500" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Tables */}
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-700 font-medium">Total Tables</span>
                <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center">
                  <TableCellsIcon className="icon-sm text-secondary-700" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-secondary-900">{tableStats.total}</span>
                <span className="text-xs text-secondary-500">Available in library</span>
              </div>
            </div>
            
            {/* Available Tables */}
            <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-success-700 font-medium">Available</span>
                <div className="w-8 h-8 rounded-full bg-success-200 flex items-center justify-center">
                  <CheckCircleIcon className="icon-sm text-success-700" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-success-900">{tableStats.available}</span>
                <span className="text-xs text-success-600">Ready to book</span>
              </div>
            </div>
            
            {/* Booked Tables */}
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-accent-700 font-medium">Booked</span>
                <div className="w-8 h-8 rounded-full bg-accent-200 flex items-center justify-center">
                  <ClockIcon className="icon-sm text-accent-700" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-accent-900">{tableStats.booked}</span>
                <span className="text-xs text-accent-600">Currently in use</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-secondary-100">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Your Booking Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Upcoming Bookings */}
              <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center mr-3">
                  <ClockIcon className="icon-sm text-primary-700" />
                </div>
                <div>
                  <span className="block text-primary-700 font-medium">{bookingStats.upcoming}</span>
                  <span className="text-xs text-primary-600">Upcoming</span>
                </div>
              </div>
              
              {/* Past Bookings */}
              <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-secondary-200 flex items-center justify-center mr-3">
                  <CheckCircleIcon className="icon-sm text-secondary-700" />
                </div>
                <div>
                  <span className="block text-secondary-700 font-medium">{bookingStats.past}</span>
                  <span className="text-xs text-secondary-600">Past</span>
                </div>
              </div>
              
              {/* Cancelled Bookings */}
              <div className="flex items-center p-3 bg-danger-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-danger-200 flex items-center justify-center mr-3">
                  <XCircleIcon className="icon-sm text-danger-700" />
                </div>
                <div>
                  <span className="block text-danger-700 font-medium">{bookingStats.cancelled}</span>
                  <span className="text-xs text-danger-600">Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Profile & Tips */}
        <div className="space-y-8">
          {/* User Profile Card */}
          <div className="card shadow-card border border-secondary-100 hover:border-primary-200 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary-900">Profile</h2>
              <UserIcon className="icon-md text-primary-500" />
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mr-4 shadow-md">
                <span className="text-xl font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div>
                <p className="font-medium text-lg text-secondary-900">{user?.name}</p>
                <p className="text-sm text-secondary-500">{user?.email}</p>
              </div>
            </div>
            
            <div className="bg-secondary-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-secondary-700">Member Since:</span>
                <span className="text-sm text-secondary-900">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-secondary-700">Role:</span>
                <span className={`text-sm ${user?.isAdmin ? 'text-accent-600 font-medium' : 'text-secondary-900'}`}>
                  {user?.isAdmin ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Tips Card */}
          <div className="card shadow-card border border-secondary-100 hover:border-accent-200 transition-all duration-300 bg-gradient-to-br from-accent-50 to-accent-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-accent-900">Library Tips</h2>
              <AcademicCapIcon className="icon-md text-accent-500" />
            </div>
            
            <ul className="space-y-3 text-accent-800">
              <li className="flex items-start bg-white/50 p-2 rounded-lg">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-200 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs font-bold text-accent-700">1</span>
                </div>
                <span>Book tables in advance for better availability</span>
              </li>
              <li className="flex items-start bg-white/50 p-2 rounded-lg">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-200 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs font-bold text-accent-700">2</span>
                </div>
                <span>Cancel bookings you no longer need</span>
              </li>
              <li className="flex items-start bg-white/50 p-2 rounded-lg">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent-200 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs font-bold text-accent-700">3</span>
                </div>
                <span>Quiet study areas are available in the North Wing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
