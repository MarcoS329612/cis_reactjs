// config/config.js
export const config = {
  development: {
    baseURL: 'http://192.168.1.137:8000',
  },
  production: {
    baseURL: 'http://192.168.2.x:8080',
  },
};

export const ENV = process.env.NODE_ENV || 'development';
export const BASE_URL = config[ENV].baseURL;

