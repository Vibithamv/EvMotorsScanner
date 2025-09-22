import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../awsConfig';

class AuthService {
  async login(username, password) {
    try {
      const { isSignedIn } = await signIn({
        username,
        password,
      });
      
      if (isSignedIn) {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (token) {
          await AsyncStorage.setItem('cognitoToken', token);
        }
        return { success: true, token };
      } else {
        return { success: false, error: 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  async logout() {
    try {
      await signOut();
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
