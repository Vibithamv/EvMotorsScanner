import { useState } from "react";
import { Alert } from "react-native";
import NetworkService from "../services/NetworkService";

export const useLotTransferSubmission = (
  vehicleInfo,
  selectedLot,
  driverName
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    console.log("Lot transfer submission initiated with:", {
      vehicleInfo,
      selectedLot,
      driverName,
    });

    setIsSubmitting(true);
    try {
      const payload = {
        vin: vehicleInfo.vin,
        newLot: selectedLot,
        driverName: driverName,
      };

      const response = await NetworkService.post(
        "/api/vin-lot-transfer/initiate",
        payload
      );

      if (response.success) {
        setIsSubmitting(false);
       console.log("transfer lot success:", response);
        return { success: true, data: response.data };
      } else {
         console.error("Lot transfer failed", response.error.error.message);
        setIsSubmitting(false);
        return { success: false, error: response.error.error };
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      return { success: false, error: 'An error occured. Please try again.' };
    }
  };

  const handleFormAccept = async () => {
    console.log("Lot transfer Accept with:", {
      vehicleInfo,
      selectedLot
    });

    setIsSubmitting(true);
    try {
      const payload = {
        vin: vehicleInfo.vin,
        lot: selectedLot
      };

      console.log("Submitting transfer lot accept payload:", payload);

      const response = await NetworkService.post(
        "/api/vin-lot-transfer/accept",
        payload
      );

      if (response.success) {
        setIsSubmitting(false);
        return { success: true, data: response.data };
      } else {
         console.error("Lot transfer accept failed", response.error.error.message);
        setIsSubmitting(false);
        return { success: false, error: response.error.error };
      }
    } catch (error) {
      console.error("Error submitting Lot tranfer accept:", error);
      setIsSubmitting(false);
      return { success: false, error: 'An error occured. Please try again.' };
    }
  };

  

  return {
    isSubmitting,
    handleFormSubmit,
    handleFormAccept
  };
};
