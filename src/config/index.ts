const ENV = {
  development: {
    apiUrl: "http://localhost:8085/api",
    isDev: true,
  },
  staging: {
    apiUrl: "http://localhost:8085/api",
    isDev: false,
  },
  production: {
    apiUrl:  "http://localhost:8085/api",
    isDev: false,
  },
};

const getEnv = () => {
  return ENV.development;
};

export const Config = {
  ...getEnv(),
  appName: "Soundy",
};
