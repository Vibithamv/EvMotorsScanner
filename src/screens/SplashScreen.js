import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import AuthService from '../services/AuthService';
import { TextInput, Button } from 'react-native-paper';
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
    
      <Image source={Images.evmotorsLogo} style={styles.evmotorsLogo} resizeMode="contain" />

 <View style={styles.loginHeader}>
      <Text style={styles.header1}>Check-In</Text>
      <Text style={styles.header2}> Hub</Text>
    </View>
       <Image
        source={Images.backgroundLogo}
        style={[ {position:'absolute', bottom:10}]} 
        resizeMode="contain"
      />
      <Text style={styles.footer}>© evmotors</Text>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    ...CommonStyles.container,
  },
  evmotorsLogo: {
    ...CommonStyles.evmotorsLogo,
  },
  loginHeader:{
    flexDirection: 'row',  // this makes children sit in a row
    alignSelf: 'center',
  },
  header1:{
    ...CommonStyles.splashHeader1,
  },
  loginText:{
    fontSize:16,
    fontStyle:'bold',
    fontWeight:700,
    color:'#ffff',
    alignSelf:'center',
    position:'absolute',
    top:174,
    fontFamily: "InstrumentSans-Bold",
  },
  header2:{
    ...CommonStyles.splashHeader2,
  },
  username:{
    ...CommonStyles.label,
  },
   password:{
    ...CommonStyles.label,
    marginTop:5,
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
    alignItems: 'center',
    marginTop: 16,
    marginBottom:16
  },
  row: {
   flexDirection: 'row',        // Align children horizontally
    justifyContent: 'center',    // Center them in the parent
    alignItems: 'center',   
    gap:5     // Align vertically
  },
  forgotText: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop:20,
    fontFamily: "InstrumentSans-Regular",
  },
  errorText: {
    ...CommonStyles.errorText,
  },
  footer: {
    ...CommonStyles.footer,
  }
});
