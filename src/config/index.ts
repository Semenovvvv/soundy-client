interface Config {
  API_URL: string;
  MEDIA_URL: string;
}

// Environment variables from Vite if available
const ENV_API_URL = import.meta.env.VITE_API_URL;
const ENV_MEDIA_URL = import.meta.env.VITE_MEDIA_URL;

const development: Config = {
  API_URL: 'http://localhost:8085/api',
  MEDIA_URL: 'http://localhost:8085/api/file'
};

const production: Config = {
  API_URL: 'http://http://45.10.110.152/:8085/api',
  MEDIA_URL: 'http://http://45.10.110.152/:8085/api/file'
};

// Determine the environment based on the URL or other environment variables
const isProduction = () => {
  // Check if environment is explicitly set
  if (import.meta.env.PROD) {
    return true;
  }
  
  // Check if running on production URL
  if (window.location.hostname === 'http://45.10.110.152/' || 
      !window.location.hostname.includes('localhost')) {
    return true;
  }
  
  return false;
};

// Use environment variables if provided, otherwise use defaults
const config: Config = {
  API_URL: ENV_API_URL || (isProduction() ? production.API_URL : development.API_URL),
  MEDIA_URL: ENV_MEDIA_URL || (isProduction() ? production.MEDIA_URL : development.MEDIA_URL)
};

export default config;
