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
import AuthService from "../services/AuthService";
import { CommonActions } from "@react-navigation/native";
import ChangeLotForm from "../components/TransferLotForm";
import { useLotTransferSubmission } from "../hooks/useLotTransferSubmission";

export default function NewScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showEscalationForm, setShowEscalationForm] = useState(false);
  const [showChangeLotForm, setShowChangeLotForm] = useState(false);
  const [selectedLot, setSelectedLot] = useState("");
  const [driverName, setSelectedDriver] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(1);
  const [noLotAlert, setNoLotAlert] = useState(false);
  const [vinFailedAlert, setVinFailedAlert] = useState(false);setReceivedVinFailedAlert
   const [receivedVinFailedAlert, setReceivedVinFailedAlert] = useState(false);
  const [vinSuccessAlert, setVinSuccessAlert] = useState(false);
  const [vinEscalationSuccessAlert, setVinEscalationSuccessAlert] =
    useState(false);
  const [vinEscalationFailedAlert, setVinEscalationFailedAlert] =
    useState(false);
  const [vinAcceptSuccessAlert, setVinAcceptSuccessAlert] = useState(false);
  const [vinAcceptFailedAlert, setVinAcceptFailedAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [expiredAlert, setExpiredAlert] = useState(false);
  const [transferLotSuccessAlert, setTransferLotSuccessAlert] = useState(false);
  const [vinStatus, setVinStatus] = useState('');
  const [alertMsg, setAlertMsg] = useState("");
  const [vin, setVin] = useState("");

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

   const formTransferLot = useLotTransferSubmission(
    vinValidation.vehicleInfo,
    selectedLot,
    driverName
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
  const handleBarcodeScanned = async ({ type, data }) => {
    setVin(data);
    setScanning(false);
    setShowEscalationForm(false);
    setShowVehicleForm(false);
    setShowChangeLotForm(false)
    if (await AuthService.isAccessTokenExpired()) {
      const result = await AuthService.refreshAccessToken();

      if (result.expired) {
        setExpiredAlert(true);
      } else if (result.success) {
        handleCodeValidation(data);
      } else {
        Alert.alert("Alert", result.error);
      }
    } else {
      handleCodeValidation(data);
    }
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
       
        if(result.error.data.vehicle.status === "received"){
          setVinStatus('received')
          setReceivedVinFailedAlert(true)
          setAlertMsg('This VIN is already received. You may continue with lot transfer.')
        }
        else if( result.error.data.vehicle.status === "transfer")
        {
          setVinStatus('transfer')
           setReceivedVinFailedAlert(true)
          setAlertMsg('This VIN is in transfer state. Acceptance is required to continue.')
        }
          else{
setVinFailedAlert(true);
        setAlertMsg(result.error.error.message);
        }
        
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
    if (await AuthService.isAccessTokenExpired()) {
      const response = await AuthService.refreshAccessToken();

      if (response.expired) {
        setExpiredAlert(true);
      } else if (response.success) {
        const result = await formSubmission.handleFormSubmit();
        if (result?.success) {
          setVinAcceptSuccessAlert(true);
          //resetForm();
        } else {
          setVinAcceptFailedAlert(true);
        }
      } else {
        Alert.alert("Alert", response.error);
        setScanning(true);
      }
    } else {
      const result = await formSubmission.handleFormSubmit();
      if (result?.success) {
        setVinAcceptSuccessAlert(true);
        //resetForm();
      } else {
        setVinAcceptFailedAlert(true);
      }
    }
  };

  const handleEscalation = async () => {
    if (await AuthService.isAccessTokenExpired()) {
      const response = await AuthService.refreshAccessToken();

      if (response.expired) {
        setExpiredAlert(true);
      } else if (response.success) {
        const result = await formEscalation.handleFormSubmit();
        if (result?.success) {
          setVinEscalationSuccessAlert(true);
          // resetForm();
        } else {
          setVinEscalationFailedAlert(true);
          setAlertMsg(result.error.message);
        }
      } else {
        Alert.alert("Alert", response.error);
        setScanning(true);
      }
    } else {
      const result = await formEscalation.handleFormSubmit();
      if (result?.success) {
        setVinEscalationSuccessAlert(true);
        // resetForm();
      } else {
        setVinEscalationFailedAlert(true);
        setAlertMsg(result.error.message);
      }
    }
  };

  const handleLotTranfer = async() => {
     if (await AuthService.isAccessTokenExpired()) {
      const response = await AuthService.refreshAccessToken();

      if (response.expired) {
        setExpiredAlert(true);
      } else if (response.success) {
        const result = await formTransferLot.handleFormSubmit();
        if (result?.success) {
           setTransferLotSuccessAlert(true)
           setAlertMsg('Lot transfer successfully Submitted')
        } else {
           setVinEscalationFailedAlert(true)
          setAlertMsg(result.error.message)
        }
      } else {
        Alert.alert("Alert", response.error);
        setScanning(true);
      }
    } else {
      const result = await formTransferLot.handleFormSubmit();
      if (result?.success) {
         setTransferLotSuccessAlert(true)
         setAlertMsg('Lot transfer successfully Submitted')
        } else {
            setVinEscalationFailedAlert(true)
          setAlertMsg(result.error.message)
        }
    }
  }

    const handleLotTranferAccept = async() => {
     if (await AuthService.isAccessTokenExpired()) {
      const response = await AuthService.refreshAccessToken();

      if (response.expired) {
        setExpiredAlert(true);
      } else if (response.success) {
      
           const lotAcceptResponse = await formTransferLot.handleFormAccept();
        if(lotAcceptResponse.success){
          setTransferLotSuccessAlert(true)
          setAlertMsg('Lot transfer accept successfully')
        }
        else{
          setVinEscalationFailedAlert(true)
          setAlertMsg(lotAcceptResponse.error.message)
        }
      } else {
        Alert.alert("Alert", response.error);
        setScanning(true);
      }
    } else {
        const lotAcceptResponse = await formTransferLot.handleFormAccept();
        if(lotAcceptResponse.success){
            setTransferLotSuccessAlert(true)
            setAlertMsg('Lot transfer accept successfully')
        }
        else{
           setVinEscalationFailedAlert(true)
          setAlertMsg(lotAcceptResponse.error.message)
        }
      
    }
  }


  const resetForm = () => {
    vinValidation.setVehicleInfo(null);
    setSelectedLot("");
    setSelectedKeys(1);
    setShowVehicleForm(false);
    setShowEscalationForm(false);
    setShowChangeLotForm(false)
    setScanning(true);
    escalation.resetEscalation();
  };

  const handleManualEntry = async (vin) => {
    setVin(vin);
    setScanning(false);
    setShowEscalationForm(false);
    setShowVehicleForm(false);
    setShowChangeLotForm(false)
    if (await AuthService.isAccessTokenExpired()) {
      const result = await AuthService.refreshAccessToken();

      if (result.expired) {
        setExpiredAlert(true);
      } else if (result.success) {
        handleCodeValidation(vin);
      } else {
        Alert.alert("Alert", result.error);
        setScanning(true);
      }
    } else {
      handleCodeValidation(vin);
    }
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
          vinNumber={vin}
          vehicleInfo={vinValidation.vehicleInfo}
          availableLots={vinValidation.availableLots}
          selectedLot={(val) => {
            setSelectedLot(val);
          }}
          selectedKeys={selectedKeys}
          isSubmitting={formSubmission.isSubmitting}
          onLotSelect={handleLotSelection}
          onKeysSelect={handleKeysSelection}
          onSubmit={handleFormSubmit}
          onStartOver={resetForm}
        />
      ) : showEscalationForm ? (
        <EscalationForm
          vinNumber={vin}
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
      ) : showChangeLotForm ?
      (
        <ChangeLotForm
          vinNumber={vin}
          availableLots={vinValidation.availableLots}
          driverName={(val) => setSelectedDriver(val)}
          selectedLot={(val) => {
            setSelectedLot(val);
          }}
          isSubmitting={formTransferLot.isSubmitting}
          onLotSelect={handleLotSelection}
          onSubmit={vinStatus==='received' ? handleLotTranfer : handleLotTranferAccept}
          onStartOver={resetForm}
          vinStatus={vinStatus}
        />
      ):
      (
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
            setVinFailedAlert(false), 
            setShowEscalationForm(true);
            setShowVehicleForm(false);
            setShowChangeLotForm(false)
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

      {receivedVinFailedAlert ? (
        <CustomAlertProvider
          title="Vin validation failed"
          description={`${alertMsg}`}
           option1= {vinStatus === 'received' ? "Lot Transfer" : 'Accept Lot Transfer'}
          handleOption1={() => {
            setReceivedVinFailedAlert(false), 
            setShowEscalationForm(false);
            setShowVehicleForm(false);
            setShowChangeLotForm(true)
            setScanning(false);
          }}
          option2="Start Over"
          handleOption2={() => {
            setReceivedVinFailedAlert(false),
              setScanning(true);
          }}
          option3="Cancel"
          handleOption3={() => {
            setReceivedVinFailedAlert(false), navigation.goBack();
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
            setShowChangeLotForm(false)
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
            setShowVehicleForm(false);
            setScanning(true);
            setShowEscalationForm(false);
            setShowChangeLotForm(false)
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
            setShowVehicleForm(false);
            setScanning(true);
            setShowEscalationForm(false);
            setShowChangeLotForm(false)
          }}
        />
      ) : null}

       {transferLotSuccessAlert ? (
        <CustomAlertProvider
          title="Success"
          description={"Lot transfer accept successfully"}
          option1="Ok"
          handleOption1={() => {
            setTransferLotSuccessAlert(false);
            setShowVehicleForm(false);
            setScanning(true);
            setShowEscalationForm(false);
            setShowChangeLotForm(false)
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

      {expiredAlert ? (
        <CustomAlertProvider
          title="Alert"
          description="Refresh Token is expired, Please Login again"
          option1="Ok"
          handleOption1={async () => {
            setExpiredAlert(false);
            await AuthService.logout();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }], // the only screen left in stack
              })
            );
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
