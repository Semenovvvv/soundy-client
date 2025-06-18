interface Config {
  API_URL: string;
  MEDIA_URL: string;
}

const ENV_API_URL = import.meta.env.VITE_API_URL;
const ENV_MEDIA_URL = import.meta.env.VITE_MEDIA_URL;

const development: Config = {
  API_URL: 'http://localhost:8085/api',
  MEDIA_URL: 'http://localhost:8085/api/file'
};

const production: Config = {
  API_URL: 'http://45.10.110.152:8085/api',
  MEDIA_URL: 'http://45.10.110.152:8085/api/file'
};

const isProduction = () => {
  if (import.meta.env.PROD) {
    return true;
  }

  if (window.location.hostname === 'http://45.10.110.152/' ||
      !window.location.hostname.includes('localhost')) {
    return true;
  }

  return false;
};

const config: Config = {
  API_URL: ENV_API_URL || (isProduction() ? production.API_URL : development.API_URL),
  MEDIA_URL: ENV_MEDIA_URL || (isProduction() ? production.MEDIA_URL : development.MEDIA_URL)
};

export default config;
