// App.tsx

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Navigation from './src/navigation/index';
// import "./amplifyConfig";
// import "react-native-get-random-values";
// import "react-native-url-polyfill/auto";
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';

global.Buffer = Buffer;
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (arr) => require('react-native-get-random-values').getRandomValues(arr),
  };
}

export default function App() {
  return (
    <PaperProvider>
      <Navigation />
    </PaperProvider>
  );
}
