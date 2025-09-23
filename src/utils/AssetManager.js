/**
 * Asset Manager - Centralized asset management for the EvMotorsScanner app
 * Provides a single point of access for all images, fonts, and other assets
 */

// ===== IMAGES =====
export const Images = {
  // Logo assets
  logoIcon: require('../../assets/logo_icon.png'),
  evmotorsLogo: require('../../assets/evmotors_logo.png'),
  backgroundLogo: require('../../assets/background_logo.png'),
  
  // UI assets
  eye: require('../../assets/eye.png'),
  favicon: require('../../assets/favicon.png'),
};

// ===== FONTS =====
export const Fonts = {
  // Instrument Sans font family
  instrumentSansRegular: require('../../assets/fonts/InstrumentSans-Regular.ttf'),
  instrumentSansBold: require('../../assets/fonts/InstrumentSans-Bold.ttf'),
};

// ===== FONT CONFIGURATIONS =====
export const FontConfig = {
  // Font family names for use in styles
  families: {
    regular: 'InstrumentSans-Regular',
    bold: 'InstrumentSans-Bold',
  },
  
  // Font sizes
  sizes: {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    size_20: 20,
    xxlarge: 24,
    xxxlarge: 32,
  },
  
  // Font weights
  weights: {
    normal: '400',
    bold: '700',
  },
};

// ===== THEME COLORS =====
export const Colors = {
  // Primary brand colors
  primary: '#005B9A',
  secondary: '#45BC50',
  
  // Background colors
  background: '#0E1325',
  cardBackground: '#162142',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#5F6B91',
  textMuted: '#666666',
  
  // Status colors
  error: '#FF6B6B',
  success: '#45BC50',
  warning: '#FFA500',
  info: '#005B9A',
  
  // UI colors
  border: '#5F6B91',
  placeholder: '#5F6B91',
};

// ===== COMMON STYLES =====
export const CommonStyles = {
  // Container styles
  container: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  
  // Button styles
  primaryButton: {
    height: 44,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  primaryButtonText: {
    color: '#000000',
    fontSize: FontConfig.sizes.medium,
    fontWeight: FontConfig.weights.bold,
    textAlign: 'center',
    fontFamily: FontConfig.families.bold,
  },
  
  // Input styles
  input: {
    height: 44,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: Colors.cardBackground,
  },
  
  // Text styles
  label: {
    fontSize: FontConfig.sizes.medium,
    color: Colors.text,
    marginBottom: 5,
    fontFamily: FontConfig.families.regular,
  },
  
  errorText: {
    fontSize: FontConfig.sizes.medium,
    color: Colors.error,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FontConfig.families.regular,
  },
  
  // Header styles
  header1: {
    fontSize: FontConfig.sizes.xxxlarge,
    fontWeight: FontConfig.weights.bold,
    color: Colors.text,
    fontFamily: FontConfig.families.bold,
  },
  splashHeader1: {
    fontSize: FontConfig.sizes.size_20,
    fontWeight: FontConfig.weights.bold,
    color: Colors.text,
    fontFamily: FontConfig.families.bold,
  },
  
  header2: {
    fontSize: FontConfig.sizes.xxxlarge,
    fontWeight: FontConfig.weights.normal,
    color: Colors.secondary,
    fontFamily: FontConfig.families.regular,
  },
    splashHeader2: {
    fontSize: FontConfig.sizes.size_20,
    fontWeight: FontConfig.weights.bold,
    color: Colors.secondary,
    fontFamily: FontConfig.families.bold,
  },
  
  // Logo styles
  logo: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    position: 'absolute',
    top: 56,
  },
  evmotorsLogo:{
    height:73,
    width:322,
    // alignSelf: 'center',
    // position: 'absolute',
   // top:100
  },
  
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 20,
    color: Colors.textMuted,
    fontSize: FontConfig.sizes.small,
    alignSelf: 'center',
    fontFamily: FontConfig.families.regular,
  },
};

// ===== ASSET HELPER FUNCTIONS =====
export const AssetHelpers = {
  /**
   * Get font configuration for use with expo-font
   * @returns {Object} Font configuration object
   */
  getFontConfig: () => ({
    [FontConfig.families.regular]: Fonts.instrumentSansRegular,
    [FontConfig.families.bold]: Fonts.instrumentSansBold,
  }),
  
  /**
   * Get image source by name
   * @param {string} imageName - Name of the image from Images object
   * @returns {Object} Image source object
   */
  getImage: (imageName) => {
    if (!Images[imageName]) {
      console.warn(`Image '${imageName}' not found in AssetManager`);
      return null;
    }
    return Images[imageName];
  },
  
  /**
   * Get color by name
   * @param {string} colorName - Name of the color from Colors object
   * @returns {string} Color value
   */
  getColor: (colorName) => {
    if (!Colors[colorName]) {
      console.warn(`Color '${colorName}' not found in AssetManager`);
      return Colors.text; // fallback color
    }
    return Colors[colorName];
  },
  
  /**
   * Get font size by name
   * @param {string} sizeName - Name of the font size from FontConfig.sizes
   * @returns {number} Font size value
   */
  getFontSize: (sizeName) => {
    if (!FontConfig.sizes[sizeName]) {
      console.warn(`Font size '${sizeName}' not found in AssetManager`);
      return FontConfig.sizes.medium; // fallback size
    }
    return FontConfig.sizes[sizeName];
  },
};

// ===== EXPORT ALL ASSETS =====
export default {
  Images,
  Fonts,
  FontConfig,
  Colors,
  CommonStyles,
  AssetHelpers,
};
