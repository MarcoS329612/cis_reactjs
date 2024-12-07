// File: src/styles/LoginStyles.js

import { StyleSheet } from 'react-native';

const LoginStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', // Alinea el contenido al inicio verticalmente
    backgroundColor: '#ffffff', // Fondo completamente blanco
    alignItems: 'center', // Centra los elementos horizontalmente
    paddingTop: 60, // Espacio desde la parte superior de la pantalla
  },
  logo: {
    width: 300, // Aumenta el ancho para un logo más grande
    height: 300, // Ajusta la altura según la relación de aspecto de tu logo
    marginBottom: 30, // Espacio entre el logo y el título
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20, // Reducir margen para compacidad
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%', // Asegura que los inputs ocupen todo el ancho disponible
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15, // Reducir margen para compacidad
    backgroundColor: '#fff',
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 15, // Reducir margen para compacidad
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10, // Espacio superior para separar el botón de los campos
  },
});

export default LoginStyles;
