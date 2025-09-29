import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import AuthService from "../services/AuthService";
import {
  AssetHelpers,
  CommonStyles,
  Images
} from "../utils/AssetManager";

export default function SplashScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded] = Font.useFonts(AssetHelpers.getFontConfig());

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      // Wait a bit for the splash screen to be visible
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user is authenticated
      const isAuthenticated = await AuthService.isAuthenticated();

      if (isAuthenticated) {
        // User is logged in, navigate to Home
        navigation.replace("Home");
      } else {
        // User is not logged in, navigate to Login
        navigation.replace("Login");
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      // On error, default to login screen
      navigation.replace("Login");
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={Images.splashLogo}
        style={styles.evmotorsLogo}
        resizeMode="contain"
      />
      <Image
        source={Images.backgroundLogo}
        style={[{ position: "absolute", bottom: 10 }]}
        resizeMode="contain"
      />
      <Text style={styles.footer}>© evmotors</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    justifyContent: "flex-start", // start from top
    alignItems: "center",
  },
  evmotorsLogo: {
    ...CommonStyles.splashLogo,
    marginTop: "75%",
  },
  footer: {
    ...CommonStyles.footer,
  },
});
