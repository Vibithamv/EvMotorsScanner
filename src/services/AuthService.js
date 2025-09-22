import { Auth } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../awsConfig';

class AuthService {
  async login(username, password) {
    try {
      const user = await Auth.signIn(username, password);
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      await AsyncStorage.setItem('cognitoToken', token);
      return { success: true, token };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  async logout() {
    try {
      await Auth.signOut();
      await AsyncStorage.removeItem('cognitoToken');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  async getToken() {
    return await AsyncStorage.getItem('cognitoToken');
  }
}

export default new AuthService();
