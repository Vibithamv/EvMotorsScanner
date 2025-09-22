// screens/NewScanScreen.tsx

import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
//import { BarCodeScanner } from 'expo-barcode-scanner';

export default function NewScanScreen() {

     const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    alert(`Scanned data: ${data}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Button
          title="Scan Again"
          onPress={() => {
            setScanned(false);
            setData('');
          }}
        />
      )}

      {data ? <Text style={styles.text}>Scanned: {data}</Text> : null}
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
  text: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    fontSize: 18,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
});
