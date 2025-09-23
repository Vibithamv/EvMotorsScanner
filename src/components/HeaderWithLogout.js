import React from 'react';
import { Image, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Images, Colors } from '../utils/AssetManager';
import { useAuth } from '../contexts/AuthContext';

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
  customStyles = {} 
}) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const headerTitle = title ? (
    title
  ) : (
    <Image 
      source={Images.evmotorsLogo} 
      style={{ width: 180, height: 60, resizeMode: 'contain' }}
    />
  );

  const headerRight = showLogout ? (
    <IconButton
      icon="power"
      iconColor={Colors.error}
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
    showLogout = true,
    headerBackVisible = true,
    headerBackTitle = 'Back',
    ...customStyles
  } = options;

  return {
    headerBackVisible,
    headerBackTitle,
    ...HeaderWithLogout({ navigation, title, showLogout, customStyles }),
  };
};
