// screens/LoginScreen.tsx

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useState, useRef, useEffect, useCallback } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native-paper";
import ConfirmCodePopup from "../components/confirmCodePopup";
import { userRegister } from "../hooks/userRegister";
import AuthService from "../services/AuthService";
import {
  AssetHelpers,
  Colors,
  CommonStyles,
  Images,
} from "../utils/AssetManager";
import { CustomAlertProvider } from "../components/CustomAlert";

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNumber] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextVisible, setSecureTextVisible] = useState(true);
  const [secureConfirmTextVisible, setSecureConfirmTextVisible] =
    useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailedAlert, setShowFailedAlert] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [showUserExistAlert, setUserExistAlert] = useState(false);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const userRegisterVal = userRegister(firstName, lastName, phoneNo, email);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onConfirm = async (confirmationCode) => {
    setPopupVisible(false);
    try {
      const result = await AuthService.confirmRegister(email, confirmationCode);
      if (result.success) {
        setShowSuccessAlert(true);
      } else {
        setShowFailedAlert(true);
        setAlertDescription(result.error);
      }
    } catch (err) {
      setShowFailedAlert(true);
      setAlertDescription("An unexpected error occurred. Please try again.");
      console.error("Registration confirmation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const onRegister = async () => {
    Keyboard.dismiss();
    if (!firstName) return setError("Please enter first name");
    if (!lastName) return setError("Please enter last name");
    if (!email) return setError("Please enter email");
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (!password) return setError("Please enter password");
    if (!confirmPassword) return setError("Please enter confirm password");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!validatePhone(phoneNo))
      return setError("Please enter a valid phone number");

    setLoading(true);
    setError("");

    try {
      const result = await AuthService.register(
        email,
        password,
        firstName,
        lastName
      );
      if (result.navigateToLogin) {
        setUserExistAlert(true);
      } else if (result.confirmCodePopup) {
        setPopupVisible(true);
      }
      if (result.success) {
        const registerResult = await userRegisterVal.userRegisterApi();
        if (registerResult.success) {
          setPopupVisible(true);
        } else {
          setShowFailedAlert(true);
          setAlertDescription(registerResult.error.message);
        }
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

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const onLogin = () => {
    navigation.replace("Login");
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={keyboardHeight} // pushes input above keyboard
      enableAutomaticScroll={true}
      onLayout={onLayoutRootView}
    >
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
        <Text style={styles.userRegisterText}> User Register</Text>
        <Text style={styles.username}>First name</Text>
        <TextInput
          // label="Username"
          value={firstName}
          onChangeText={setFirstName}
          keyboardType="text"
          autoCapitalize="none"
          style={styles.input}
          textColor={Colors.text}
          returnKeyType="next" // shows "Next" on the keyboard
          onSubmitEditing={() => input2Ref.current.focus()} // focus next input
          theme={{
            colors: { primary: Colors.primary, accent: Colors.primary },
          }}
        />

        <Text style={styles.username}>Last name</Text>
        <TextInput
          // label="Username"
          ref={input2Ref}
          value={lastName}
          onChangeText={setLastName}
          keyboardType="text"
          autoCapitalize="none"
          style={styles.input}
          textColor={Colors.text}
          returnKeyType="next" // shows "Next" on the keyboard
          onSubmitEditing={() => input3Ref.current.focus()} // focus next input
          theme={{
            colors: { primary: Colors.primary, accent: Colors.primary },
          }}
        />
        <Text style={styles.username}>Phone Number</Text>
        <TextInput
          ref={input3Ref}
          value={phoneNo}
          onChangeText={setPhoneNumber}
          keyboardType="number-pad"
          autoCapitalize="none"
          style={styles.input}
          textColor={Colors.text}
          returnKeyType="next" // shows "Next" on the keyboard
          onSubmitEditing={() => input4Ref.current.focus()} // focus next input
          theme={{
            colors: { primary: Colors.primary, accent: Colors.primary },
          }}
        />
        <Text style={styles.username}>Email Id</Text>
        <TextInput
          ref={input4Ref}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          textColor={Colors.text}
          returnKeyType="next" // shows "Next" on the keyboard
          onSubmitEditing={() => input5Ref.current.focus()} // focus next input
          theme={{
            colors: { primary: Colors.primary, accent: Colors.primary },
          }}
        />

        <Text style={styles.password}>Password</Text>

        <TextInput
          ref={input5Ref}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextVisible}
          style={styles.input}
          textColor={Colors.text}
          returnKeyType="next" // shows "Next" on the keyboard
          onSubmitEditing={() => input6Ref.current.focus()} // focus next input
          theme={{
            colors: { primary: Colors.primary, accent: Colors.primary },
          }}
          right={
            <TextInput.Icon
              icon={secureTextVisible ? "eye-off" : "eye"}
              color={Colors.textSecondary}
              forceTextInputFocus={false}
              onPress={(event) => {
                event.preventDefault(); // prevent keyboard focus
                setSecureTextVisible(!secureTextVisible);
              }}
            />
          }
        />

        <Text style={styles.password}>Confirm Password</Text>

        <TextInput
          ref={input6Ref}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureConfirmTextVisible}
          style={styles.input}
          textColor={Colors.text}
          returnKeyType="done" // shows "Done" on the keyboard
          onSubmitEditing={() => console.log("Submit form or hide keyboard")}
          theme={{
            colors: { primary: Colors.primary, accent: Colors.primary },
          }}
          right={
            <TextInput.Icon
              icon={secureConfirmTextVisible ? "eye-off" : "eye"}
              color={Colors.textSecondary}
              forceTextInputFocus={false}
              onPress={(event) => {
                event.preventDefault(); // prevent keyboard focus
                setSecureConfirmTextVisible(!secureConfirmTextVisible);
              }}
            />
          }
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={onRegister}
          style={styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonContent}>
            {loading ? "Loading..." : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogin} style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>© evmotors</Text>
        {popupVisible ? (
          <ConfirmCodePopup
            visible={popupVisible}
            onDismiss={() => setPopupVisible(false)}
            onConfirm={onConfirm}
          />
        ) : null}
      </View>
      {showSuccessAlert ? (
        <CustomAlertProvider
          title="Success"
          description={"Registration successfully confirmed. Please log in."}
          option1="Ok"
          handleOption1={() => {
            setShowSuccessAlert(false);
            navigation.replace("Login");
          }}
        />
      ) : null}

      {showFailedAlert ? (
        <CustomAlertProvider
          title="Registration failed"
          description={alertDescription}
          option1="Ok"
          handleOption1={() => {
            setShowFailedAlert(false);
          }}
        />
      ) : null}

      {showUserExistAlert ? (
        <CustomAlertProvider
          title="Alert"
          description="User already exists, Please login"
          option1="Ok"
          handleOption1={() => {
            setUserExistAlert(false);
            navigation.replace("Login");
          }}
        />
      ) : null}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    paddingTop: 10,
  },
  logo: {
    width: 48,
    height: 48,
    alignSelf: "center",
  },
  loginHeader: {
    flexDirection: "row", // this makes children sit in a row
    alignSelf: "center", // optional, adds space between
    padding: 5,
  },
  header1: {
    ...CommonStyles.header1,
  },
  userRegisterText: {
    fontSize: 16,
    fontStyle: "bold",
    fontWeight: 700,
    color: "#ffff",
    alignSelf: "center",
    fontFamily: "InstrumentSans-Bold",
    marginBottom: 5,
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
  loginContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 100,
  },
  row: {
    flexDirection: "row", // Align children horizontally
    justifyContent: "center", // Center them in the parent
    alignItems: "center",
    gap: 5, // Align vertically
  },
  loginText: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 10,
    fontFamily: "InstrumentSans-Regular",
  },
  errorText: {
    ...CommonStyles.errorText,
  },
  footer: {
    ...CommonStyles.footer,
  },
});
