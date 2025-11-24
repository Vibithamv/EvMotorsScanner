import { useState } from "react";
import { Alert } from "react-native";
import NetworkService from "../services/NetworkService";

export const useEscalation = () => {
  const [showEscalationPrompt, setShowEscalationPrompt] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalationPayload, setEscalationPayload] = useState(null);

  const promptForEscalation = () => {
    Alert.alert(
      "Submission Failed",
      "The vehicle information could not be submitted successfully. Would you like to register an escalation for manual processing?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            setEscalationPayload(null);
          },
        },
        {
          text: "Register Escalation",
          onPress: () => {
            setShowEscalationPrompt(true);
          },
        },
      ]
    );
  };

  const handleEscalation = async () => {
    if (!escalationPayload) {
      Alert.alert("Error", "No escalation data available");
      return;
    }

    setIsEscalating(true);
    try {
      console.log("Submitting escalation payload:", escalationPayload);

      const response = await NetworkService.post(
        "/api/vin/escalation",
        escalationPayload
      );

      if (response.success) {
        Alert.alert("Success", "Escalation registered successfully!", [
          {
            text: "OK",
            onPress: () => {
              resetEscalation();
            },
          },
        ]);
        return { success: true, data: response.data };
      } else {
        Alert.alert(
          "Error",
          "Failed to register escalation. Please contact support."
        );
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Error creating escalation:", error);
      Alert.alert(
        "Error",
        "An error occurred while registering escalation. Please contact support."
      );
      return { success: false, error: error.message };
    } finally {
      setIsEscalating(false);
      setShowEscalationPrompt(false);
      setEscalationPayload(null);
    }
  };

  const handleEscalationCancel = () => {
    setShowEscalationPrompt(false);
    setEscalationPayload(null);
  };

  const resetEscalation = () => {
    setShowEscalationPrompt(false);
    setEscalationPayload(null);
    setIsEscalating(false);
  };

  return {
    showEscalationPrompt,
    isEscalating,
    escalationPayload,
    promptForEscalation,
    handleEscalation,
    handleEscalationCancel,
    setEscalationPayload,
    resetEscalation,
  };
};
