import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet } from 'react-native';
import VehicleInfoCard from './VehicleInfoCard';
import LotSelector from './LotSelector';
import KeysSelector from './KeysSelector';

const VehicleForm = ({
  vehicleInfo,
  availableLots,
  selectedLot,
  selectedKeys,
  isSubmitting,
  onLotSelect,
  onKeysSelect,
  onSubmit,
  onStartOver
}) => {
  return (
    <ScrollView style={styles.formContainer}>
      <View style={styles.formContent}>
        <Text style={styles.formTitle}>Vehicle Information</Text>
        
        <VehicleInfoCard vehicleInfo={vehicleInfo} />

        <LotSelector
          availableLots={availableLots}
          selectedLot={selectedLot}
          onLotSelect={onLotSelect}
        />

        <KeysSelector
          selectedKeys={selectedKeys}
          onKeysSelect={onKeysSelect}
        />

        <View style={styles.submitContainer}>
          <Button
            title={isSubmitting ? "Submitting..." : "Submit Vehicle Info"}
            onPress={onSubmit}
            disabled={isSubmitting || !selectedLot}
          />
          <Button
            title="Start Over"
            onPress={onStartOver}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  formContent: {
    padding: 20,
  },
  formTitle: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    fontWeight: 'bold',
    marginBottom: 30,
  },
  submitContainer: {
    marginTop: 30,
    gap: 15,
  },
});

export default VehicleForm;
