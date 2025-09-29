import { StyleSheet, Text, View } from "react-native";

const VehicleInfoCard = ({ vehicleInfo }) => {
  if (!vehicleInfo) return null;

  return (
    <View style={styles.vehicleInfoCard}>
      <Text style={styles.cardTitle}>Vehicle Details</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>VIN:</Text>
        <Text style={styles.infoValue}>{vehicleInfo.vin}</Text>
      </View>
      {vehicleInfo.make && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Make:</Text>
          <Text style={styles.infoValue}>{vehicleInfo.make}</Text>
        </View>
      )}
      {vehicleInfo.model && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Model:</Text>
          <Text style={styles.infoValue}>{vehicleInfo.model}</Text>
        </View>
      )}
      {vehicleInfo.year && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Year:</Text>
          <Text style={styles.infoValue}>{vehicleInfo.year}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleInfoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: "#ccc",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});

export default VehicleInfoCard;
