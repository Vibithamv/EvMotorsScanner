// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert, Dimensions  } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { useAuth } from '../contexts/AuthContext';
import { Images, Fonts, Colors, CommonStyles, AssetHelpers } from '../utils/AssetManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextVisible, setSecureTextVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();




  const onLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigation.replace('Home');
        console.log('Login successful');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
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
    Alert.alert('Forgot Password', 'Redirect to forgot password screen or action.');
  };

  return (
    <View style={styles.container}>
    
      <Image source={Images.logoIcon} style={styles.logo} resizeMode="contain" />

 <View style={styles.loginHeader}>
      <Text style={styles.header1}>Check-In</Text>
      <Text style={styles.header2}> Hub</Text>
    </View>
    <Text style={styles.loginText}> Login</Text>
    <Text style={styles.username}>
      Username
    </Text>
      <TextInput
       // label="Username"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      //  mode="outlined"
      textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, accent: Colors.primary } }}
      />

     <Text style={styles.password}>
      Password
    </Text>

      <TextInput
       // label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureTextVisible}
      //  mode="outlined"
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, accent: Colors.primary } }}
        right={
          <TextInput.Icon
            icon={secureTextVisible ? 'eye-off' : 'eye'}
            color={Colors.textSecondary}
            onPress={() => setSecureTextVisible(!secureTextVisible)}
          />
        }
      />

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

       <TouchableOpacity onPress={onLogin} style={styles.button} disabled={loading}>
        <Text style={styles.buttonContent}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForgotPassword} style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

       <Image
        source={Images.backgroundLogo}
        style={[ {position:'absolute', bottom:10}]} 
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
  loginHeader:{
    flexDirection: 'row',  // this makes children sit in a row
    alignSelf: 'center', // optional, adds space between
    padding: 5,
    position:'absolute',
    top:126
  },
  header1:{
    ...CommonStyles.header1,
    // position:'absolute',
    // top:126,
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
    ...CommonStyles.header2,
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
