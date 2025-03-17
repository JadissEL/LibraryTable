// This script tests the authentication flow in the browser

// Function to create a test user
async function createTestUser() {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };
  
  try {
    // Try to register the user
    const response = await fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // If user already exists, try to login
      if (data.message && data.message.includes('already exists')) {
        return loginTestUser();
      }
      throw new Error(data.message || 'Registration failed');
    }
    
    console.log('Registration successful!');
    return data.data;
  } catch (error) {
    console.error('Registration error:', error);
    // Try to login if registration fails
    return loginTestUser();
  }
}

// Function to login a test user
async function loginTestUser() {
  const loginData = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  try {
    const response = await fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }
    
    const data = await response.json();
    console.log('Login successful!');
    return data.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Function to test authentication
async function testAuth(token) {
  try {
    const response = await fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Authentication failed');
    }
    
    const data = await response.json();
    console.log('Authentication successful!');
    console.log('User profile:', data.data);
    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

// Function to test booking
async function testBooking(token) {
  try {
    // Get available tables
    const tablesResponse = await fetch('http://localhost:8080/api/tables/available', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!tablesResponse.ok) {
      const data = await tablesResponse.json();
      throw new Error(data.message || 'Failed to get tables');
    }
    
    const tablesData = await tablesResponse.json();
    const tables = tablesData.data;
    
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
    
    const bookingResponse = await fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!bookingResponse.ok) {
      const data = await bookingResponse.json();
      throw new Error(data.message || 'Booking failed');
    }
    
    const bookingResult = await bookingResponse.json();
    console.log('Booking successful!');
    console.log('Booking details:', bookingResult.data);
    return true;
  } catch (error) {
    console.error('Booking error:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Step 1: Register or login
    const userData = await createTestUser();
    console.log('User data:', userData);
    
    // Save token to localStorage
    localStorage.setItem('token', userData.token);
    
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
