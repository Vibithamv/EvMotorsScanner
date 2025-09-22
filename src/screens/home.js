// screens/HomeScreen.tsx

import { View, StyleSheet } from 'react-native';

import { Button } from 'react-native-paper';

export default function HomeScreen({navigation}) {

      const newScan = () => {
navigation.navigate('NewScan')
      };

  return (
    <View style={styles.container}>
       <Button
        mode="contained"
        onPress={newScan}
        //loading={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        New Scan
      </Button>
        <Button
        mode="contained"
       // onPress={onLogin}
       // loading={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Scan History
      </Button>
    </View>
  );
}

// Theme colors
const theme = {
  primary: '#005B9A',  // replace with EV Motors primary color
  background: '#FFFFFF',
  text: '#333333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.background,
    justifyContent: 'center',
  },
    button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    marginBottom:20
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
