// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert, Dimensions  } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
// import { Auth } from "aws-amplify";
// import "react-native-get-random-values";
// import "react-native-url-polyfill/auto";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const poolData = {
  region: 'us-east-1',
  UserPoolId: "us-east-1_xZml1eRpm",
  ClientId: "3gfcpc1oe82o10kgqlv78kb6v7",
};

const userPool = new CognitoUserPool(poolData);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextVisible, setSecureTextVisible] = useState(true);
  const [loading, setLoading] = useState(false);


  async function signInWithPasswordAuth(email, password) {
  const response = await fetch(
    `https://cognito-idp.${poolData.region}.amazonaws.com/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: poolData.ClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Invalid email or password");
  }

  const authResult = await response.json();

  if (authResult.ChallengeName) {
    if (authResult.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      console.log("NEW_PASSWORD_REQUIRED challenge received");
      console.log("Session token:", authResult.Session);
      console.log(
        "Session token length:",
        authResult.Session ? authResult.Session.length : "undefined"
      );
      console.log("Challenge parameters:", authResult.ChallengeParameters);

      // Create a custom error with session data
      const error = new Error("NEW_PASSWORD_REQUIRED");
      error.session = authResult.Session;
      error.challengeParameters = authResult.ChallengeParameters;
      throw error;
    }
    throw new Error(
      "Additional authentication required. Please contact your administrator."
    );
  }

  return console.log(authResult.AuthenticationResult);
}

// Example usag


  const onLogin = async () => {

    try {
    const user = await signInWithPasswordAuth(email, password);
    console.log("User tokens:", user);
  } catch (err) {
    if (err.message === "NEW_PASSWORD_REQUIRED") {
      console.log("User must set a new password. Session:", err.session);
    } else {
      console.error("Sign-in failed:", err);
    }
  }
  //   console.log("Login started")
  //   const user = new CognitoUser({ Username: email, Pool: userPool });
  // const authDetails = new AuthenticationDetails({ Username: email, Password: password });
  // console.log(authDetails);
  // try{
  // user.authenticateUser(authDetails, {
  //   onSuccess: (result) => {
  //     Alert.alert('Login success', '');
  //     console.log("✅ JWT:", result.getAccessToken().getJwtToken());
  //   },
  //   onFailure: (err) => {
  //     Alert.alert('Login Error', '');
  //     console.error("❌ Error:", err);
  //   },
  // });
// }catch(err){
//   console.log(err)
// }
  //    try {
  //   const user = await Auth.signIn(email, password);

  //   if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
  //     console.log("User must change password.");
  //      Alert.alert('change password', '');
  //     // handle password reset flow here
  //   } else {
  //      Alert.alert('Login success', '');
  //     console.log("Login success:", user);
  //   }
  //   return user;
  // } catch (err) {
  //    Alert.alert('Login Error', '');
  //   console.error("Login error:", err);
  //   throw err;
  // }
//     if (!email || !password) {
//       Alert.alert('Error', 'Please enter both email and password.');
//       return;
//     }
//     setLoading(true);
//       // replace with your API URL
//     axios.post('https://dummyjson.com/auth/login', {
//     username: email,
//     password: password,
//       },
//     {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   }).then(response => {
//   console.log('Success:', response.data);
// //  Alert.alert('Success', JSON.stringify(response.data));
//   setLoading(false);
//   navigation.navigate('Home')
// })
// .catch(error => {
//   console.error('Error:', error.response?.data || error.message);
//    Alert.alert('Error', error.response?.data || error.message);
//   setLoading(false);
// });
    
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

       <TouchableOpacity onPress={onLogin} style={styles.button}>
        <Text style={styles.buttonContent}>Login</Text>
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
  footer: {
     position: "absolute",
    bottom: 20,
    color: "#666",
    fontSize: 12,
    alignSelf:'center',
    fontFamily: "InstrumentSans-Regular",

  }
});
