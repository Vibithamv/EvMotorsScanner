import { useState } from 'react';
import { Alert } from 'react-native';
import NetworkService from '../services/NetworkService';

export const useEscalationSubmission = (vehicleInfo, selectedLot, selectedKeys) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    console.log("Escalation submission initiated with:", { vehicleInfo, selectedLot, selectedKeys });
    if (!selectedLot) {
      Alert.alert('Error', 'Please select a lot');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vin: vehicleInfo.vin,
        timestamp: new Date().toISOString(),
        assigned_lot: selectedLot,
        keys: selectedKeys
      };

      console.log('Submitting escalation payload:', payload);
      
      const response = await NetworkService.post('/api/vin/escalation', payload);
      
      if (response.success) {
         setIsSubmitting(false);
        Alert.alert('Success', 'Vin escalation submitted successfully!', [
          {
            text: 'OK',
            onPress: () => {
              return { success: true, data: response.data };
            }
          }
        ]);
        return { success: true, data: response.data };
      } else {
        setIsSubmitting(false);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      return { success: false, error: error.message };
    }
  };

  return {
    isSubmitting,
    handleFormSubmit
  };
};
