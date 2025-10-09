// screens/NewScanScreen.tsx

import { useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import EscalationForm from "../components/EscalationForm";
import ScannerView from "../components/ScannerView";
import VehicleForm from "../components/VehicleForm";
import { useEscalation } from "../hooks/useEscalation";
import { useEscalationSubmission } from "../hooks/useEscalationSubmission";
import { useFormSubmission } from "../hooks/useFormSubmission";
import { useVinValidation } from "../hooks/useVinValidation";
import { commonStyles } from "../styles/commonStyles";
import { Colors, CommonStyles } from "../utils/AssetManager";
import { CustomAlertProvider } from "../components/CustomAlert";

export default function NewScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showEscalationForm, setShowEscalationForm] = useState(false);
  const [selectedLot, setSelectedLot] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(1);
  const [noLotAlert, setNoLotAlert] = useState(false);
  const [vinFailedAlert, setVinFailedAlert] = useState(false);
  const [vinSuccessAlert, setVinSuccessAlert] = useState(false);
  const [vinEscalationSuccessAlert, setVinEscalationSuccessAlert] =
    useState(false);
  const [vinEscalationFailedAlert, setVinEscalationFailedAlert] =
    useState(false);
  const [vinAcceptSuccessAlert, setVinAcceptSuccessAlert] = useState(false);
  const [vinAcceptFailedAlert, setVinAcceptFailedAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const [alertMsg, setAlertMsg] = useState("");

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
  };

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>
          Please enable camera access to continue scanning.
        </Text>

        <TouchableOpacity onPress={gotoSettings} style={styles.button}>
          <Text style={styles.buttonContent}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Event handlers
  const handleBarcodeScanned = ({ type, data }) => {
    setScanning(false);
    setShowEscalationForm(false);
    setShowVehicleForm(false);
    handleCodeValidation(data);
  };

  const handleCodeValidation = async (code) => {
    const result = await vinValidation.validateCode(code);
    if (result.success) {
      setVinSuccessAlert(true);
    } else if (result.status !== 500) {
      if (
        result.error &&
        result.error.data &&
        result.error.data.lots &&
        Array.isArray(result.error.data.lots)
      ) {
        setVinFailedAlert(true);
        setAlertMsg(result.error.error.message);
      } else {
        setNoLotAlert(true);
        setAlertMsg(result.error.error.message);
      }
    } else {
      setErrorAlert(true);
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
      setVinAcceptSuccessAlert(true);
      //resetForm();
    } else {
      setVinAcceptFailedAlert(true);
    }
  };

  const handleEscalation = async () => {
    console.log(
      "Submitting form with lot:",
      selectedLot,
      "and keys:",
      selectedKeys
    );
    const result = await formEscalation.handleFormSubmit();
    if (result?.success) {
      setVinEscalationSuccessAlert(true);
      // resetForm();
    } else {
      setVinEscalationFailedAlert(true);
      setAlertMsg(result.error.message);
    }
  };

  const resetForm = () => {
    vinValidation.setVehicleInfo(null);
    setSelectedLot("");
    setSelectedKeys(1);
    setShowVehicleForm(false);
    setShowEscalationForm(false);
    setScanning(true);
    escalation.resetEscalation();
  };

  const handleManualEntry = (vin) => {
    setScanning(false);
    setShowEscalationForm(false);
    setShowVehicleForm(false);
    handleCodeValidation(vin);
  };

  return (
    <View style={commonStyles.container}>
      {scanning ? (
        <ScannerView
          onBarcodeScanned={handleBarcodeScanned}
          manualEntry={handleManualEntry}
        />
      ) : showVehicleForm ? (
        <VehicleForm
          vehicleInfo={vinValidation.vehicleInfo}
          availableLots={vinValidation.availableLots}
          selectedLot={selectedLot}
          selectedKeys={(val) => {
            setSelectedLot(val);
          }}
          isSubmitting={formSubmission.isSubmitting}
          onLotSelect={handleLotSelection}
          onKeysSelect={handleKeysSelection}
          onSubmit={handleFormSubmit}
          onStartOver={resetForm}
        />
      ) : showEscalationForm ? (
        <EscalationForm
          availableLots={vinValidation.availableLots}
          selectedLot={(val) => {
            setSelectedLot(val);
          }}
          selectedKeys={selectedKeys}
          isSubmitting={formEscalation.isSubmitting}
          onLotSelect={handleLotSelection}
          onKeysSelect={handleKeysSelection}
          onSubmit={handleEscalation}
          onStartOver={resetForm}
        />
      ) : (
        <View style={commonStyles.center}></View>
      )}
      {noLotAlert ? (
        <CustomAlertProvider
          title="Error"
          description={`${alertMsg}. No lots available for escalation.`}
          option1="Ok"
          handleOption1={() => {
            setNoLotAlert(false), setScanning(true);
          }}
        />
      ) : null}
      {vinFailedAlert ? (
        <CustomAlertProvider
          title="Vin validation failed"
          description={`${alertMsg}`}
          option1="VIN Escalation"
          handleOption1={() => {
            setVinFailedAlert(false), setShowEscalationForm(true);
            setShowVehicleForm(false);
            setScanning(false);
          }}
          option2="Start Over"
          handleOption2={() => {
            setVinFailedAlert(false),
              setScanning(true),
              setShowEscalationForm(false);
          }}
          option3="Cancel"
          handleOption3={() => {
            setVinFailedAlert(false), navigation.goBack();
          }}
        />
      ) : null}
      {vinSuccessAlert ? (
        <CustomAlertProvider
          title="Success"
          description={
            "VIN code validated successfully. Please the complete the form."
          }
          option1="Ok"
          handleOption1={() => {
            setVinSuccessAlert(false);
            setShowVehicleForm(true);
            setScanning(false);
            setShowEscalationForm(false);
          }}
        />
      ) : null}
      {errorAlert ? (
        <CustomAlertProvider
          title="Error"
          description={
            "An error occurred while validating the code.Please try again."
          }
          option1="Ok"
          handleOption1={() => {
            setErrorAlert(false), setScanning(true);
          }}
        />
      ) : null}

      {vinEscalationSuccessAlert ? (
        <CustomAlertProvider
          title="Success"
          description={"Vin escalation submitted successfully!"}
          option1="Ok"
          handleOption1={() => {
            setVinEscalationSuccessAlert(false);
          }}
        />
      ) : null}
      {vinEscalationFailedAlert ? (
        <CustomAlertProvider
          title="Error"
          description={alertMsg}
          option1="Ok"
          handleOption1={() => {
            setVinEscalationFailedAlert(false);
          }}
        />
      ) : null}

      {vinAcceptSuccessAlert ? (
        <CustomAlertProvider
          title="Success"
          description={"Vehicle information submitted successfully!!"}
          option1="Ok"
          handleOption1={() => {
            setVinAcceptSuccessAlert(false);
          }}
        />
      ) : null}
      {vinAcceptFailedAlert ? (
        <CustomAlertProvider
          title="Error"
          description={
            "An error occured while submitting vehicle information. Please try again."
          }
          option1="Ok"
          handleOption1={() => {
            setVinAcceptFailedAlert(false);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
  },
  textStyle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "System",
  },
  button: {
    ...CommonStyles.primaryButton,
    marginTop: 8,
  },
  buttonContent: {
    ...CommonStyles.primaryButtonText,
  },
});
