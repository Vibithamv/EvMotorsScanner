// Example usage of the VIN accept API endpoint
import NetworkService from '../src/services/NetworkService';

// Example payload structure for /api/mobile/vin/accept
const exampleVinAcceptPayload = {
  vin: "1HGBH41JXMN109186", // VIN of the scanned vehicle
  timestamp: "2024-01-15T10:30:00.000Z", // Current UTC timestamp
  lot: "Lot A", // Selected lot from the dropdown
  keys: 2 // Number of keys (1 or 2)
};

// Example function to submit vehicle acceptance
const submitVehicleAcceptance = async (vin, lot, keys) => {
  try {
    const payload = {
      vin: vin,
      timestamp: new Date().toISOString(), // Current UTC timestamp
      lot: lot,
      keys: keys
    };

    console.log('Submitting VIN accept payload:', payload);
    
    const response = await NetworkService.post('/api/mobile/vin/accept', payload);
    
    if (response.success) {
      console.log('Vehicle acceptance submitted successfully:', response.data);
      return {
        success: true,
        data: response.data
      };
    } else {
      console.error('Failed to submit vehicle acceptance:', response.error);
      return {
        success: false,
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error submitting vehicle acceptance:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Example function to load and use stored lots
const loadAndUseStoredLots = async () => {
  try {
    // Load lots from AsyncStorage
    const storedLots = await NetworkService.getStoredData('lots');
    
    if (storedLots && Array.isArray(storedLots)) {
      console.log('Available lots:', storedLots);
      
      // Example: Use the first lot for testing
      if (storedLots.length > 0) {
        const testVin = "1HGBH41JXMN109186";
        const testLot = storedLots[0];
        const testKeys = 2;
        
        const result = await submitVehicleAcceptance(testVin, testLot, testKeys);
        
        if (result.success) {
          console.log('Test submission successful');
        } else {
          console.error('Test submission failed:', result.error);
        }
      }
    } else {
      console.log('No lots found in storage');
    }
  } catch (error) {
    console.error('Error loading stored lots:', error);
  }
};

// Example function to validate VIN and then accept it
const validateAndAcceptVin = async (vin) => {
  try {
    // Step 1: Validate the VIN
    const validationResponse = await NetworkService.get('/api/vin/validate', { vin });
    
    if (validationResponse.success) {
      console.log('VIN validation successful:', validationResponse.data);
      
      // Step 2: Store lots if available
      if (validationResponse.data && validationResponse.data.lots) {
        await NetworkService.storeData('lots', validationResponse.data.lots);
        console.log('Lots stored:', validationResponse.data.lots);
      }
      
      // Step 3: Accept the VIN (example with first available lot)
      const lots = validationResponse.data.lots || [];
      if (lots.length > 0) {
        const acceptResult = await submitVehicleAcceptance(vin, lots[0], 1);
        
        if (acceptResult.success) {
          console.log('VIN accepted successfully');
          return { success: true, data: acceptResult.data };
        } else {
          console.error('VIN acceptance failed:', acceptResult.error);
          return { success: false, error: acceptResult.error };
        }
      } else {
        console.log('No lots available for acceptance');
        return { success: false, error: 'No lots available' };
      }
    } else {
      console.error('VIN validation failed:', validationResponse.error);
      return { success: false, error: validationResponse.error };
    }
  } catch (error) {
    console.error('Error in validate and accept flow:', error);
    return { success: false, error: error.message };
  }
};

export {
  exampleVinAcceptPayload,
  submitVehicleAcceptance,
  loadAndUseStoredLots,
  validateAndAcceptVin,
};
