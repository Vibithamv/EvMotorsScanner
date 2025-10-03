import { CameraView } from "expo-camera";
import { StyleSheet, View ,Text, TouchableOpacity} from "react-native";
import { Colors, FontConfig } from "../utils/AssetManager";

const ScannerView = ({ onBarcodeScanned }) => {
  return (
    <View style={styles.container}>
        <Text style={{color: Colors.text,
          fontSize: FontConfig.sizes.large,
          fontWeight: FontConfig.weights.normal,
          textAlign: "center",
          fontFamily: FontConfig.families.poppinsRegular,}}>
        Scan the
      </Text>
    <Text style={{color: Colors.text,
          fontSize: FontConfig.sizes.large,
          fontWeight: FontConfig.weights.bold,
          textAlign: "center",
          fontFamily: FontConfig.families.poppinsBold,}}>
        Vehicle Number
      </Text>

       <View style={{height:334,width:286,marginTop:15,backgroundColor:Colors.text,borderRadius:20,borderWidth:2, overflow: "hidden",}}>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "code128"],
        }}
        facing="back"
      />
    </View>
     <TouchableOpacity style={styles.circle} >
        <Text style={styles.text}>{`Scan\nNow`}</Text>
      </TouchableOpacity>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
  },
   circle: {
    width: 80,
    height: 80,
    borderRadius: 40,    // makes it a circle
    backgroundColor: '#67C530',
    justifyContent:'center',
    alignItems:'center'
  },
  text: {
    color: Colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },


});

export default ScannerView;
