import { CameraView } from "expo-camera";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Colors, FontConfig } from "../utils/AssetManager";
import React, { useState } from "react";

const ScannerView = ({ onBarcodeScanned , manualEntry}) => {
  const [vin, setVin] = useState("");
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter VIN"
        placeholderTextColor="#6379B5"
        value={vin}
        onChangeText={setVin}
        autoCapitalize="characters"
        textAlign="center" 
      />
      {error? <Text style={[styles.regularTextStyle, { color: Colors.error,marginTop: 10 }]}>
          {errorMsg}
        </Text> : null}
      <TouchableOpacity style={styles.orCircle}>
        <Text style={[styles.regularTextStyle, { color: Colors.text }]}>
          {"Or"}
        </Text>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[styles.regularTextStyle, { color: Colors.text }]}>
          {"Scan the "}
        </Text>
        <Text style={[styles.boldTextStyle, { color: Colors.text }]}>
          Vehicle Number
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={onBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "code128"],
          }}
          facing="back"
        />
      </View>
      <TouchableOpacity style={styles.circle} onPress={()=>{
        if(vin === ''){
          setError(true)
          setErrorMsg("Please enter a valid VIN number")
        }
        else if(vin.length < 17){
          setError(true)
          setErrorMsg("VIN number must be 17 characters")
        }
        else{
          manualEntry(vin)
        }
        }}>
        <Text style={styles.boldTextStyle}>{`SCAN\nNOW`}</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 10, 
  },
  cameraContainer: {
    height: 330,
    width: 286,
    marginTop: 15,
    backgroundColor: Colors.text,
    borderRadius: 20,
    borderWidth: 2,
    overflow: "hidden",
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40, // makes it a circle
    backgroundColor: "#45BC50",
    borderColor:'#7BE878',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#162142",
    color: Colors.text,
    fontSize: 16,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  orCircle: {
    width: 30,
    height: 30,
    borderRadius: 20, // makes it a circle
    backgroundColor: "#162142",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  regularTextStyle: {
    fontSize: FontConfig.sizes.large,
    fontWeight: FontConfig.weights.normal,
    textAlign: "center",
    fontFamily: FontConfig.families.poppinsRegular,
  },
  boldTextStyle: {
    fontSize: FontConfig.sizes.large,
    fontWeight: FontConfig.weights.bold,
    textAlign: "center",
    fontFamily: FontConfig.families.poppinsBold,
  },
});

export default ScannerView;
