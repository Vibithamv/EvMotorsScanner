import { useState } from 'react';
import { Alert } from 'react-native';
import NetworkService from '../services/NetworkService';

export const useFormSubmission = (vehicleInfo, selectedLot, selectedKeys, escalationHook) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    if (!selectedLot) {
      Alert.alert('Error', 'Please select a lot');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vin: vehicleInfo.vin,
        timestamp_utc: new Date().toISOString(),
        assigned_lot_name: selectedLot,
        number_of_keys: selectedKeys
      };

      console.log('Submitting VIN accept payload:', payload);
      
      const response = await NetworkService.post('/api/mobile/vin/accept', payload);
      
      if (response.success) {
        Alert.alert('Success', 'Vehicle information submitted successfully!', [
          {
            text: 'OK',
            onPress: () => {
              return { success: true, data: response.data };
            }
          }
        ]);
        return { success: true, data: response.data };
      } else {
        // Store payload for escalation and prompt user
        escalationHook.setEscalationPayload(payload);
        escalationHook.promptForEscalation();
        setIsSubmitting(false);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Store payload for escalation and prompt user
      escalationHook.setEscalationPayload({
        vin: vehicleInfo.vin,
        timestamp: new Date().toISOString(),
        lot: selectedLot,
        keys: selectedKeys
      });
      escalationHook.promptForEscalation();
      setIsSubmitting(false);
      return { success: false, error: error.message };
    }
  };

  return {
    isSubmitting,
    handleFormSubmit
  };
};
