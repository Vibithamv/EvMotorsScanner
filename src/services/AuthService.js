import AsyncStorage from '@react-native-async-storage/async-storage';
import { COGNITO_CONFIG } from '../config/cognito';

class AuthService {
  async login(username, password) {
    try {
      const response = await fetch(
        `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
          },
          body: JSON.stringify({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: COGNITO_CONFIG.userPoolWebClientId,
            AuthParameters: {
              USERNAME: username,
              PASSWORD: password,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || "Invalid username or password" };
      }

      const authResult = await response.json();

      if (authResult.ChallengeName) {
        if (authResult.ChallengeName === "NEW_PASSWORD_REQUIRED") {
          return { success: false, error: "New password required. Please contact administrator." };
        }
        return { success: false, error: "Additional authentication required. Please contact your administrator." };
      }

      // Store the access token
      if (authResult.AuthenticationResult && authResult.AuthenticationResult.AccessToken) {
        await AsyncStorage.setItem('cognitoToken', authResult.AuthenticationResult.AccessToken);
        return { success: true, token: authResult.AuthenticationResult.AccessToken };
      }

      return { success: false, error: "Authentication failed" };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem('cognitoToken');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  async getToken() {
    return await AsyncStorage.getItem('cognitoToken');
  }

  async isAuthenticated() {
    try {
      const token = await this.getToken();
      return token !== null && token !== undefined;
    } catch (err) {
      console.error('Error checking authentication status:', err);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      const token = await this.getToken();
      if (token) {
        // You can decode the JWT token here to get user info
        // For now, we'll just return a basic user object
        return {
          isAuthenticated: true,
          token: token,
        };
      }
      return null;
    } catch (err) {
      console.error('Error getting current user:', err);
      return null;
    }
  }
}

export default new AuthService();
