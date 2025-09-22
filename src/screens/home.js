// screens/HomeScreen.tsx

import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors, CommonStyles } from '../utils/AssetManager';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
