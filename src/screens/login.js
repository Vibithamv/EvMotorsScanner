// screens/LoginScreen.tsx

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from "react-native-paper";
import AuthService from "../services/AuthService";
import {
  AssetHelpers,
  Colors,
  CommonStyles,
  Images
} from "../utils/AssetManager";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextVisible, setSecureTextVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        navigation.replace("Home");
        console.log("Login successful");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [fontsLoaded] = Font.useFonts(AssetHelpers.getFontConfig());

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const onForgotPassword = () => {
    // handle forgot password action
    Alert.alert(
      "Forgot Password",
      "Redirect to forgot password screen or action."
    );
  };

  const onRegister = () => {
    navigation.replace("Register");
  };

  return (
    <View style={styles.container}>
      <Image
        source={Images.logoIcon}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.loginHeader}>
        <Text style={styles.header1}>Check-In</Text>
        <Text style={styles.header2}> Hub</Text>
      </View>
      <Text style={styles.loginText}> Login</Text>
      <Text style={styles.username}>Email Id</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, accent: Colors.primary } }}
      />

      <Text style={styles.password}>Password</Text>

      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureTextVisible}
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, accent: Colors.primary } }}
        right={
          <TextInput.Icon
            icon={secureTextVisible ? "eye-off" : "eye"}
            color={Colors.textSecondary}
            onPress={() => setSecureTextVisible(!secureTextVisible)}
          />
        }
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        onPress={onLogin}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.buttonContent}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRegister} style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Register new user?</Text>
      </TouchableOpacity>

      <Image
        source={Images.backgroundLogo}
        style={[{ position: "absolute", bottom: 10 }]}
        resizeMode="contain"
      />
      <Text style={styles.footer}>© evmotors</Text>
    </View>
  );
}

// Theme colors are now managed by AssetManager

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
  },
  logo: {
    ...CommonStyles.logo,
  },
  loginHeader: {
    flexDirection: "row", // this makes children sit in a row
    alignSelf: "center", // optional, adds space between
    padding: 5,
    position: "absolute",
    top: 126,
  },
  header1: {
    ...CommonStyles.header1,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    alignSelf: "center",
    position: "absolute",
    top: 174,
    fontFamily: "InstrumentSans-Bold",
  },
  header2: {
    ...CommonStyles.header2,
  },
  username: {
    ...CommonStyles.label,
  },
  password: {
    ...CommonStyles.label,
    marginTop: 5,
  },
  input: {
    ...CommonStyles.input,
  },
  button: {
    ...CommonStyles.primaryButton,
    marginTop: 8,
  },
  buttonContent: {
    ...CommonStyles.primaryButtonText,
  },
  forgotContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  forgotText: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 20,
    fontFamily: "InstrumentSans-Regular",
  },
  errorText: {
    ...CommonStyles.errorText,
  },
  footer: {
    ...CommonStyles.footer,
  },
});
