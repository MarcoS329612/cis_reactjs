import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as ScreenOrientation from 'expo-screen-orientation';
import { BASE_URL } from '../config/config';

export default function TakePhoto({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const enableOrientation = async () => {
      await ScreenOrientation.unlockAsync(); // Permitir ambas orientaciones
    };
    enableOrientation();
  }, []);

  useEffect(() => {
    // Solicitar permisos de cámara y galería
    (async () => {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraPerm.status === 'granted' && mediaPerm.status === 'granted') {
        setHasPermission(true);
      } else {
        Alert.alert('Permisos necesarios', 'No se concedieron los permisos necesarios.');
        navigation.goBack();
      }
    })();
  }, []);

  // Cuando tengamos permiso, tomar la foto automáticamente
  useEffect(() => {
    if (hasPermission) {
      takePicture();
    }
  }, [hasPermission]);

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
        base64: false
      });

      // Si el usuario cancela la captura, regresar
      if (result.canceled) {
        navigation.goBack();
        return;
      }

      const uri = result.assets[0].uri;

      // Guardar la imagen en la galería
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('MyAppPhotos', asset, false);

      // Enviar la imagen al endpoint /ocr
      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'photo.jpg'
      });

      const response = await fetch(`${BASE_URL}/ocr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      if (!response.ok) {
        Alert.alert('Error', 'Hubo un problema al procesar la imagen.');
        navigation.goBack();
        return;
      }

      const jsonResponse = await response.json();
      
      // Navegar de vuelta al dashboard con el resultado OCR
      navigation.navigate('DashBoard', { ocrText: jsonResponse });


    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al procesar la imagen.');
      navigation.goBack();
    }
  };

  // Mientras se esperan permisos o se está en proceso, se puede mostrar un indicador de carga
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
  
}