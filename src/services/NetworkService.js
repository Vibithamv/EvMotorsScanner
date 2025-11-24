import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CURRENT_ENVIRONMENT, ENVIRONMENT_CONFIG } from "../config/environment";

class NetworkService {
  constructor() {
    this.environment = CURRENT_ENVIRONMENT; // Use environment from config
    this.baseURL = ENVIRONMENT_CONFIG[this.environment].baseURL;
    this.timeout = ENVIRONMENT_CONFIG[this.environment].timeout;

    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to attach auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem("cognitoToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error getting auth token:", error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set the environment (dev, stage, prod)
   * @param {string} env - Environment name
   */
  setEnvironment(env) {
    if (ENVIRONMENT_CONFIG[env]) {
      this.environment = env;
      this.baseURL = ENVIRONMENT_CONFIG[env].baseURL;
      this.timeout = ENVIRONMENT_CONFIG[env].timeout;
      this.api.defaults.baseURL = this.baseURL;
      this.api.defaults.timeout = this.timeout;
    } else {
      console.warn(`Invalid environment: ${env}. Using default: dev`);
    }
  }

  /**
   * Get current environment
   * @returns {string} Current environment
   */
  getEnvironment() {
    return this.environment;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @param {object} config - Additional axios config
   * @returns {Promise} API response
   */
  async get(endpoint, params = {}, config = {}) {
    console.log(`GET Request to ${endpoint} with params:`, params);
    try {
      const response = await this.api.get(endpoint, {
        params,
        ...config,
      });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} config - Additional axios config
   * @returns {Promise} API response
   */
  async post(endpoint, data = {}, config = {}) {
    console.log(`POST Request to ${endpoint} with params:`, data);
    try {
      const response = await this.api.post(endpoint, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} config - Additional axios config
   * @returns {Promise} API response
   */
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await this.api.put(endpoint, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} config - Additional axios config
   * @returns {Promise} API response
   */
  async delete(endpoint, config = {}) {
    try {
      const response = await this.api.delete(endpoint, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  }

  /**
   * Store data in AsyncStorage
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   */
  async storeData(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
    }
  }

  /**
   * Retrieve data from AsyncStorage
   * @param {string} key - Storage key
   * @returns {any} Stored data or null
   */
  async getStoredData(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from AsyncStorage
   * @param {string} key - Storage key
   */
  async removeStoredData(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
    }
  }
}

// Export singleton instance
export default new NetworkService();
