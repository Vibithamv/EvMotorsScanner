// screens/NewScanScreen.tsx

import { useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, Button, Text, View, StyleSheet,TouchableOpacity, Linking } from "react-native";
import EscalationForm from "../components/EscalationForm";
import ScannerView from "../components/ScannerView";
import VehicleForm from "../components/VehicleForm";
import { useEscalation } from "../hooks/useEscalation";
import { useEscalationSubmission } from "../hooks/useEscalationSubmission";
import { useFormSubmission } from "../hooks/useFormSubmission";
import { useVinValidation } from "../hooks/useVinValidation";
import { commonStyles } from "../styles/commonStyles";
import { Colors, CommonStyles } from "../utils/AssetManager";

export default function NewScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showEscalationForm, setShowEscalationForm] = useState(false);
  const [selectedLot, setSelectedLot] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(1);

  // Custom hooks
  const vinValidation = useVinValidation();
  const escalation = useEscalation();
  const formSubmission = useFormSubmission(
    vinValidation.vehicleInfo,
    selectedLot,
    selectedKeys,
    escalation
  );
  const formEscalation = useEscalationSubmission(
    vinValidation.vehicleInfo,
    selectedLot,
    selectedKeys
  );

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  const gotoSettings = () => {
    Linking.openSettings().catch(() => {
    console.warn("Unable to open settings");
  });
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Please enable camera access to continue scanning.</Text>
       
         <TouchableOpacity
                onPress={gotoSettings}
                style={styles.button}
              >
                <Text style={styles.buttonContent}>
                 Continue
                </Text>
              </TouchableOpacity>
      </View>
    );
  }

  // Event handlers
  const handleBarcodeScanned = ({ type, data }) => {
    setScanning(false);
    setScannedData(`Type: ${type}\nData: ${data}`);
    handleCodeValidation(data);
  };

  const handleManualCodeSubmit = (manualCode) => {
    console.log("Manual code submitted:", manualCode);
    if (manualCode.trim()) {
      handleCodeValidation(manualCode.trim());
    } else {
      Alert.alert("Error", "Please enter a valid code");
    }
  };

  const handleCodeValidation = async (code) => {
    const result = await vinValidation.validateCode(code);
    if (result.success) {
      setShowVehicleForm(true);
      setScanning(false);
      setShowManualEntry(false);
      setShowEscalationForm(false);
    } else if (result.status !== 500) {
      if (
        result.error &&
        result.error.data &&
        result.error.data.lots &&
        Array.isArray(result.error.data.lots)
      ) {
        setShowEscalationForm(true);
        setShowVehicleForm(false);
        setScanning(false);
        setShowManualEntry(false);
      } else {
        Alert.alert("Error", "No lots available for escalation.");
        setScanning(true);
      }
    } else {
      setScanning(true);
    }
  };

  const handleLotSelection = (lot) => {
    setSelectedLot(lot);
  };

  const handleKeysSelection = (keys) => {
    setSelectedKeys(keys);
  };

  const handleFormSubmit = async () => {
    console.log(
      "Submitting form with lot:",
      selectedLot,
      "and keys:",
      selectedKeys
    );
    const result = await formSubmission.handleFormSubmit();
    if (result?.success) {
      resetForm();
    }
  };

  const handleEscalation = async () => {
    const result = await formEscalation.handleFormSubmit();
    if (result?.success) {
      resetForm();
    }
  };

  const resetForm = () => {
    vinValidation.setVehicleInfo(null);
    setSelectedLot("");
    setSelectedKeys(1);
    setShowVehicleForm(false);
    setScannedData(null);
    setScanning(true);
    escalation.resetEscalation();
  };

  return (
    <View style={commonStyles.container}>
      {scanning ? (
        <ScannerView
          onBarcodeScanned={handleBarcodeScanned}
          onManualEntry={() => {
            console.log("Manual Entry Clicked");
            handleCodeValidation("SN35X1A7B4C6D2E3G");
          }}
        />
      ) : showVehicleForm ? (
        <VehicleForm
          vehicleInfo={vinValidation.vehicleInfo}
          availableLots={vinValidation.availableLots}
          selectedLot={selectedLot}
          selectedKeys={selectedKeys}
          isSubmitting={formSubmission.isSubmitting}
          onLotSelect={handleLotSelection}
          onKeysSelect={handleKeysSelection}
          onSubmit={handleFormSubmit}
          onStartOver={resetForm}
        />
      ) : showEscalationForm ? (
        <EscalationForm
          availableLots={vinValidation.availableLots}
          selectedLot={selectedLot}
          selectedKeys={selectedKeys}
          isSubmitting={formEscalation.isSubmitting}
          onLotSelect={handleLotSelection}
          onKeysSelect={handleKeysSelection}
          onSubmit={handleEscalation}
          onStartOver={resetForm}
        />
      ) : (
        <View style={commonStyles.center}>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 16,
    color: Colors.text, 
    textAlign: "center",
    marginBottom: 20,
    fontFamily: 'System',
  },
  button: {
      ...CommonStyles.primaryButton,
      marginTop: 8,
    },
    buttonContent: {
      ...CommonStyles.primaryButtonText,
    },
});
