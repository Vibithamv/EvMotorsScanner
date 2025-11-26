import * as SplashScreenModule from "expo-splash-screen";
import * as Font from "expo-font";
import { useEffect, useState, useCallback, useRef } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import AuthService from "../services/AuthService";
import {
  AssetHelpers,
  CommonStyles,
  Images
} from "../utils/AssetManager";

// Keep the splash screen visible while we fetch resources
SplashScreenModule.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, fontError] = Font.useFonts(AssetHelpers.getFontConfig());
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    checkAuthenticationStatus();
    
    // Fallback: Force navigation after 5 seconds if still loading
    const fallbackTimeout = setTimeout(() => {
      if (!hasNavigatedRef.current) {
        console.warn("Splash screen timeout - forcing navigation to Login");
        hasNavigatedRef.current = true;
        setIsLoading(false);
        navigation.replace("Login");
        SplashScreenModule.hideAsync();
      }
    }, 5000);
    
    return () => clearTimeout(fallbackTimeout);
  }, []);

  // Hide splash screen after fonts load or after timeout
  useEffect(() => {
    let timeout;
    const hideSplash = async () => {
      // Wait for fonts to load or timeout after 3 seconds
      if (fontsLoaded || fontError) {
        await SplashScreenModule.hideAsync();
      } else {
        // Fallback: hide splash after 3 seconds even if fonts aren't loaded
        timeout = setTimeout(async () => {
          await SplashScreenModule.hideAsync();
        }, 3000);
      }
    };
    hideSplash();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [fontsLoaded, fontError]);

  const checkAuthenticationStatus = async () => {
    try {
      // Wait a bit for the splash screen to be visible
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user is authenticated
      const isAuthenticated = await AuthService.isAuthenticated();

      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        if (isAuthenticated) {
          // User is logged in, navigate to Home
          navigation.replace("Home");
        } else {
          // User is not logged in, navigate to Login
          navigation.replace("Login");
        }
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      // On error, default to login screen
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigation.replace("Login");
      }
    } finally {
      setIsLoading(false);
      // Ensure splash screen is hidden after auth check
      SplashScreenModule.hideAsync().catch(console.error);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    // Hide splash screen once layout is complete
    if (!isLoading) {
      await SplashScreenModule.hideAsync();
    }
  }, [isLoading]);

  // Always render the splash screen, even if fonts aren't loaded
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
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
