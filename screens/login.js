// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextVisible, setSecureTextVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
      // replace with your API URL
    axios.post('https://dummyjson.com/auth/login', {
    username: email,
    password: password,
      },
    {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => {
  console.log('Success:', response.data);
//  Alert.alert('Success', JSON.stringify(response.data));
  setLoading(false);
  navigation.navigate('Home')
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
   Alert.alert('Error', error.response?.data || error.message);
  setLoading(false);
});
    
  };

  const onForgotPassword = () => {
    // handle forgot password action
    Alert.alert('Forgot Password', 'Redirect to forgot password screen or action.');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/evmotors_logo.png')} style={styles.logo} resizeMode="contain" />

      <TextInput
        label="Username"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: theme.primary, accent: theme.primary } }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureTextVisible}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: theme.primary, accent: theme.primary } }}
        right={
          <TextInput.Icon
            icon={secureTextVisible ? 'eye-off' : 'eye'}
            onPress={() => setSecureTextVisible(!secureTextVisible)}
          />
        }
      />

      <Button
        mode="contained"
        onPress={onLogin}
        loading={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Login
      </Button>

      <TouchableOpacity onPress={onForgotPassword} style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

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
    padding: 24,
    backgroundColor: theme.background,
    justifyContent: 'center',
  },
  logo: {
    width: '60%',
    height: 100,
    alignSelf: 'center',
    marginBottom: 32,
   // tintColor: '#4CAF50'
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom:16
  },
  forgotText: {
    color: theme.primary,
    textDecorationLine: 'underline',
  },
  row: {
   flexDirection: 'row',        // Align children horizontally
    justifyContent: 'center',    // Center them in the parent
    alignItems: 'center',   
    gap:5     // Align vertically
  },
  forgotText: {
    fontSize: 16,
    fontFamily: 'bold',
    color: '#648DDB',
    fontWeight:600,
    textAlign:'right'
  },
  or:{
     color:'#919090ff',
     fontSize: 16,
  }
});
