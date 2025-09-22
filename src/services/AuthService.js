import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COGNITO_CONFIG } from '../config/cognito';

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.userPoolId,
  ClientId: COGNITO_CONFIG.userPoolWebClientId,
});

class AuthService {
  async login(username, password) {
    return new Promise((resolve) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result) => {
          try {
            const token = result.getIdToken().getJwtToken();
            await AsyncStorage.setItem('cognitoToken', token);
            resolve({ success: true, token });
          } catch (err) {
            resolve({ success: false, error: 'Failed to store token' });
          }
        },
        onFailure: (err) => {
          resolve({ success: false, error: err.message || 'Login failed' });
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          resolve({ success: false, error: 'New password required. Please contact administrator.' });
        },
      });
    });
  }

  async logout() {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
      }
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
