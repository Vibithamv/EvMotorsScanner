import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

import { Colors, CommonStyles } from "../utils/AssetManager";
import KeysSelector from "./KeysSelector";
import LotSelector from "./LotSelector";
import { TextInput } from "react-native-paper";

const ChangeLotForm = ({
  vinNumber,
  availableLots,
  selectedLot,
  isSubmitting,
  onLotSelect,
  driverName,
  onSubmit,
  onStartOver,
  vinStatus
}) => {
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedLotVal, setSelectedLotVal] = useState("");
     const [driverNameVal, setDriverNameVal] = useState("");
  return (
    <View style={CommonStyles.container}>
      <Text style={styles.formTitle}>VIN</Text>
      <Text style={{fontSize:18,color:Colors.text,textAlign:'center',marginBottom:40}}>{vinNumber}</Text>
      <Text style={[styles.formTitle,{marginBottom:20}] }>{vinStatus ==='received' ? 'Lot Transfer' : 'Accept Lot transfer' }</Text>

      <LotSelector
        availableLots={availableLots}
        selectedLot={(val) => {selectedLot(val)}}
        onLotSelect={(val) => {
            onLotSelect(val),
            setError(false),
            setSelectedLotVal(val);
        }}
      />

      <View style={{height:15}}>

      </View>

{vinStatus==='received' ?
       <TextInput
       placeholder="Enter Driver name"
        value={driverNameVal}
        onChangeText={(val)=>{setDriverNameVal(val)
              driverName(val)
        }}
        keyboardType="text"
        autoCapitalize="none"
        style={{ height: 44,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: Colors.text,}}
        textColor={Colors.black}
        returnKeyType="next" // shows "Next" on the keyboard
        theme={{ colors: { primary: Colors.primary, accent: Colors.primary } }}
      /> : null }

        {isError ? (
        <Text style={{ color: Colors.error, marginTop:10, textAlign:'center' }}>
          {errorMsg}
        </Text>
      ) : null}


      <View style={styles.submitContainer}>
        <TouchableOpacity
          onPress={() => {
            if (!selectedLotVal) {
              setError(true);
              setErrorMsg('Please select a Lot')
            } else if(vinStatus === 'received' && driverNameVal === ''){
                 setError(true);
              setErrorMsg('Please enter Driver name')
            }
            else {
              onSubmit();
            }
          }}
          style={styles.button}
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
    marginBottom: 10,
  },
  submitContainer: {
    marginTop: 30,
    gap: 15,
  },
});

export default ChangeLotForm;
