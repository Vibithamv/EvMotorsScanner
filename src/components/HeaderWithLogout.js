import { Alert, Image } from "react-native";
import { IconButton } from "react-native-paper";
import AuthService from "../services/AuthService";
import { Colors, Images } from "../utils/AssetManager";
import { CommonActions } from '@react-navigation/native';

/**
 * Reusable header component with logout functionality
 * @param {Object} navigation - Navigation object
 * @param {string} title - Optional custom title (defaults to EV Motors logo)
 * @param {boolean} showLogout - Whether to show logout button (defaults to true)
 * @param {Object} customStyles - Custom styles for the header
 */
export default function HeaderWithLogout({
  navigation,
  title = null,
  showLogout = true,
  headerSettings = true,
  customStyles = {},
}) {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AuthService.logout();
          navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'Login' }], // the only screen left in stack
  })
);
        },
      },
    ]);
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  const headerTitle = title ? (
    title
  ) : (
    <Image
      source={Images.splashLogo}
      style={{ width: 180, height: 60, resizeMode: "contain" }}
    />
  );

  // const headerRight = showLogout ? (
  //   <IconButton
  //     icon="power"
  //     iconColor={Colors.error}
  //     size={26}
  //     onPress={handleLogout}
  //     style={{ marginRight: 8 }}
  //   />
  // ) : null;

  const headerRight = headerSettings ? (
    <IconButton
      icon="cog"
      iconColor={Colors.text}
      size={26}
      onPress={handleSettings}
      style={{ marginRight: 8 }}
    />
  ) : showLogout ? (
    <IconButton
      icon="power"
      iconColor={Colors.text}
      size={26}
      onPress={handleLogout}
      style={{ marginRight: 8 }}
    />
  ) : null;

  return {
    headerTitle: () => headerTitle,
    headerRight: () => headerRight,
    ...customStyles,
  };
}

/**
 * Helper function to get header options for navigation
 * @param {Object} navigation - Navigation object
 * @param {Object} options - Additional options
 * @returns {Object} Header options object
 */
export const getHeaderOptions = (navigation, options = {}) => {
  const {
    title = null,
    showLogout = false,
    headerBackVisible = true,
    headerSettings = false,
    headerBackTitle = "Back",
    ...customStyles
  } = options;

  return {
    headerBackVisible,
    headerBackTitle,
    ...HeaderWithLogout({
      navigation,
      title,
      showLogout,
      headerSettings,
      customStyles,
    }),
  };
};
