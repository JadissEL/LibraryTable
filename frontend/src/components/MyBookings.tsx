import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  TableCellsIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  PlusCircleIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface MyBookingsProps {
  user: any;
}

interface Booking {
  _id: string;
  tableId: {
    _id: string;
    tableNumber: number;
    location: string;
    capacity: number;
  };
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

const MyBookings: React.FC<MyBookingsProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/bookings/my-bookings');
        setBookings(response.data.data);
      } catch (err: any) {
        setError('Failed to load your bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    
    try {
      await axios.patch(`/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' as const } 
          : booking
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = (booking: Booking) => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    return bookingDate >= today && booking.status === 'active';
  };

  const isPast = (booking: Booking) => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    return bookingDate < today || booking.status === 'completed';
  };

  const isCancelled = (booking: Booking) => {
    return booking.status === 'cancelled';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter(isPast);
  const cancelledBookings = bookings.filter(isCancelled);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <CalendarIcon className="me-3" style={{ width: '2rem', height: '2rem', color: '#0d6efd' }} />
          <h1 className="h2 mb-0">My Bookings</h1>
        </div>
        <Link to="/book" className="btn btn-primary">
          <PlusCircleIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
          Book a Table
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <ExclamationTriangleIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
          <div>{error}</div>
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="card text-center p-5">
          <div className="mb-4">
            <CalendarIcon style={{ width: '3rem', height: '3rem', color: '#6c757d', margin: '0 auto' }} />
          </div>
          <h2 className="h4 mb-3">No Bookings Found</h2>
          <p className="text-muted mb-4">You don't have any bookings yet. Start by booking a table for your study session or group meeting.</p>
          <div>
            <Link to="/book" className="btn btn-primary">
              Book Your First Table
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`nav-link d-flex align-items-center ${activeTab === 'upcoming' ? 'active' : ''}`}
              >
                <ClockIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                Upcoming
                {upcomingBookings.length > 0 && (
                  <span className="badge bg-primary rounded-pill ms-2">{upcomingBookings.length}</span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => setActiveTab('past')}
                className={`nav-link d-flex align-items-center ${activeTab === 'past' ? 'active' : ''}`}
              >
                <CheckCircleIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                Past
                {pastBookings.length > 0 && (
                  <span className="badge bg-secondary rounded-pill ms-2">{pastBookings.length}</span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`nav-link d-flex align-items-center ${activeTab === 'cancelled' ? 'active' : ''}`}
              >
                <XCircleIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                Cancelled
                {cancelledBookings.length > 0 && (
                  <span className="badge bg-danger rounded-pill ms-2">{cancelledBookings.length}</span>
                )}
              </button>
            </li>
          </ul>
          
          <div className="mt-4">
            {activeTab === 'upcoming' && (
              <>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">No upcoming bookings</p>
                    <Link to="/book" className="btn btn-primary btn-sm">
                      Book a Table
                    </Link>
                  </div>
                ) : (
                  <div className="row g-4">
                    {upcomingBookings.map(booking => (
                      <div key={booking._id} className="col-md-6">
                        <div className="card h-100 border-start border-4 border-success">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="d-flex">
                                <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                                  <TableCellsIcon style={{ width: '1.5rem', height: '1.5rem', color: '#198754' }} />
                                </div>
                                <div>
                                  <h3 className="h5">Table {booking.tableId.tableNumber}</h3>
                                  <div className="small text-muted d-flex align-items-center mt-1">
                                    <MapPinIcon style={{ width: '1rem', height: '1rem' }} className="me-1" />
                                    {booking.tableId.location}
                                  </div>
                                  <div className="small text-muted d-flex align-items-center mt-1">
                                    <UserGroupIcon style={{ width: '1rem', height: '1rem' }} className="me-1" />
                                    Capacity: {booking.tableId.capacity}
                                  </div>
                                </div>
                              </div>
                              <span className="badge bg-success">Upcoming</span>
                            </div>
                            
                            <hr />
                            
                            <div className="row g-3">
                              <div className="col-sm-6">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <CalendarIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Date</small>
                                </div>
                                <div>{formatDate(booking.date)}</div>
                              </div>
                              <div className="col-sm-6">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <ClockIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Time</small>
                                </div>
                                <div>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                              </div>
                            </div>
                            
                            {booking.purpose && (
                              <div className="mt-3">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <DocumentTextIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Purpose</small>
                                </div>
                                <div>{booking.purpose}</div>
                              </div>
                            )}
                            
                            <hr />
                            
                            <div className="d-flex justify-content-end">
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                disabled={cancellingId === booking._id}
                                className="btn btn-danger btn-sm"
                              >
                                {cancellingId === booking._id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <XCircleIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                    Cancel Booking
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'past' && (
              <>
                {pastBookings.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No past bookings</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {pastBookings.map(booking => (
                      <div key={booking._id} className="col-md-6">
                        <div className="card h-100 border-start border-4 border-secondary">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="d-flex">
                                <div className="bg-secondary bg-opacity-10 rounded p-3 me-3">
                                  <TableCellsIcon style={{ width: '1.5rem', height: '1.5rem', color: '#6c757d' }} />
                                </div>
                                <div>
                                  <h3 className="h5">Table {booking.tableId.tableNumber}</h3>
                                  <div className="small text-muted d-flex align-items-center mt-1">
                                    <MapPinIcon style={{ width: '1rem', height: '1rem' }} className="me-1" />
                                    {booking.tableId.location}
                                  </div>
                                  <div className="small text-muted d-flex align-items-center mt-1">
                                    <UserGroupIcon style={{ width: '1rem', height: '1rem' }} className="me-1" />
                                    Capacity: {booking.tableId.capacity}
                                  </div>
                                </div>
                              </div>
                              <span className="badge bg-secondary">Completed</span>
                            </div>
                            
                            <hr />
                            
                            <div className="row g-3">
                              <div className="col-sm-6">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <CalendarIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Date</small>
                                </div>
                                <div>{formatDate(booking.date)}</div>
                              </div>
                              <div className="col-sm-6">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <ClockIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Time</small>
                                </div>
                                <div>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                              </div>
                            </div>
                            
                            {booking.purpose && (
                              <div className="mt-3">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <DocumentTextIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Purpose</small>
                                </div>
                                <div>{booking.purpose}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'cancelled' && (
              <>
                {cancelledBookings.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No cancelled bookings</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {cancelledBookings.map(booking => (
                      <div key={booking._id} className="col-md-6">
                        <div className="card h-100 border-start border-4 border-danger">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="d-flex">
                                <div className="bg-danger bg-opacity-10 rounded p-3 me-3">
                                  <TableCellsIcon style={{ width: '1.5rem', height: '1.5rem', color: '#dc3545' }} />
                                </div>
                                <div>
                                  <h3 className="h5">Table {booking.tableId.tableNumber}</h3>
                                  <div className="small text-muted d-flex align-items-center mt-1">
                                    <MapPinIcon style={{ width: '1rem', height: '1rem' }} className="me-1" />
                                    {booking.tableId.location}
                                  </div>
                                  <div className="small text-muted d-flex align-items-center mt-1">
                                    <UserGroupIcon style={{ width: '1rem', height: '1rem' }} className="me-1" />
                                    Capacity: {booking.tableId.capacity}
                                  </div>
                                </div>
                              </div>
                              <span className="badge bg-danger">Cancelled</span>
                            </div>
                            
                            <hr />
                            
                            <div className="row g-3">
                              <div className="col-sm-6">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <CalendarIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Date</small>
                                </div>
                                <div>{formatDate(booking.date)}</div>
                              </div>
                              <div className="col-sm-6">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <ClockIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Time</small>
                                </div>
                                <div>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                              </div>
                            </div>
                            
                            {booking.purpose && (
                              <div className="mt-3">
                                <div className="d-flex align-items-center text-body-secondary mb-1">
                                  <DocumentTextIcon style={{ width: '1rem', height: '1rem' }} className="me-2" />
                                  <small className="fw-medium">Purpose</small>
                                </div>
                                <div>{booking.purpose}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
