const config = {
    development: {
      baseURL: 'https://ca3d-2806-108e-d-8bfe-342f-69ad-a193-e74f.ngrok-free.app', //URL para pruebas locales http://192.168.1.91:8000

    },
    production: {
      baseURL: 'https://api.tuendpoint.com', // URL en el servidor
    },
  };
  
  const ENV = process.env.NODE_ENV || 'development'; // Detecta el entorno actual
  
  export const BASE_URL = config[ENV].baseURL; // Exporta la URL base del entorno
  