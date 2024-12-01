// TakePhoto.js

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import TakePhotoStyles from '../styles/TakePhotoStyles';

export default function TakePhoto({ navigation }) {
  const [facing, setFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);

  if (!cameraPermission || !mediaPermission) {
    return <View />;
  }

  if (!cameraPermission.granted || !mediaPermission.granted) {
    return (
      <View style={TakePhotoStyles.container}>
        <Text style={TakePhotoStyles.message}>
          Necesitamos tu permiso para usar la cámara y guardar fotos
        </Text>
        <TouchableOpacity
          style={TakePhotoStyles.button}
          onPress={() => {
            requestCameraPermission();
            requestMediaPermission();
          }}
        >
          <Text style={TakePhotoStyles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
        });

        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        await MediaLibrary.createAlbumAsync('MyAppPhotos', asset, false);
        Alert.alert('Éxito', '¡Foto guardada en la galería!');
        navigation.goBack();
      } catch (error) {
        console.log(error);
      }
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        ref={cameraRef}
        mode="picture"
      >
        <View style={TakePhotoStyles.buttonContainer}>
          <TouchableOpacity style={TakePhotoStyles.button} onPress={toggleCameraFacing}>
            <Text style={TakePhotoStyles.buttonText}>Cambiar Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={TakePhotoStyles.button} onPress={takePicture}>
            <Text style={TakePhotoStyles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={TakePhotoStyles.button} onPress={() => navigation.goBack()}>
            <Text style={TakePhotoStyles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
