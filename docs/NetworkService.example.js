// Example usage of NetworkService
import NetworkService from '../src/services/NetworkService';

// Example 1: Making a GET request
const fetchUserData = async (userId) => {
  const response = await NetworkService.get(`/api/users/${userId}`);
  
  if (response.success) {
    console.log('User data:', response.data);
    return response.data;
  } else {
    console.error('Failed to fetch user:', response.error);
    return null;
  }
};

// Example 2: Making a POST request
const createUser = async (userData) => {
  const response = await NetworkService.post('/api/users', userData);
  
  if (response.success) {
    console.log('User created:', response.data);
    return response.data;
  } else {
    console.error('Failed to create user:', response.error);
    return null;
  }
};

// Example 3: Using stored data (lots array from VIN validation)
const useStoredLots = async () => {
  const lots = await NetworkService.getStoredData('lots');
  
  if (lots && Array.isArray(lots)) {
    console.log('Retrieved lots:', lots);
    // Use the lots data for subsequent API calls
    return lots;
  } else {
    console.log('No lots data found');
    return [];
  }
};

// Example 4: Making a request with lots data
const processLots = async () => {
  const lots = await NetworkService.getStoredData('lots');
  
  if (lots && lots.length > 0) {
    const response = await NetworkService.post('/api/process-lots', { lots });
    
    if (response.success) {
      console.log('Lots processed successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to process lots:', response.error);
      return null;
    }
  } else {
    console.log('No lots to process');
    return null;
  }
};

// Example 5: Switching environments (useful for testing)
const switchToProduction = () => {
  NetworkService.setEnvironment('prod');
  console.log('Switched to production environment');
};

// Example 6: Error handling with try-catch
const safeApiCall = async () => {
  try {
    const response = await NetworkService.get('/api/some-endpoint');
    
    if (response.success) {
      // Handle success
      return response.data;
    } else {
      // Handle API error
      throw new Error(response.error);
    }
  } catch (error) {
    // Handle network or other errors
    console.error('API call failed:', error.message);
    return null;
  }
};

export {
  fetchUserData,
  createUser,
  useStoredLots,
  processLots,
  switchToProduction,
  safeApiCall,
};
