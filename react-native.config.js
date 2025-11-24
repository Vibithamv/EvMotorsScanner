module.exports = {
  dependencies: {
    '@react-native-async-storage/async-storage': {
      platforms: {
        android: {
          // cmake: false, // disable CMake autolinking
        },
      },
    },
    'react-native-vector-icons': {
      platforms: {
        android: {
          // cmake: false,
        },
      },
    },
  },
};
