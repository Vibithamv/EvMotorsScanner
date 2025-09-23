// screens/NewScanScreen.tsx

import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
//import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraView, useCameraPermissions } from "expo-camera";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function NewScanScreen() {

    const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [scanning, setScanning] = useState(true);

   useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }) => {
    setScanning(false);
    setScannedData(`Type: ${type}\nData: ${data}`);
    getVinValidationApi({vin:data});
  };

  const getVinValidationApi = async ({vin}) => {
    try {
      const response = await axios.get('http://192.168.1.96:3000/api/vin/validate',
        { params: { vin }, 
          headers: { 'Content-Type': 'application/json',
              Authorization: "Bearer "+ await AsyncStorage.getItem('cognitoToken')
         // Authorization: "Bearer eyJraWQiOiJ4NG9kVkI2Rlc5YVdHYm9zN1JLTmNkY09KSzJcL01xZHl3b2ozdmU1cTh0bz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNDU4ZTQwOC1lMDUxLTcwMWQtYTg0Yy1kMjc0M2QyMzRkNzMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV94Wm1sMWVScG0iLCJjbGllbnRfaWQiOiIzZ2ZjcGMxb2U4Mm8xMGtncWx2NzhrYjZ2NyIsIm9yaWdpbl9qdGkiOiI3NDUxYmQxMS05NjAzLTRhZWMtODQ3ZS00M2ExYjZkNWFhOGMiLCJldmVudF9pZCI6ImFhODdmY2MzLTIzNTAtNDNjOS1iNjUzLTA2Y2I1ZjEyMWYxNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NTg2MTE2MjUsImV4cCI6MTc1ODYxNTIyNSwiaWF0IjoxNzU4NjExNjI1LCJqdGkiOiI0Nzc2Mzc0Yy02MmU0LTQ5NmQtODAwYy01NGY4YzAzZGU1NDYiLCJ1c2VybmFtZSI6IjE0NThlNDA4LWUwNTEtNzAxZC1hODRjLWQyNzQzZDIzNGQ3MyJ9.FdE5Hr0OQ03DGIy8CzgGDxvybi2bie1jC6JZzskTmUJN0koLzSM545NpEya_YfeiIqJDTteqOFpBPvZMBF4Ab83PMp3moN-xLdpoMeabXLCiHrmrWQr8kc1Rt8_iFFrm0XM4PjjW6FA4NiYZVni59JFuO3-GBKQfqgqKXraSnTPSuZBmSOvhLmKYXAJyuoB8Zrv6T5En6ZcibPme8f5CQ28qajpTdURLJHyscgJmVKNhjkhhywcS0qzHEgitsjjbKzzOaHCjFuXyHv0-U9Rqpa49lgieQOFKuri1rCll3e5mlp3MmOealbWFzg9Q4gO2evNLCr-00W_CqEUtB6ytgA"
         } }
      )
      .then((res) => {
        console.log('response',res.data);
      });
    } catch (error) {
      console.error('Error fetching VIN data:', error);
    }
  };



  return (
     <View style={styles.container}>
      {scanning ? (
        <View  style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "code128"], // choose types you want
          }}
        />
        {/* <Button title="Scan" onPress={() => {
            handleBarcodeScanned({ type: 'manual', data: 'LMGBB1L84T3144268'})
          }} /> */}
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.result}>{scannedData}</Text>
          <Button title="Scan Again" onPress={() => setScanning(true)} />
        </View>
      )}
      
     
    </View>
  );
}

// Theme colors
const theme = {
  primary: '#005B9A',  // replace with EV Motors primary color
  background: '#FFFFFF',
  text: '#333333',
};

const styles = StyleSheet.create({
container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  result: {
    fontSize: 18,
    color: "#fff",
    margin: 20,
    textAlign: "center",
  },
});
