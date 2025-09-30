// screens/HomeScreen.tsx

import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { Colors } from "../utils/AssetManager";

export default function HomeScreen({ navigation }) {
  const newScan = () => {
    navigation.navigate("NewScan");
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={newScan}
        //loading={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        textColor="#0000"
      >
        New Scan
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
