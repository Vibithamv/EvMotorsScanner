import { useState } from "react";
import { Alert } from "react-native";
import NetworkService from "../services/NetworkService";

export const useFormSubmission = (
  vehicleInfo,
  selectedLot,
  selectedKeys,
  escalationHook
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    console.log("Form submission initiated with:", {
      vehicleInfo,
      selectedLot,
      selectedKeys,
    });
    if (!selectedLot) {
      Alert.alert("Error", "Please select a lot");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vin: vehicleInfo.vin,
        timestamp_utc: new Date().toISOString(),
        assigned_lot_name: selectedLot,
        number_of_keys: selectedKeys,
      };

      console.log("Submitting VIN accept payload:", payload);

      const response = await NetworkService.post(
        "/api/mobile/vin/accept",
        payload
      );

      if (response.success) {
        setIsSubmitting(false);
        Alert.alert("Success", "Vehicle information submitted successfully!", [
          {
            text: "OK",
            onPress: () => {
              return { success: true, data: response.data };
            },
          },
        ]);
        return { success: true, data: response.data };
      } else {
        setIsSubmitting(false);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      return { success: false, error: error.message };
    }
  };

  return {
    isSubmitting,
    handleFormSubmit,
  };
};
