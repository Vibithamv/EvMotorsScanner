/**
 * HeaderWithLogout Component Usage Examples
 * This file demonstrates how to use the HeaderWithLogout component in different scenarios
 */

import React from 'react';
import { View, Text } from 'react-native';
import { getHeaderOptions } from './HeaderWithLogout';

// ===== EXAMPLE 1: Basic Usage in Navigation =====
export const BasicNavigationExample = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => getHeaderOptions(navigation, {
          headerBackVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

// ===== EXAMPLE 2: Custom Title with Logout =====
export const CustomTitleExample = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={({ navigation }) => getHeaderOptions(navigation, {
          title: <Text style={{ fontSize: 18, fontWeight: 'bold' }}>User Profile</Text>,
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
};

// ===== EXAMPLE 3: Header Without Logout Button =====
export const NoLogoutExample = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={({ navigation }) => getHeaderOptions(navigation, {
          showLogout: false,
          headerBackTitle: 'Settings',
        })}
      />
    </Stack.Navigator>
  );
};

// ===== EXAMPLE 4: Custom Styling =====
export const CustomStylingExample = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={({ navigation }) => getHeaderOptions(navigation, {
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#f8f9fa',
          },
          headerTintColor: '#333',
        })}
      />
    </Stack.Navigator>
  );
};

// ===== EXAMPLE 5: Using in Screen Component =====
import HeaderWithLogout from './HeaderWithLogout';

export const ScreenWithCustomHeader = ({ navigation }) => {
  const headerOptions = HeaderWithLogout({
    navigation,
    title: <Text>Custom Screen Title</Text>,
    showLogout: true,
    customStyles: {
      headerStyle: {
        backgroundColor: '#e3f2fd',
      },
    },
  });

  // You can use these options in your screen's navigation options
  React.useLayoutEffect(() => {
    navigation.setOptions(headerOptions);
  }, [navigation]);

  return (
    <View>
      <Text>Your screen content here</Text>
    </View>
  );
};

// ===== EXAMPLE 6: Conditional Logout Button =====
export const ConditionalLogoutExample = ({ navigation, userRole }) => {
  const showLogout = userRole === 'admin' || userRole === 'user';
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AdminPanel" 
        component={AdminScreen} 
        options={({ navigation }) => getHeaderOptions(navigation, {
          showLogout: showLogout,
          title: <Text>Admin Panel</Text>,
        })}
      />
    </Stack.Navigator>
  );
};

// ===== EXAMPLE 7: Multiple Screens with Consistent Headers =====
export const ConsistentHeadersExample = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => getHeaderOptions(navigation, {
          headerBackVisible: false,
        })}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={({ navigation }) => getHeaderOptions(navigation, {
          headerBackTitle: 'Profile',
        })}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={({ navigation }) => getHeaderOptions(navigation, {
          headerBackTitle: 'Settings',
        })}
      />
    </Stack.Navigator>
  );
};
