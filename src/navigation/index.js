// navigation.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getHeaderOptions } from "../components/HeaderWithLogout";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/home";
import LoginScreen from "../screens/login";
import NewScanScreen from "../screens/newscan";
import RegisterScreen from "../screens/register";
import SettingsScreen from "../screens/settings";
//import ForgotPasswordScreen from './screens/ForgotPasswordScreen'; // Create this screen too

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
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
          component={HomeScreen}
          options={({ navigation }) =>
            getHeaderOptions(navigation, {
              headerBackVisible: false,
              headerSettings: true,
            })
          }
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScan"
          component={NewScanScreen}
          options={({ navigation }) =>
            getHeaderOptions(navigation, {
              headerTitle: "New Scan",
            })
          }
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={({ navigation }) =>
            getHeaderOptions(navigation, {
              headerTitle: "Settings",
              headerBackVisible: true,
              showLogout: true,
            })
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
