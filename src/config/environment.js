// Environment configuration
// Change this value to switch between environments: 'dev', 'stage', 'prod'
export const CURRENT_ENVIRONMENT = 'dev';

// Environment-specific settings
export const ENVIRONMENT_CONFIG = {
  dev: {
    name: 'Development',
    baseURL: 'http://192.168.1.96:3000',
    timeout: 10000,
    debug: true,
  },
  stage: {
    name: 'Staging',
    baseURL: 'https://api-stage.evmotors.com',
    timeout: 15000,
    debug: true,
  },
  prod: {
    name: 'Production',
    baseURL: 'https://api.evmotors.com',
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
