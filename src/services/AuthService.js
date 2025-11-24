import AsyncStorage from "@react-native-async-storage/async-storage";
import { COGNITO_CONFIG } from "../config/cognito";
import NetworkService from "./NetworkService";

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
        if (errorData.__type === "UserNotConfirmedException") {
          return {
            confirmedStatus: false,
          };
        }
        return {
          success: false,
          error: errorData.message || "Invalid username or password",
          confirmedStatus: true,
        };
      }

      const authResult = await response.json();

      if (authResult.ChallengeName) {
        if (authResult.ChallengeName === "NEW_PASSWORD_REQUIRED") {
          return {
            success: false,
            error: "New password required. Please contact administrator.",
            confirmedStatus: true,
          };
        }
        return {
          success: false,
          error:
            "Additional authentication required. Please contact your administrator.",
          confirmedStatus: true,
        };
      }

      // Store the access token
      if (
        authResult.AuthenticationResult &&
        authResult.AuthenticationResult.AccessToken &&
        authResult.AuthenticationResult.RefreshToken
      ) {
        console.log(
          "Login successful with token:",
          authResult.AuthenticationResult.AccessToken
        );
        await AsyncStorage.setItem(
          "cognitoToken",
          authResult.AuthenticationResult.AccessToken
        );
        await AsyncStorage.setItem(
          "cognitoRefreshToken",
          authResult.AuthenticationResult.RefreshToken
        );
        return {
          success: true,
          token: authResult.AuthenticationResult.AccessToken,
          confirmedStatus: true,
        };
      }

      return {
        success: false,
        error: "Authentication failed",
        confirmedStatus: true,
      };
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
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Registration failed with status:", errorData);
        if (errorData.__type === "UsernameExistsException") {
          const userStatus = await this.login(username, password);
          if (!userStatus.confirmedStatus) {
            const result = await this.resendConfirmationCode(username);
            if (result.success) {
              return {
                confirmCodePopup: true,
              };
            } else {
              return {
                success: false,
                error: result.error,
              };
            }
          } else {
            return {
              navigateToLogin: true,
            };
          }
        }
        return {
          success: false,
          error: errorData.message,
        };
      }

      const authResult = await response.json();
      console.log("Registration successful:", authResult.UserSub);

      // Store the access token
      if (authResult.UserSub) {
        await NetworkService.storeData("userID", authResult.UserSub);
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
        console.error("Registration confirmation failed:", "");
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message,
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

  async resendConfirmationCode(username) {
    try {
      const response = await fetch(
        `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target":
              "AWSCognitoIdentityProviderService.ResendConfirmationCode",
          },
          body: JSON.stringify({
            ClientId: COGNITO_CONFIG.userPoolWebClientId,
            Username: username, // e.g. email or phone
          }),
        }
      );

      if (!response.ok) {
        console.error("Resend confirmation code failed:", "");
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message,
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      console.error("Resend confirmation code error:", err);
      return {
        success: false,
        error: err.message || "Resend confirmation code failed",
      };
    }
  }

  async refreshAccessToken() {
    const refreshToken = await AsyncStorage.getItem("cognitoRefreshToken");
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
            AuthFlow: "REFRESH_TOKEN_AUTH",
            ClientId: COGNITO_CONFIG.userPoolWebClientId,
            AuthParameters: {
              REFRESH_TOKEN: refreshToken,
            },
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        const errorType = data.__type || data.code || "";
        if (
          errorType.includes("NotAuthorizedException") ||
          errorType.includes("ExpiredTokenException")
        ) {
          return {
            success: false,
            expired: true,
            error: "Refresh token expired",
          };
        }
        return {
          success: false,
          error: data.message || "Token refresh failed",
        };
      }

      if (data.AuthenticationResult && data.AuthenticationResult.AccessToken) {
        await AsyncStorage.setItem(
          "cognitoToken",
          data.AuthenticationResult.AccessToken
        );
        console.log("Tokens refreshed successfully");
        return {
          success: true,
          accessToken: data.AuthenticationResult.AccessToken,
        };
      }

      return { success: false, error: "No new token generated" };
    } catch (err) {
      console.error("Token refresh error:", err);
      return {
        success: false,
        error: err.message || "Token refresh failed",
      };
    }
  }

  isAccessTokenExpired = async () => {
    const token = await AsyncStorage.getItem("cognitoToken");

    if (!token) return true;
    try {
      const [, payload] = token.split(".");
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      console.log('detecting....', exp +' '+now)
      return exp < now;
    } catch (error) {
      return true; // treat as expired if invalid
    }
  };

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
