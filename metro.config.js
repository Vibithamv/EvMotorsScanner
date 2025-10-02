// Change: Import the configuration utility from 'expo/metro-config'
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname); // Get the Expo-specific default config

// If you had any custom configurations, you would merge them here:
/*
config.resolver.unstable_enablePackageExports = true;
*/

module.exports = config;