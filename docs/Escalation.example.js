// Example usage of the VIN escalation API endpoint
import NetworkService from '../src/services/NetworkService';

// Example payload structure for /api/vin/escalation
const exampleEscalationPayload = {
  vin: "1HGBH41JXMN109186", // VIN of the vehicle
  timestamp: "2024-01-15T10:30:00.000Z", // Current UTC timestamp
  lot: "Lot A", // Selected lot
  keys: 2 // Number of keys (1 or 2)
};

// Example function to create an escalation
const createEscalation = async (vin, lot, keys) => {
  try {
    const payload = {
      vin: vin,
      timestamp: new Date().toISOString(), // Current UTC timestamp
      lot: lot,
      keys: keys
    };

    console.log('Creating escalation with payload:', payload);
    
    const response = await NetworkService.post('/api/vin/escalation', payload);
    
    if (response.success) {
      console.log('Escalation created successfully:', response.data);
      return {
        success: true,
        data: response.data
      };
    } else {
      console.error('Failed to create escalation:', response.error);
      return {
        success: false,
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error creating escalation:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Example function to handle the complete flow: accept -> prompt for escalation on failure
const handleVinAcceptanceWithEscalationPrompt = async (vin, lot, keys) => {
  try {
    // Step 1: Try to accept the VIN
    const acceptPayload = {
      vin: vin,
      timestamp: new Date().toISOString(),
      lot: lot,
      keys: keys
    };

    console.log('Attempting VIN acceptance:', acceptPayload);
    
    const acceptResponse = await NetworkService.post('/api/mobile/vin/accept', acceptPayload);
    
    if (acceptResponse.success) {
      console.log('VIN accepted successfully:', acceptResponse.data);
      return {
        success: true,
        method: 'accept',
        data: acceptResponse.data
      };
    } else {
      console.log('VIN acceptance failed, prompting user for escalation...');
      
      // Step 2: Prompt user to register escalation (in real app, this would show an Alert)
      const userWantsEscalation = true; // This would be determined by user's choice in the Alert
      
      if (userWantsEscalation) {
        console.log('User chose to register escalation');
        const escalationResult = await createEscalation(vin, lot, keys);
        
        if (escalationResult.success) {
          console.log('Escalation registered successfully');
          return {
            success: true,
            method: 'escalation',
            data: escalationResult.data
          };
        } else {
          console.error('Escalation registration failed');
          return {
            success: false,
            error: 'Escalation registration failed',
            escalationError: escalationResult.error
          };
        }
      } else {
        console.log('User chose not to register escalation');
        return {
          success: false,
          error: 'User declined escalation',
          method: 'user_declined'
        };
      }
    }
  } catch (error) {
    console.error('Error in VIN acceptance flow:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Example function to simulate the UI flow
const simulateUIFlow = async () => {
  const testVin = "1HGBH41JXMN109186";
  const testLot = "Lot A";
  const testKeys = 2;

  console.log('=== Simulating VIN Acceptance Flow ===');
  
  // Simulate successful acceptance
  console.log('\n1. Testing successful acceptance:');
  const successResult = await handleVinAcceptanceWithEscalation(testVin, testLot, testKeys);
  console.log('Result:', successResult);

  // Simulate failed acceptance (would trigger escalation in real app)
  console.log('\n2. Testing escalation scenario:');
  const escalationResult = await createEscalation(testVin, testLot, testKeys);
  console.log('Escalation result:', escalationResult);
};

// Example function to handle different error scenarios
const handleErrorScenarios = async () => {
  const testVin = "1HGBH41JXMN109186";
  const testLot = "Lot A";
  const testKeys = 2;

  console.log('=== Testing Error Scenarios ===');

  // Scenario 1: Network error during acceptance
  try {
    // This would simulate a network error
    throw new Error('Network timeout');
  } catch (error) {
    console.log('Network error scenario - would trigger escalation');
    const escalationResult = await createEscalation(testVin, testLot, testKeys);
    console.log('Escalation created:', escalationResult.success);
  }

  // Scenario 2: API error during acceptance
  try {
    // This would simulate an API error response
    const mockErrorResponse = {
      success: false,
      error: 'Invalid lot selection'
    };
    
    if (!mockErrorResponse.success) {
      console.log('API error scenario - would trigger escalation');
      const escalationResult = await createEscalation(testVin, testLot, testKeys);
      console.log('Escalation created:', escalationResult.success);
    }
  } catch (error) {
    console.error('Error in error scenario testing:', error);
  }
};

export {
  exampleEscalationPayload,
  createEscalation,
  handleVinAcceptanceWithEscalationPrompt,
  simulateUIFlow,
  handleErrorScenarios,
};
