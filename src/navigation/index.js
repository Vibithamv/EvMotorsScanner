// navigation.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import LoginScreen from '../screens/login';
import HomeScreen from '../screens/home';
import NewScanScreen from '../screens/newscan';
//import ForgotPasswordScreen from './screens/ForgotPasswordScreen'; // Create this screen too

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
         options={{
          headerBackVisible: false,
    headerTitle: () => (
      <Image 
        source={require('../assets/evmotors_logo.png')} 
        style={{ width: 180, height: 60, resizeMode: 'contain' }}
      />
    ),
  }}
        />
        <Stack.Screen 
          name="NewScan" 
          component={NewScanScreen} 
         options={{ headerBackTitle : 'New Scan'
  }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
