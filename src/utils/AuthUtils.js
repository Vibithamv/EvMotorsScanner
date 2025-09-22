/**
 * Authentication Utilities
 * Helper functions for authentication-related operations
 */

import AuthService from '../services/AuthService';

export const AuthUtils = {
  /**
   * Check if user is authenticated and redirect accordingly
   * @param {Object} navigation - Navigation object
   * @param {string} authenticatedRoute - Route to navigate to if authenticated
   * @param {string} unauthenticatedRoute - Route to navigate to if not authenticated
   */
  async checkAuthAndRedirect(navigation, authenticatedRoute = 'Home', unauthenticatedRoute = 'Login') {
    try {
      const isAuthenticated = await AuthService.isAuthenticated();
      
      if (isAuthenticated) {
        navigation.replace(authenticatedRoute);
      } else {
        navigation.replace(unauthenticatedRoute);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // On error, default to unauthenticated route
      navigation.replace(unauthenticatedRoute);
    }
  },

  /**
   * Logout user and redirect to login
   * @param {Object} navigation - Navigation object
   */
  async logoutAndRedirect(navigation) {
    try {
      await AuthService.logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if logout fails, redirect to login
      navigation.replace('Login');
    }
  },

  /**
   * Get current user info
   * @returns {Object|null} User object or null
   */
  async getCurrentUserInfo() {
    try {
      return await AuthService.getCurrentUser();
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  },

  /**
   * Check if user has valid token
   * @returns {boolean} True if user has valid token
   */
  async hasValidToken() {
    try {
      const token = await AuthService.getToken();
      return token !== null && token !== undefined && token.length > 0;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  },
};

export default AuthUtils;
