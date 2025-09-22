import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import AuthService from '../services/AuthService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Images, Colors, CommonStyles, AssetHelpers } from '../utils/AssetManager';

export default function SplashScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded] = Font.useFonts(AssetHelpers.getFontConfig());

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      // Wait a bit for the splash screen to be visible
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user is authenticated
      const isAuthenticated = await AuthService.isAuthenticated();
      
      if (isAuthenticated) {
        // User is logged in, navigate to Home
        navigation.replace('Home');
      } else {
        // User is not logged in, navigate to Login
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      // On error, default to login screen
      navigation.replace('Login');
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      {/* Main Logo */}
      <Image 
        source={Images.logoIcon} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      
      {/* App Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title1}>Check-In</Text>
        <Text style={styles.title2}>Hub</Text>
      </View>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>EV Motors Scanner</Text>
      
      {/* Loading Indicator */}
      <LoadingSpinner 
        text="Checking authentication..."
        style={styles.loadingContainer}
      />
      
      {/* Background Logo */}
      <Image
        source={Images.backgroundLogo}
        style={styles.backgroundLogo}
        resizeMode="contain"
      />
      
      {/* Footer */}
      <Text style={styles.footer}>© evmotors</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  title1: {
    ...CommonStyles.header1,
    fontSize: 36,
    marginRight: 5,
  },
  
  title2: {
    ...CommonStyles.header2,
    fontSize: 36,
  },
  
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 60,
    fontFamily: 'InstrumentSans-Regular',
  },
  
  loadingContainer: {
    marginBottom: 40,
  },
  
  backgroundLogo: {
    position: 'absolute',
    bottom: 60,
    width: 200,
    height: 200,
    opacity: 0.1,
  },
  
  footer: {
    ...CommonStyles.footer,
    bottom: 20,
  },
});
