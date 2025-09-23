import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LotSelector = ({ 
  availableLots, 
  selectedLot, 
  showLotDropdown, 
  onLotSelect, 
  onToggleDropdown 
}) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Select Lot</Text>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={onToggleDropdown}
      >
        <Text style={styles.dropdownText}>
          {selectedLot || 'Select a lot'}
        </Text>
        <Text style={styles.dropdownArrow}>{showLotDropdown ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      
      {showLotDropdown && (
        <View style={styles.dropdownList}>
          {availableLots.map((lot, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => onLotSelect(lot)}
            >
              <Text style={styles.dropdownItemText}>{lot}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownArrow: {
    color: "#ccc",
    fontSize: 12,
  },
  dropdownList: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -1,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LotSelector;
