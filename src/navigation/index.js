// navigation.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/login';
import HomeScreen from '../screens/home';
import NewScanScreen from '../screens/newscan';
import { Images } from '../utils/AssetManager';
import { getHeaderOptions } from '../components/HeaderWithLogout';
import { AuthProvider } from '../contexts/AuthContext';
//import ForgotPasswordScreen from './screens/ForgotPasswordScreen'; // Create this screen too

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={({ navigation }) => getHeaderOptions(navigation, {
              headerBackVisible: false
            })}
          />
          <Stack.Screen 
            name="NewScan" 
            component={NewScanScreen}
            options={({ navigation }) => getHeaderOptions(navigation, {
              headerTitle:'New Scan',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default AppNavigation;
