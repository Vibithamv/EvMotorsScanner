import { useEffect, useState } from "react";
import { Alert } from "react-native";
import NetworkService from "../services/NetworkService";

export const useVinValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [availableLots, setAvailableLots] = useState([]);

  const validateCode = async (code) => {
    setIsValidating(true);
    try {
      const response = await NetworkService.get("/api/vin/validate", {
        vin: code,
      });

      if (response.success) {
        console.log("VIN validation response:", response.data);
        // console.log('Lots array stored:', response.data.data.lots);

        // Extract and store lots array if present
        if (
          response.data &&
          response.data.data.lots &&
          Array.isArray(response.data.data.lots)
        ) {
          await NetworkService.storeData("lots", response.data.data.lots);
          setAvailableLots(response.data.data.lots);
          console.log("Lots array stored:", response.data.data.lots);
        }

        // Set vehicle information
        setVehicleInfo({
          vin: code,
          ...response.data,
        });

        Alert.alert(
          "Success",
          "Code validated successfully! Please complete the form below."
        );
        return { success: true, data: response.data };
      } else {
        if (
          response.error &&
          response.error.data &&
          response.error.data.lots &&
          Array.isArray(response.error.data.lots)
        ) {
          console.log("Lots array stored:", response.error.data.lots);
          await NetworkService.storeData("lots", response.error.data.lots);
          setAvailableLots(response.error.data.lots);
        }
        setVehicleInfo({ vin: code });
        Alert.alert(
          "Vin validation failed",
          response.error.error.message || "Invalid code. Please try again."
        );
        return {
          success: false,
          error: response.error,
          status: response.status,
        };
      }
    } catch (error) {
      console.error("Error validating code:", error);
      Alert.alert(
        "Error",
        "An error occurred while validating the code.Please try again."
      );
      return { success: false, error: error.message, status: 500 };
    } finally {
      // setIsValidating(false);
    }
  };

  const loadStoredLots = async () => {
    try {
      const storedLots = await NetworkService.getStoredData("lots");
      if (storedLots && Array.isArray(storedLots)) {
        setAvailableLots(storedLots);
      }
    } catch (error) {
      console.error("Error loading stored lots:", error);
    }
  };

  useEffect(() => {
    loadStoredLots();
  }, []);

  return {
    isValidating,
    vehicleInfo,
    availableLots,
    validateCode,
    setVehicleInfo,
    setAvailableLots,
  };
};
