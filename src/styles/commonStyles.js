import { StyleSheet } from 'react-native';
import { Colors} from '../utils/AssetManager';


export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: Colors.background,
        justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  result: {
    fontSize: 18,
    color: "#fff",
    margin: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
});

// Theme colors
export const theme = {
  primary: '#005B9A',
  background: '#FFFFFF',
  text: '#333333',
  error: '#ff6b6b',
  cardBackground: '#1a1a1a',
  borderColor: '#333',
  textSecondary: '#ccc',
};
