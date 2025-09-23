// screens/NewScanScreen.tsx

import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { useCameraPermissions } from "expo-camera";
import { useVinValidation } from '../hooks/useVinValidation';
import { useEscalation } from '../hooks/useEscalation';
import { useFormSubmission } from '../hooks/useFormSubmission';
import ScannerView from '../components/ScannerView';
import ManualEntryForm from '../components/ManualEntryForm';
import VehicleForm from '../components/VehicleForm';
import EscalationPrompt from '../components/EscalationPrompt';
import { commonStyles } from '../styles/commonStyles';


export default function NewScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [selectedLot, setSelectedLot] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(1);
  const [showLotDropdown, setShowLotDropdown] = useState(false);

  // Custom hooks
  const vinValidation = useVinValidation();
  const escalation = useEscalation();
  const formSubmission = useFormSubmission(
    vinValidation.vehicleInfo, 
    selectedLot, 
    selectedKeys, 
    escalation
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
      <View style={styles.center}>
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

  const handleManualCodeSubmit = () => {
    if (manualCode.trim()) {
      handleCodeValidation(manualCode.trim());
    } else {
      Alert.alert('Error', 'Please enter a valid code');
    }
  };

  const handleCodeValidation = async (code) => {
    const result = await vinValidation.validateCode(code);
    if (result.success) {
      setShowVehicleForm(true);
      setScanning(false);
      setShowManualEntry(false);
    } else {
      setScannedData(`Code: ${code}\nStatus: Invalid\nError: ${result.error}`);
    }
  };

  const handleLotSelection = (lot) => {
    setSelectedLot(lot);
    setShowLotDropdown(false);
  };

  const handleKeysSelection = (keys) => {
    setSelectedKeys(keys);
  };

  const handleFormSubmit = async () => {
    const result = await formSubmission.handleFormSubmit();
    if (result?.success) {
      resetForm();
    }
  };

  const handleEscalation = async () => {
    const result = await escalation.handleEscalation();
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
            setScanning(false);
            setShowManualEntry(true);
          }}
          isValidating={vinValidation.isValidating}
        />
      ) : showManualEntry ? (
        <ManualEntryForm
          manualCode={manualCode}
          isValidating={vinValidation.isValidating}
          onCodeChange={setManualCode}
          onSubmit={handleManualCodeSubmit}
          onBackToScanner={() => {
            setShowManualEntry(false);
            setScanning(true);
            setManualCode('');
            setScannedData(null);
          }}
        />
      ) : showVehicleForm ? (
        <VehicleForm
          vehicleInfo={vinValidation.vehicleInfo}
          availableLots={vinValidation.availableLots}
          selectedLot={selectedLot}
          selectedKeys={selectedKeys}
          showLotDropdown={showLotDropdown}
          isSubmitting={formSubmission.isSubmitting}
          onLotSelect={handleLotSelection}
          onToggleDropdown={() => setShowLotDropdown(!showLotDropdown)}
          onKeysSelect={handleKeysSelection}
          onSubmit={handleFormSubmit}
          onStartOver={resetForm}
        />
      ) : escalation.showEscalationPrompt ? (
        <EscalationPrompt
          escalationPayload={escalation.escalationPayload}
          isEscalating={escalation.isEscalating}
          onEscalation={handleEscalation}
          onCancel={escalation.handleEscalationCancel}
        />
      ) : (
        <View style={commonStyles.center}>
          <Text style={commonStyles.result}>{scannedData}</Text>
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
          {vinValidation.isValidating && <Text style={commonStyles.loadingText}>Validating...</Text>}
        </View>
      )}
    </View>
  );
}
