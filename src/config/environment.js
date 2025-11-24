// Environment configuration
// The environment is determined by the `__DEV__` global variable
export const CURRENT_ENVIRONMENT = __DEV__ ? 'dev' : 'prod';

// Environment-specific settings
export const ENVIRONMENT_CONFIG = {
  dev: {
    name: 'Development',
    baseURL: 'https://devinventory.evmotors.com/api',
    timeout: 10000,
    debug: true,
  },
  stage: {
    name: 'Staging',
    baseURL: 'https://devinventory.evmotors.com/api',
    timeout: 15000,
    debug: true,
  },
  prod: {
    name: 'Production',
    baseURL: 'https://devinventory.evmotors.com/api',
    timeout: 15000,
    debug: false,
  },
};

// Helper function to get current environment config
export const getCurrentEnvironmentConfig = () => {
  return ENVIRONMENT_CONFIG[CURRENT_ENVIRONMENT] || ENVIRONMENT_CONFIG.dev;
};

// Helper function to check if we're in development
export const isDevelopment = () => {
  return CURRENT_ENVIRONMENT === 'dev';
};

// Helper function to check if we're in production
export const isProduction = () => {
  return CURRENT_ENVIRONMENT === 'prod';
};
