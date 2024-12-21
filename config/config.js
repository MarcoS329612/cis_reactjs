const config = {
    development: {
      baseURL: 'http://192.168.2.26:8080', //URL para pruebas locales http://192.168.1.91:8000
    },
    production: {
      baseURL: 'http://192.168.2.26:8080', // URL en el servidor
    },
  };
  
  const ENV = process.env.NODE_ENV || 'development'; // Detecta el entorno actual
  
  export const BASE_URL = config[ENV].baseURL; // Exporta la URL base del entorno
  