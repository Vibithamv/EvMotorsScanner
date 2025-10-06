import { Alert, Image, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import AuthService from "../services/AuthService";
import { Colors, Images } from "../utils/AssetManager";
import { CommonActions } from "@react-navigation/native";

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
  back,
}) {
  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  const headerTitle = title ? (
    title
  ) : (
    <Image
      source={Images.loginLogo}
      style={{ width: 163, height: 43, resizeMode: "contain" }}
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
    <TouchableOpacity onPress={handleSettings}>
      <Image
        source={Images.profile}
        style={{ width: 32, height: 32, resizeMode: "contain" }}
      />
    </TouchableOpacity>
  ) : // : showLogout ? (
  //   <IconButton
  //     icon="power"
  //     iconColor={Colors.text}
  //     size={26}
  //     onPress={handleLogout}
  //     style={{ marginRight: 8 }}
  //   />
  // )
  null;

  const headerLeft = back ? (
    <IconButton
      icon="chevron-left"
      iconColor={Colors.text}
      size={24}
      onPress={() => {
        navigation.goBack();
      }}
      style={{ marginRight: 8 }}
    />
  ) : null;

  // : showLogout ? (
  //   <IconButton
  //     icon="power"
  //     iconColor={Colors.text}
  //     size={26}
  //     onPress={handleLogout}
  //     style={{ marginRight: 8 }}
  //   />
  // )

  return {
    headerTitle: () => headerTitle,
    headerRight: () => headerRight,
    headerLeft: () => headerLeft,

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
    headerBackVisible = false,
    headerSettings = false,
    headerBackTitle = "Back",
    back = false,
    ...customStyles
  } = options;

  return {
    headerBackVisible,
    headerBackTitle,
    ...HeaderWithLogout({
      navigation,
      title,
      headerSettings,
      customStyles,
      back,
    }),
  };
};
