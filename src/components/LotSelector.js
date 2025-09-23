import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const LotSelector = ({ 
  availableLots, 
  selectedLot, 
  onLotSelect
}) => {
  const [inputValue, setInputValue] = useState(selectedLot || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLots, setFilteredLots] = useState(availableLots);

  // Update input value when selectedLot changes from parent
  useEffect(() => {
    setInputValue(selectedLot || '');
  }, [selectedLot]);

  // Filter lots based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableLots.filter(lot =>
        lot.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLots(filtered);
    } else {
      setFilteredLots(availableLots);
    }
  }, [inputValue, availableLots]);

  const handleInputChange = (text) => {
    setInputValue(text);
    setShowSuggestions(true);
    // Update parent with the typed value
    onLotSelect(text);
  };

  const handleLotSelect = (lot) => {
    setInputValue(lot);
    setShowSuggestions(false);
    onLotSelect(lot);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Select Lot</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputValue}
          onChangeText={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Type lot name or select from list"
          placeholderTextColor="#999"
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowSuggestions(!showSuggestions)}
        >
          <Text style={styles.dropdownArrow}>
            {showSuggestions ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showSuggestions && filteredLots.length > 0 && (
        <View style={styles.suggestionsList}>
          {filteredLots.map((lot, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleLotSelect(lot)}
            >
              <Text style={styles.suggestionText}>{lot}</Text>
            </TouchableOpacity>
          ))}
          {inputValue.trim() && !availableLots.some(lot => 
            lot.toLowerCase() === inputValue.toLowerCase()
          ) && (
            <TouchableOpacity
              style={[styles.suggestionItem, styles.newLotItem]}
              onPress={() => handleLotSelect(inputValue.trim())}
            >
              <Text style={[styles.suggestionText, styles.newLotText]}>
                Create new lot: "{inputValue.trim()}"
              </Text>
            </TouchableOpacity>
          )}
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
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    padding: 15,
    paddingRight: 10,
  },
  dropdownButton: {
    padding: 15,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownArrow: {
    color: "#ccc",
    fontSize: 12,
  },
  suggestionsList: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -1,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  suggestionText: {
    color: "#fff",
    fontSize: 16,
  },
  newLotItem: {
    backgroundColor: "#2a2a2a",
    borderBottomColor: "#444",
  },
  newLotText: {
    color: "#4CAF50",
    fontStyle: 'italic',
  },
});

export default LotSelector;
