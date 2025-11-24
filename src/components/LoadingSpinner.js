import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../utils/AssetManager";

export default function LoadingSpinner({
  size = "large",
  color = Colors.secondary,
  text = "Loading...",
  showText = true,
  style = {},
}) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {showText && <Text style={styles.loadingText}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "InstrumentSans-Regular",
  },
});
