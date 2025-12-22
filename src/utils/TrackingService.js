/**
 * Tracking Service - Handles App Tracking Transparency (ATT) for iOS
 * Requests user permission before tracking their activity across apps and websites
 */

import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Platform } from 'react-native';

class TrackingService {
  /**
   * Request tracking permission from the user
   * This will show the iOS ATT permission dialog
   * @returns {Promise<string>} Returns the tracking authorization status
   *   - 'granted': User granted permission
   *   - 'denied': User denied permission
   *   - 'restricted': Tracking is restricted (e.g., parental controls)
   *   - 'undetermined': User hasn't been asked yet
   *   - 'unavailable': ATT is not available (iOS < 14.5 or non-iOS)
   */
  async requestTrackingPermission() {
    try {
      // Only request on iOS 14.5+
      if (Platform.OS !== 'ios') {
        console.log('App Tracking Transparency is only available on iOS');
        return 'unavailable';
      }

      // Get current status first
      const currentStatus = await getTrackingPermissionsAsync();
      
      // If permission hasn't been determined, request it
      if (currentStatus.status === 'undetermined') {
        const result = await requestTrackingPermissionsAsync();
        console.log('Tracking permission result:', result);
        return result.status;
      }

      // Return current status
      return currentStatus.status;
    } catch (error) {
      console.error('Error requesting tracking permission:', error);
      return 'unavailable';
    }
  }

  /**
   * Get the current tracking permission status without requesting
   * @returns {Promise<string>} Current tracking authorization status
   */
  async getTrackingStatus() {
    try {
      if (Platform.OS !== 'ios') {
        return 'unavailable';
      }

      const status = await getTrackingPermissionsAsync();
      return status.status;
    } catch (error) {
      console.error('Error getting tracking status:', error);
      return 'unavailable';
    }
  }

  /**
   * Check if tracking is authorized
   * @returns {Promise<boolean>} True if tracking is authorized
   */
  async isTrackingAuthorized() {
    const status = await this.getTrackingStatus();
    return status === 'granted';
  }
}

// Export singleton instance
export default new TrackingService();
