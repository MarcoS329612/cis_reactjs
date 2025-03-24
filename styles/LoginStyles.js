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
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '70%',       // El botón ocupa el 70% del ancho
    alignSelf: 'center', // Centrado horizontalmente
    marginTop: 20,       // Mayor separación respecto a los inputs
  },
});

export default LoginStyles;
