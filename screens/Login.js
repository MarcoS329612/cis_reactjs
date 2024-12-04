import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Login() {
  useEffect(() => {
    const enableOrientation = async () => {
      await ScreenOrientation.unlockAsync(); // Permite orientación dinámica (vertical y horizontal)
    };
    enableOrientation();
  }, []);

  return (
    <View>
      <Text></Text>
    </View>
  );
}
