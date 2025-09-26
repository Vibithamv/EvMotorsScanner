import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../utils/AssetManager';

const KeysSelector = ({ selectedKeys, onKeysSelect }) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Number of Keys</Text>
      <View style={styles.keysContainer}>
        <TouchableOpacity
          style={[
            styles.keyOption,
            selectedKeys === 1 && styles.keyOptionSelected
          ]}
          onPress={() => onKeysSelect(1)}
        >
          <Text style={[
            styles.keyOptionText,
            selectedKeys === 1 && styles.keyOptionTextSelected
          ]}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.keyOption,
            selectedKeys === 2 && styles.keyOptionSelected
          ]}
          onPress={() => onKeysSelect(2)}
        >
          <Text style={[
            styles.keyOptionText,
            selectedKeys === 2 && styles.keyOptionTextSelected
          ]}>2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
    marginTop:10,
    alignSelf:'center',
    fontFamily: "InstrumentSans-Bold",
  },
  keysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  keyOption: {
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 8,
    padding: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  keyOptionSelected: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
  },
  keyOptionText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: 'bold',
  },
  keyOptionTextSelected: {
    color: "#fff",
  },
});

export default KeysSelector;
