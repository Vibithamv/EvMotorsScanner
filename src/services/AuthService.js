import AsyncStorage from "@react-native-async-storage/async-storage";
import { COGNITO_CONFIG } from "../config/cognito";

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
        return {
          success: false,
          error: errorData.message || "Invalid username or password",
        };
      }

      const authResult = await response.json();

      if (authResult.ChallengeName) {
        if (authResult.ChallengeName === "NEW_PASSWORD_REQUIRED") {
          return {
            success: false,
            error: "New password required. Please contact administrator.",
          };
        }
        return {
          success: false,
          error:
            "Additional authentication required. Please contact your administrator.",
        };
      }

      // Store the access token
      if (
        authResult.AuthenticationResult &&
        authResult.AuthenticationResult.AccessToken
      ) {
        console.log(
          "Login successful with token:",
          authResult.AuthenticationResult.AccessToken
        );
        await AsyncStorage.setItem(
          "cognitoToken",
          authResult.AuthenticationResult.AccessToken
        );
        return {
          success: true,
          token: authResult.AuthenticationResult.AccessToken,
        };
      }

      return { success: false, error: "Authentication failed" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: err.message || "Login failed" };
    }
  }

  async register(username, password, firstName, lastName) {
    try {
      const response = await fetch(
        `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
          },
          body: JSON.stringify({
            ClientId: COGNITO_CONFIG.userPoolWebClientId,
            Username: username, // e.g. email or phone
            Password: password,
            UserAttributes: [
              {
                Name: "email", // required if your pool uses email as username
                Value: username,
              },
              { Name: "name", Value: `${firstName} ${lastName}` },
              // Add more attributes if your pool requires them, e.g. phone_number
              // { Name: "phone_number", Value: "+911234567890" }
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Registration failed with status:", errorData.message);
        return {
          success: false,
          error: errorData.message || "Invalid username or password",
        };
      }

      const authResult = await response.json();
      console.log("Registration successful:", authResult.userID);

      // Store the access token
      if (authResult.UserSub) {
        await AsyncStorage.setItem("userID", authResult.UserSub);
        return {
          success: true,
          userID: authResult.UserSub,
        };
      }

      return { success: false, error: "Registration failed" };
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, error: err.message || "Registration failed" };
    }
  }

  async confirmRegister(username, confirmationCode) {
    try {
      const response = await fetch(
        `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
          },
          body: JSON.stringify({
            ClientId: COGNITO_CONFIG.userPoolWebClientId,
            Username: username, // e.g. email or phone
            ConfirmationCode: confirmationCode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "Invalid username or password",
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      console.error("Registration confirmation error:", err);
      return {
        success: false,
        error: err.message || "Registration confirmation failed",
      };
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem("cognitoToken");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  async getToken() {
    return await AsyncStorage.getItem("cognitoToken");
  }

  async isAuthenticated() {
    try {
      const token = await this.getToken();
      return token !== null && token !== undefined;
    } catch (err) {
      console.error("Error checking authentication status:", err);
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
      console.error("Error getting current user:", err);
      return null;
    }
  }
}

export default new AuthService();
