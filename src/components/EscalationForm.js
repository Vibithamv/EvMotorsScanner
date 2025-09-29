import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Colors, CommonStyles } from "../utils/AssetManager";
import KeysSelector from "./KeysSelector";
import LotSelector from "./LotSelector";

const EscalationForm = ({
  availableLots,
  selectedLot,
  selectedKeys,
  isSubmitting,
  onLotSelect,
  onKeysSelect,
  onSubmit,
  onStartOver,
}) => {
  return (
    <View style={CommonStyles.container}>
      <Text style={styles.formTitle}>Vin Escalation</Text>

      {/* <VehicleInfoCard vehicleInfo={vehicleInfo} /> */}

      <LotSelector
        availableLots={availableLots}
        selectedLot={selectedLot}
        onLotSelect={onLotSelect}
      />

      <KeysSelector selectedKeys={selectedKeys} onKeysSelect={onKeysSelect} />

      <View style={styles.submitContainer}>
        <TouchableOpacity
          onPress={onSubmit}
          style={styles.button}
          disabled={isSubmitting || !selectedLot}
        >
          <Text style={styles.buttonContent}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStartOver}
          disabled={isSubmitting}
          style={[styles.button]}
        >
          <Text style={styles.buttonContent}>Start Over</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  button: {
    ...CommonStyles.primaryButton,
    marginTop: 8,
  },
  buttonContent: {
    ...CommonStyles.primaryButtonText,
  },
  formContent: {
    padding: 20,
  },
  formTitle: {
    fontSize: 28,
    color: Colors.secondary,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
  },
  submitContainer: {
    marginTop: 30,
    gap: 15,
  },
});

export default EscalationForm;
