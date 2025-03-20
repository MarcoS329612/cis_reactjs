import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TextInput, Button, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, 
  ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
      await ScreenOrientation.unlockAsync(); // Permite orientación dinámica (vertical y horizontal)
    };
    enableOrientation();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Campos Vacíos', 'Por favor, ingresa tu nombre de usuario y contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear los datos en formato form-urlencoded exactamente como lo hace el navegador web
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      console.log('Enviando datos de autenticación:', {
        url: `${BASE_URL}/authenticate`,
        body: formData.toString()
      });
      
      // Hacer la petición al endpoint /authenticate como lo hace en el código del navegador
      const response = await fetch(`${BASE_URL}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });
      
      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

      // Si la respuesta no es exitosa, manejamos el error como lo hace el código del navegador
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', JSON.stringify(errorData));
        throw errorData; // Lanzamos el objeto de error directamente como en el código original
      }

      // Si todo es exitoso, parseamos la respuesta o redirigimos
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        console.log('Login exitoso:', data);
        
        // Si hay un token en la respuesta, lo guardamos
        if (data.access_token) {
          const token = data.access_token;
          const tokenType = data.token_type || 'Bearer';
          
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('tokenType', tokenType);
          
          axios.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;
        }
      } else {
        // Si no hay JSON, asumimos que la autenticación fue exitosa pero no devuelve datos
        console.log('Autenticación exitosa sin datos JSON');
      }

      // Navegamos al DashBoard
      navigation.navigate('DashBoard');
    } catch (err) {
      console.error('Error completo:', JSON.stringify(err));
      
      // Manejo de error similar al código del navegador
      let errorMessage = 'Error de autenticación';
      
      if (err && typeof err === 'object') {
        // Si err es un objeto, intentamos acceder a la propiedad detail
        if (err.detail) {
          errorMessage = err.detail;
        } else {
          // Si no tiene detail, mostramos el objeto completo como string
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20} // Ajusta según sea necesario
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={LoginStyles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={LoginStyles.container}>
            {/* Logo de la Empresa */}
            <Image
              source={{ uri: `${BASE_URL}/static/images/logo.jpg` }} // Asegúrate de que la ruta sea correcta
              style={LoginStyles.logo}
              resizeMode="contain" // Mantiene la relación de aspecto
            />

            <Text style={LoginStyles.title}>Iniciar Sesión</Text>

            <TextInput
              style={LoginStyles.input}
              placeholder="Nombre de Usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => { passwordInputRef.current.focus(); }}
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
              <ActivityIndicator size="large" color="#0000ff" style={LoginStyles.loader} />
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