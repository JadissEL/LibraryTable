import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  TableCellsIcon, 
  PencilSquareIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface BookingFormProps {
  user: any;
}

interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  location: string;
  isAvailable: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ user }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('/tables/available');
        setTables(response.data.data);
      } catch (err: any) {
        setError('Failed to load available tables. Please try again later.');
        console.error('Error fetching tables:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTable || !date || !startTime || !endTime) {
      setError('Please fill in all required fields');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const bookingData = {
        tableId: selectedTable,
        date,
        startTime,
        endTime,
        purpose: purpose || 'Study session'
      };

      await axios.post('/bookings', bookingData);
      setSuccess(true);
      
      setSelectedTable('');
      setPurpose('');
      
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTableDetails = (tableId: string) => {
    const table = tables.find(t => t._id === tableId);
    return table ? `Table ${table.tableNumber} - ${table.location} (Capacity: ${table.capacity})` : '';
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

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <TableCellsIcon className="me-3" style={{ width: '2rem', height: '2rem', color: '#0d6efd' }} />
        <h1 className="h2 mb-0">Book a Library Table</h1>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <CheckCircleIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
          <div>Booking created successfully! Redirecting to your bookings...</div>
        </div>
      )}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label htmlFor="table" className="form-label">
                  Select Table <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <TableCellsIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  </span>
                  <select
                    id="table"
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">-- Select a table --</option>
                    {tables.map((table) => (
                      <option key={table._id} value={table._id}>
                        Table {table.tableNumber} - {table.location} (Capacity: {table.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">
                  Date <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <CalendarIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  </span>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-control"
                    required
                  />
                </div>
              </div>
          
              <div className="col-md-6">
                <label htmlFor="startTime" className="form-label">
                  Start Time <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <ClockIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  </span>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="endTime" className="form-label">
                  End Time <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <ClockIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  </span>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
              </div>
          
              <div className="col-12">
                <label htmlFor="purpose" className="form-label">
                  Purpose <span className="text-muted">(optional)</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <PencilSquareIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  </span>
                  <textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="form-control"
                    placeholder="What will you be using the table for? (e.g., Study session, Group project, Reading)"
                  />
                </div>
              </div>

              {selectedTable && (
                <div className="col-12">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h3 className="card-title h5 mb-3">Booking Summary</h3>
                      <dl className="row mb-0">
                        <dt className="col-sm-3">Table:</dt>
                        <dd className="col-sm-9">{getTableDetails(selectedTable)}</dd>
                        
                        <dt className="col-sm-3">Date:</dt>
                        <dd className="col-sm-9">
                          {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        </dd>
                        
                        {startTime && endTime && (
                          <>
                            <dt className="col-sm-3">Time:</dt>
                            <dd className="col-sm-9">{startTime} - {endTime}</dd>
                          </>
                        )}
                        
                        {purpose && (
                          <>
                            <dt className="col-sm-3">Purpose:</dt>
                            <dd className="col-sm-9">{purpose}</dd>
                          </>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              )}
          
              <div className="col-12">
                <hr className="my-4" />
                <div className="d-flex align-items-center justify-content-between">
                  <p className="text-muted mb-0"><span className="text-danger">*</span> Required fields</p>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || success}
                      className="btn btn-primary"
                    >
                      {submitting ? (
                        <span className="d-flex align-items-center">
                          <ArrowPathIcon className="me-2" style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                          Creating...
                        </span>
                      ) : (
                        'Book Table'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
