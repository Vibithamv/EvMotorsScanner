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
import AuthGuard from '../components/AuthGuard';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
//import ForgotPasswordScreen from './screens/ForgotPasswordScreen'; // Create this screen too

const Stack = createNativeStackNavigator();

// Protected route wrapper component
const ProtectedRoute = ({ children }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

// Navigation component that uses auth context
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
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
          options={({ navigation }) => getHeaderOptions(navigation, {
            headerBackVisible: false
          })}
        >
          {() => (
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen 
          name="NewScan" 
          options={({ navigation }) => getHeaderOptions(navigation, {
            headerTitle:'New Scan',
          })}
        >
          {() => (
            <ProtectedRoute>
              <NewScanScreen />
            </ProtectedRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main navigation component with auth provider
const AppNavigation = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default AppNavigation;
