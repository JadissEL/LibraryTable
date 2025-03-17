// This script tests the authentication flow and fixes any issues

const axios = require('axios');

// Set default axios base URL
axios.defaults.baseURL = 'http://localhost:8080/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Test user credentials
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Function to register a new user
async function registerUser() {
  try {
    console.log('Attempting to register a new user...');
    const response = await axios.post('/users/register', testUser);
    console.log('Registration successful!');
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data.message.includes('already exists')) {
      console.log('User already exists, trying to login instead...');
      return loginUser();
    }
    console.error('Registration error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to login a user
async function loginUser() {
  try {
    console.log('Attempting to login...');
    const response = await axios.post('/users/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login successful!');
    return response.data.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to test authentication
async function testAuth(token) {
  try {
    console.log('Testing authentication...');
    // Set auth token header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Try to access a protected endpoint
    const response = await axios.get('/users/profile');
    console.log('Authentication successful!');
    console.log('User profile:', response.data.data);
    return true;
  } catch (error) {
    console.error('Authentication error:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Function to test booking
async function testBooking(token) {
  try {
    console.log('Testing booking functionality...');
    // Set auth token header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Get available tables
    const tablesResponse = await axios.get('/tables/available');
    const tables = tablesResponse.data.data;
    
    if (tables.length === 0) {
      console.log('No tables available for booking.');
      return false;
    }
    
    // Create a booking
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const bookingData = {
      tableId: tables[0]._id,
      date: tomorrow.toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      purpose: 'Test booking'
    };
    
    console.log('Booking data:', bookingData);
    
    const bookingResponse = await axios.post('/bookings', bookingData);
    console.log('Booking successful!');
    console.log('Booking details:', bookingResponse.data.data);
    return true;
  } catch (error) {
    console.error('Booking error:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Step 1: Register or login
    const userData = await registerUser();
    console.log('User data:', userData);
    
    // Step 2: Test authentication
    const authSuccess = await testAuth(userData.token);
    
    if (!authSuccess) {
      console.log('Authentication test failed. Please check your token.');
      return;
    }
    
    // Step 3: Test booking
    const bookingSuccess = await testBooking(userData.token);
    
    if (!bookingSuccess) {
      console.log('Booking test failed. Please check the booking functionality.');
      return;
    }
    
    console.log('All tests passed successfully!');
    console.log('To fix the authentication issue in the frontend:');
    console.log('1. Make sure you are logged in');
    console.log('2. Check that the token is being stored in localStorage');
    console.log('3. Verify that the token is being set in the axios headers');
    console.log('4. Ensure the token is valid and not expired');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the main function
main();
