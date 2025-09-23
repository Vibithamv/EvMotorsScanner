import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const EscalationPrompt = ({ 
  escalationPayload, 
  isEscalating, 
  onEscalation, 
  onCancel 
}) => {
  return (
    <View style={styles.center}>
      <View style={styles.escalationCard}>
        <Text style={styles.escalationTitle}>Submission Failed</Text>
        <Text style={styles.escalationMessage}>
          The vehicle information could not be submitted successfully. 
          Would you like to register an escalation for manual processing?
        </Text>
        
        <View style={styles.escalationDetails}>
          <Text style={styles.escalationDetailLabel}>VIN:</Text>
          <Text style={styles.escalationDetailValue}>{escalationPayload?.vin}</Text>
        </View>
        <View style={styles.escalationDetails}>
          <Text style={styles.escalationDetailLabel}>Lot:</Text>
          <Text style={styles.escalationDetailValue}>{escalationPayload?.lot}</Text>
        </View>
        <View style={styles.escalationDetails}>
          <Text style={styles.escalationDetailLabel}>Keys:</Text>
          <Text style={styles.escalationDetailValue}>{escalationPayload?.keys}</Text>
        </View>
        
        <View style={styles.escalationButtons}>
          <Button
            title={isEscalating ? "Registering Escalation..." : "Register Escalation"}
            onPress={onEscalation}
            disabled={isEscalating}
          />
          <Button
            title="Cancel"
            onPress={onCancel}
            disabled={isEscalating}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  escalationCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 25,
    margin: 20,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    maxWidth: 400,
  },
  escalationTitle: {
    fontSize: 24,
    color: "#ff6b6b",
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 15,
  },
  escalationMessage: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  escalationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  escalationDetailLabel: {
    fontSize: 16,
    color: "#ccc",
    fontWeight: '600',
  },
  escalationDetailValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: '500',
  },
  escalationButtons: {
    marginTop: 25,
    gap: 15,
  },
});

export default EscalationPrompt;
