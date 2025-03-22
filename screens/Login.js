import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import LoginStyles from '../styles/LoginStyles';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Referencia para el campo de contraseña
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const enableOrientation = async () => {
      await ScreenOrientation.unlockAsync();
    };
    enableOrientation();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert(
        'Campos Vacíos',
        'Por favor, ingresa tu nombre de usuario y contraseña.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear datos en formato form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      console.log('Enviando datos de autenticación:', {
        url: `${BASE_URL}/authenticate`,
        body: formData.toString(),
      });

      // Llamada al endpoint /authenticate
      const response = await fetch(`${BASE_URL}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', JSON.stringify(errorData));
        throw errorData;
      }

      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        console.log('Login exitoso:', data);

        if (data.access_token) {
          const token = data.access_token;
          const tokenType = data.token_type || 'Bearer';

          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('tokenType', tokenType);
          axios.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;
        }
      } else {
        console.log('Autenticación exitosa sin datos JSON');
      }

      navigation.navigate('DashBoard');
    } catch (err) {
      console.error('Error completo:', JSON.stringify(err));
      let errorMessage = 'Error de autenticación';
      if (err && typeof err === 'object') {
        if (err.detail) {
          errorMessage = err.detail;
        } else {
          errorMessage = JSON.stringify(err);
        }
      }
      setError(errorMessage);
      Alert.alert('Error de autenticación', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={LoginStyles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={LoginStyles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={LoginStyles.container}>
            <Image
              source={{ uri: `${BASE_URL}/static/images/logo.jpg` }}
              style={LoginStyles.logo}
              resizeMode="contain"
            />

            <Text style={LoginStyles.title}>Iniciar Sesión</Text>

            <TextInput
              style={LoginStyles.input}
              placeholder="Nombre de Usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              style={LoginStyles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              ref={passwordInputRef}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {error && <Text style={LoginStyles.errorText}>{error}</Text>}

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={LoginStyles.loader}
              />
            ) : (
              <View style={LoginStyles.buttonContainer}>
                <Button title="Iniciar Sesión" onPress={handleLogin} />
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
