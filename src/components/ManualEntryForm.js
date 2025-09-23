import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ManualEntryForm = ({
  manualCode,
  isValidating,
  onCodeChange,
  onSubmit,
  onBackToScanner
}) => {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Manual Code Entry</Text>
      <TextInput
        style={styles.input}
        value={manualCode}
        onChangeText={onCodeChange}
        placeholder="Enter code manually"
        placeholderTextColor="#999"
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="Validate Code" 
          onPress={onSubmit}
          disabled={isValidating || !manualCode.trim()}
        />
        <Button 
          title="Back to Scanner" 
          onPress={onBackToScanner}
          disabled={isValidating}
        />
      </View>
      {isValidating && <Text style={styles.loadingText}>Validating...</Text>}
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
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default ManualEntryForm;
