// screens/NewScanScreen.tsx

import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { useCameraPermissions } from "expo-camera";
import { useVinValidation } from '../hooks/useVinValidation';
import { useEscalation } from '../hooks/useEscalation';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useEscalationSubmission } from '../hooks/useEscalationSubmission';
import ScannerView from '../components/ScannerView';
import ManualEntryForm from '../components/ManualEntryForm';
import VehicleForm from '../components/VehicleForm';
import EscalationPrompt from '../components/EscalationPrompt';
import { commonStyles } from '../styles/commonStyles';
import EscalationForm from '../components/EscalationForm';


export default function NewScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showEscalationForm, setShowEscalationForm] = useState(false);
  const [selectedLot, setSelectedLot] = useState('');
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

  if (!permission.granted) {
    return (
      <View style={commonStyles.center}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
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
      Alert.alert('Error', 'Please enter a valid code');
    }
  };

  const handleCodeValidation = async (code) => {
    const result = await vinValidation.validateCode(code);
    // if (result.success) {
    //   setShowVehicleForm(true);
    //   setScanning(false);
    //   setShowManualEntry(false);
    //   setShowEscalationForm(false);
    // } else {
    //    setShowEscalationForm(true);
    //    setShowVehicleForm(false);
    //   setScanning(false);
    //   setShowManualEntry(false);
    //   setScannedData(`Code: ${code}\nStatus: Invalid\nError: ${result.error}`);
    // }
     if (result.success) {
      setShowVehicleForm(true);
      setScanning(false);
      setShowManualEntry(false);
      setShowEscalationForm(false);
    } else {
       setShowEscalationForm(true);
       setShowVehicleForm(false);
      setScanning(false);
      setShowManualEntry(false);
      //setScannedData(`Code: ${code}\nStatus: Invalid\nError: ${result.error}`);
    }
  };

  const handleLotSelection = (lot) => {
    setSelectedLot(lot);
  };

  const handleKeysSelection = (keys) => {
    setSelectedKeys(keys);
  };

  const handleFormSubmit = async () => {
    console.log("Submitting form with lot:", selectedLot, "and keys:", selectedKeys);
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
    setSelectedLot('');
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
            handleCodeValidation('SN35X1A7B4C6D2E3G');
           // setScanning(false);
           // setManualCode('SN35X1A7B4C6D2E3G');
          //  handleManualCodeSubmit('SN35X1A7B4C6D2E3G.');
           // setShowManualEntry(true);
          }}
         // isValidating={vinValidation.isValidating}
        />
      ) 
      // : showManualEntry ? (
      //   <ManualEntryForm
      //     manualCode={manualCode}
      //     isValidating={vinValidation.isValidating}
      //     onCodeChange={setManualCode}
      //     onSubmit={handleManualCodeSubmit}
      //     onBackToScanner={() => {
      //       setShowManualEntry(false);
      //       setScanning(true);
      //       setManualCode('');
      //       setScannedData(null);
      //     }}
      //   />
      // ) 
      : showVehicleForm ? (
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
          {/* <Text style={commonStyles.result}>{scannedData}</Text>
          <View style={commonStyles.buttonContainer}>
            <Button 
              title="Scan Again" 
              onPress={() => {
                setScanning(true);
                setScannedData(null);
              }}
              disabled={vinValidation.isValidating}
            />
            <Button 
              title="Manual Entry" 
              onPress={() => {
                setShowManualEntry(true);
                setScannedData(null);
              }}
              disabled={vinValidation.isValidating}
            />
          </View>
          {vinValidation.isValidating && <Text style={commonStyles.loadingText}>Validating...</Text>} */}
        </View>
      )}
    </View>
  );
}
