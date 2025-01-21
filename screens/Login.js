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
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });

      console.log('Login exitoso:', response.data);

      // Asumiendo que recibes un token o algún identificador
      const { token } = response.data;

      // Guarda el token en AsyncStorage para persistencia
      await AsyncStorage.setItem('userToken', token);

      // Configura axios para incluir el token en las solicitudes futuras
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Navega al DashBoard después de un inicio de sesión exitoso
      navigation.navigate('DashBoard');
    } catch (err) {
      console.error('Error en el inicio de sesión:', err);
      setError('Credenciales inválidas. Por favor, intenta nuevamente.');
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
