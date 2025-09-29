import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WebView from "react-native-webview";
import { Colors } from "../utils/AssetManager";

const WebViewModal = ({ url, onDismiss }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {/* WebView */}
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        onLoadStart={() => setLoading(true)} // show loader
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={Colors.secondary}
        />
      )}

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onDismiss} // 👈 closes screen
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    padding: 20, // 👈 important for absolute children
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  closeButton: {
    position: "absolute",
    top: 10, // adjust for status bar
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 5, // Android
  },
  closeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default WebViewModal;
