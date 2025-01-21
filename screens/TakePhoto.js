import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as ScreenOrientation from 'expo-screen-orientation';
import ConsoleMessages from '../screens/ConsoleMessages';
import styles from '../styles/TakePhotoStyles';

export default function TakePhoto({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(false);
  const baseUrl = route.params?.baseUrl;  
  const consoleRef = useRef();
  
  const selectedJob = route.params?.selectedJob;
  const selectedStage = route.params?.selectedStage;

  useEffect(() => {
    const enableOrientation = async () => {
      await ScreenOrientation.unlockAsync();
    };
    enableOrientation();
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
        const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraPerm.status === 'granted' && mediaPerm.status === 'granted') {
          setHasPermission(true);
        } else {
          consoleRef.current?.addMessage('Permissions denied');
          Alert.alert('Permisos necesarios', 'No se concedieron los permisos necesarios.');
          navigation.goBack();
        }
      } catch (error) {
        consoleRef.current?.addMessage('Error requesting permissions: ' + error.message);
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      consoleRef.current?.addMessage('Starting camera...');
      takePicture();
    }
  }, [hasPermission]);

  const takePicture = async () => {
    if (!baseUrl) {
      consoleRef.current?.addMessage('Error: BASE_URL not available');
      Alert.alert('Error', 'Configuration error: BASE_URL not found');
      navigation.goBack();
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'], // Actualizado: ya no usa MediaTypeOptions
        allowsEditing: false,
        quality: 1,
        base64: false,
      });

      if (result.canceled) {
        consoleRef.current?.addMessage('Camera capture cancelled by user');
        navigation.goBack();
        return;
      }

      const uri = result.assets[0].uri;
      consoleRef.current?.addMessage('Image captured successfully');

      // Guardar la imagen en la galería
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('MyAppPhotos', asset, false);
      consoleRef.current?.addMessage('Image saved to gallery');

      // Enviar la imagen al endpoint /ocr usando la baseUrl dinámica
      consoleRef.current?.addMessage('Sending image for OCR processing...');
      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      try {
        const response = await fetch(`${baseUrl}/ocr`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        consoleRef.current?.addMessage('OCR processing completed successfully');
        
        navigation.navigate('DashBoard', {
          ocrText: jsonResponse,
          selectedJob: selectedJob,
          selectedStage: selectedStage,
          fromCamera: true,
          baseUrl,
        });
      } catch (networkError) {
        consoleRef.current?.addMessage('Network error: ' + networkError.message);
        Alert.alert('Error de red', 'Hubo un problema al procesar la imagen. Por favor, inténtelo de nuevo.');
        navigation.goBack();
      }
    } catch (error) {
      consoleRef.current?.addMessage('Error: ' + error.message);
      console.log(error);
      Alert.alert('Error', 'There was a problem processing the image.');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      <ConsoleMessages ref={consoleRef} />
    </View>
  );
}