// App.tsx

import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation/index';
import TrackingService from './src/utils/TrackingService';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';

// Configure global polyfills for amazon-cognito-identity-js
global.Buffer = Buffer;

// Set up crypto polyfill
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (arr) => require('react-native-get-random-values').getRandomValues(arr),
  };
}

// Additional polyfills for Cognito
global.process = global.process || { env: {} };

export default function App() {
  useEffect(() => {
    // Request App Tracking Transparency permission on app launch
    // This is required for iOS apps that track users across apps and websites
    TrackingService.requestTrackingPermission().catch((error) => {
      console.error('Failed to request tracking permission:', error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
