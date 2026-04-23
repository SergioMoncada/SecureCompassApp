import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen({ navigation }) {
  const handleAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return Alert.alert("Error", "Tu dispositivo no soporta biometría");

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Desbloquea la Brújula",
      fallbackLabel: "Usar contraseña",
    });

    if (result.success) {
      navigation.replace('Compass');
    } else {
      Alert.alert("Acceso denegado");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧭 SecureCompass</Text>
      <Button title="Ingresar con FaceID / Huella" onPress={handleAuth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, marginBottom: 20 }
});
