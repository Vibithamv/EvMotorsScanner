// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert, Dimensions  } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import AuthService from '../services/AuthService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextVisible, setSecureTextVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');




  const onLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        navigation.replace('Home');
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

   const [fontsLoaded] = Font.useFonts({
    "InstrumentSans-Regular": require("../assets/fonts/InstrumentSans-Regular.ttf"),
    "InstrumentSans-Bold": require("../assets/fonts/InstrumentSans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const onForgotPassword = () => {
    // handle forgot password action
    Alert.alert('Forgot Password', 'Redirect to forgot password screen or action.');
  };

  return (
    <View style={styles.container}>
    
      <Image source={require('../assets/logo_icon.png')} style={styles.logo} resizeMode="contain" />

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
      textColor='#ffff'
        theme={{ colors: { primary: theme.primary, accent: theme.primary } }}
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
        textColor='#ffff'
        theme={{ colors: { primary: theme.primary, accent: theme.primary } }}
        right={
          <TextInput.Icon
            icon={secureTextVisible ? 'eye-off' : 'eye'}
            color='#5F6B91'
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
        source={require('../assets/background_logo.png')}
        style={[ {position:'absolute', bottom:10}]} 
        resizeMode="contain"
      />
      <Text style={styles.footer}>© evmotors</Text>

    </View>
  );
}

// Theme colors
const theme = {
  primary: '#005B9A',  // replace with EV Motors primary color
  background: '#FFFFFF',
  text: '#333333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 24,
    paddingRight:24,
    backgroundColor: '#0E1325',
    justifyContent: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    position:'absolute',
    top:56
   // marginTop:70
   // tintColor: '#4CAF50'
  },
  loginHeader:{
    flexDirection: 'row',  // this makes children sit in a row
    alignSelf: 'center', // optional, adds space between
    padding: 5,
    position:'absolute',
    top:126
  },
  header1:{
    fontSize:32,
    fontStyle:'bold',
    fontWeight:700,
    color:'#ffff',
    fontFamily: "InstrumentSans-Bold",
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
  fontSize:32,
    //fontStyle:'bold',
    fontWeight:400,
    color:'#45BC50',
    fontFamily: "InstrumentSans-Bold",
  },
  username:{
    fontSize:14,
    color:'#ffff',
    marginBottom:5,
   // marginTop:100,
   fontFamily: "InstrumentSans-Regular",
  },
   password:{
    fontSize:14,
    color:'#ffff',
    marginBottom:5,
    marginTop:5,
    fontFamily: "InstrumentSans-Regular",
  },
  input: {
    height:44,
    borderRadius:4,
    marginBottom: 10,
    //color:'#162142',
    backgroundColor:'#162142'
  },
  button: {
    height: 44,
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: '#45BC50',
     justifyContent: 'center',   // centers vertically
    alignItems: 'center',  
  },
  buttonContent: {
    color:'#0000',
    fontSize:14,
    fontWeight:700,
    textAlign: 'center',
    fontFamily: "InstrumentSans-Bold",
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
    color: '#45BC50',
    marginTop:20,
    fontFamily: "InstrumentSans-Regular",
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: "InstrumentSans-Regular",
  },
  footer: {
     position: "absolute",
    bottom: 20,
    color: "#666",
    fontSize: 12,
    alignSelf:'center',
    fontFamily: "InstrumentSans-Regular",

  }
});
