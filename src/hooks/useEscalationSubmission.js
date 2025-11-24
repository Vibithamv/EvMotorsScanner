import { useState } from "react";
import { Alert } from "react-native";
import NetworkService from "../services/NetworkService";

export const useEscalationSubmission = (
  vehicleInfo,
  selectedLot,
  selectedKeys
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    console.log("Escalation submission initiated with:", {
      vehicleInfo,
      selectedLot,
      selectedKeys,
    });

    setIsSubmitting(true);
    try {
      const payload = {
        vin: vehicleInfo.vin,
        timestamp: new Date().toISOString(),
        assigned_lot: selectedLot,
        keys: selectedKeys,
      };

      console.log("Submitting escalation payload:", payload);

      const response = await NetworkService.post(
        "/api/vin/escalation",
        payload
      );

      if (response.success) {
        setIsSubmitting(false);
        return { success: true, data: response.data };
      } else {
         console.error("Vin escalation failed", response.error.error.message);
        setIsSubmitting(false);
        return { success: false, error: response.error.error };
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      return { success: false, error: 'An error occured. Please try again.' };
    }
  };

  return {
    isSubmitting,
    handleFormSubmit,
  };
};
