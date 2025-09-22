/**
 * AssetManager Usage Examples
 * This file demonstrates how to use the AssetManager in your components
 */

import { Images, Fonts, Colors, CommonStyles, AssetHelpers } from './AssetManager';

// ===== EXAMPLE 1: Using Images =====
export const ImageExample = () => {
  return (
    <View>
      {/* Direct access to images */}
      <Image source={Images.logoIcon} style={{ width: 50, height: 50 }} />
      <Image source={Images.backgroundLogo} style={{ width: 100, height: 100 }} />
      
      {/* Using helper function */}
      <Image source={AssetHelpers.getImage('evmotorsLogo')} style={{ width: 75, height: 75 }} />
    </View>
  );
};

// ===== EXAMPLE 2: Using Colors =====
export const ColorExample = () => {
  return (
    <View style={{ backgroundColor: Colors.background }}>
      <Text style={{ color: Colors.text }}>Primary text</Text>
      <Text style={{ color: Colors.textSecondary }}>Secondary text</Text>
      <Text style={{ color: Colors.error }}>Error text</Text>
      
      {/* Using helper function */}
      <Text style={{ color: AssetHelpers.getColor('success') }}>Success text</Text>
    </View>
  );
};

// ===== EXAMPLE 3: Using Common Styles =====
export const StyleExample = () => {
  return (
    <View style={CommonStyles.container}>
      <Text style={CommonStyles.header1}>Main Header</Text>
      <Text style={CommonStyles.label}>Form Label</Text>
      
      <TouchableOpacity style={CommonStyles.primaryButton}>
        <Text style={CommonStyles.primaryButtonText}>Click Me</Text>
      </TouchableOpacity>
    </View>
  );
};

// ===== EXAMPLE 4: Using Fonts with expo-font =====
import * as Font from 'expo-font';

export const FontExample = () => {
  const [fontsLoaded] = Font.useFonts(AssetHelpers.getFontConfig());
  
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  
  return (
    <View>
      <Text style={{ fontFamily: 'InstrumentSans-Regular' }}>Regular text</Text>
      <Text style={{ fontFamily: 'InstrumentSans-Bold' }}>Bold text</Text>
    </View>
  );
};

// ===== EXAMPLE 5: Custom Styles Using AssetManager =====
import { StyleSheet } from 'react-native';

const customStyles = StyleSheet.create({
  customButton: {
    ...CommonStyles.primaryButton,
    backgroundColor: Colors.secondary,
    borderRadius: 8, // Override the common style
  },
  
  customText: {
    ...CommonStyles.label,
    fontSize: AssetHelpers.getFontSize('large'),
    color: Colors.primary,
  },
  
  customContainer: {
    ...CommonStyles.container,
    paddingTop: 20, // Add additional styling
  },
});

// ===== EXAMPLE 6: Dynamic Asset Access =====
export const DynamicAssetExample = ({ imageName, colorName }) => {
  const imageSource = AssetHelpers.getImage(imageName);
  const colorValue = AssetHelpers.getColor(colorName);
  
  return (
    <View style={{ backgroundColor: colorValue }}>
      {imageSource && <Image source={imageSource} style={{ width: 50, height: 50 }} />}
    </View>
  );
};

// ===== EXAMPLE 7: Theme-based Styling =====
export const ThemeExample = () => {
  const isDarkMode = true; // This could come from a context or state
  
  const dynamicColors = {
    background: isDarkMode ? Colors.background : '#FFFFFF',
    text: isDarkMode ? Colors.text : '#000000',
  };
  
  return (
    <View style={{ backgroundColor: dynamicColors.background }}>
      <Text style={{ color: dynamicColors.text }}>Dynamic themed text</Text>
    </View>
  );
};
