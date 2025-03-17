const axios = require('axios');

// Base URL for API
const baseURL = 'http://localhost:40001/api';

// Add debug logging for requests
axios.interceptors.request.use(request => {
  console.log('Request URL:', request.url);
  console.log('Request Method:', request.method);
  console.log('Request Headers:', request.headers);
  if (request.data) {
    console.log('Request Data:', request.data);
  }
  return request;
});

// Add debug logging for responses
axios.interceptors.response.use(
  response => {
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Data:', response.data);
    return response;
  },
  error => {
    console.log('Error Status:', error.response?.status);
    console.log('Error Data:', error.response?.data);
    return Promise.reject(error);
  }
);

// Test login
async function testLogin() {
  try {
    console.log('Testing user login...');
    const loginResponse = await axios.post(`${baseURL}/users/login`, {
      email: 'elantaki.dijadiss@gmail.com',
      password: 'Password123!'
    });
    
    console.log('Login successful!');
    console.log('User data:', loginResponse.data.data.user);
    console.log('Token:', loginResponse.data.data.token);
    
    // Return the token for further testing
    return loginResponse.data.data.token;
    
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

// Test getting tables with authentication
async function testGetTables(token) {
  try {
    console.log('\nTesting get tables endpoint...');
    const tablesResponse = await axios.get(`${baseURL}/tables`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('Tables retrieved successfully!');
    console.log('Tables:', tablesResponse.data.data);
    
  } catch (error) {
    console.error('Failed to get tables:', error.response ? error.response.data : error.message);
  }
}

// Test creating a booking
async function testCreateBooking(token) {
  try {
    console.log('\nTesting create booking endpoint...');
    
    // Get table IDs first
    const tablesResponse = await axios.get(`${baseURL}/tables`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!tablesResponse.data.data || !tablesResponse.data.data.length) {
      console.error('No tables available for booking');
      return;
    }
    
    // Use the first table for booking
    const tableId = tablesResponse.data.data[0]._id;
    
    // Create a booking for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // 2:00 PM
    
    const bookingData = {
      tableId,
      startTime: tomorrow.toISOString(),
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      purpose: 'Study session'
    };
    
    const bookingResponse = await axios.post(`${baseURL}/bookings`, bookingData, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('Booking created successfully!');
    console.log('Booking:', bookingResponse.data.data);
    
    return bookingResponse.data.data._id;
    
  } catch (error) {
    console.error('Failed to create booking:', error.response ? error.response.data : error.message);
  }
}

// Run all tests
async function runTests() {
  const token = await testLogin();
  await testGetTables(token);
  const bookingId = await testCreateBooking(token);
  
  console.log('\nAll tests completed!');
}

// Execute tests
runTests();
