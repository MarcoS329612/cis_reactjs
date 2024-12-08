// styles/TakePhotoStyles.js
import { StyleSheet } from 'react-native';

export const TakePhotoStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: '#0056b3',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default TakePhotoStyles;
