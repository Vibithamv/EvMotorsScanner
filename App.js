// App.tsx

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Navigation from './src/navigation/index';
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
  return (
    <PaperProvider>
      <Navigation />
    </PaperProvider>
  );
}
