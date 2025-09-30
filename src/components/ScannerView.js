import { CameraView } from "expo-camera";
import { StyleSheet, View } from "react-native";

const ScannerView = ({ onBarcodeScanned, onManualEntry, isValidating }) => {
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "code128"],
        }}
        facing="back"
      />
      {/* <View style={styles.overlay}>
        <Button 
          title="Manual Entry" 
          onPress={onManualEntry} 
          disabled={isValidating}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default ScannerView;
