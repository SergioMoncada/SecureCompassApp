import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';

// Configuración del manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function CompassScreen({ navigation }) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestNotificationPermission();
    _subscribe();
    return () => _unsubscribe();
  }, []);

  // Solicitar permiso de notificaciones
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
    } else {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos permiso para enviarte notificaciones de orientación.',
        [{ text: 'OK' }]
      );
    }
  };

  const _subscribe = () => {
    setSubscription(Magnetometer.addListener(result => setData(result)));
    Magnetometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const getAngle = () => {
    let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return Math.round(angle);
  };

  const getDirection = (degree) => {
    if (degree >= 337.5 || degree < 22.5) return 'Norte';
    if (degree >= 22.5 && degree < 67.5) return 'Noreste';
    if (degree >= 67.5 && degree < 112.5) return 'Este';
    if (degree >= 112.5 && degree < 157.5) return 'Sureste';
    if (degree >= 157.5 && degree < 202.5) return 'Sur';
    if (degree >= 202.5 && degree < 247.5) return 'Suroeste';
    if (degree >= 247.5 && degree < 292.5) return 'Oeste';
    return 'Noroeste';
  };

  const sendNotification = async () => {
    if (!permissionGranted) {
      Alert.alert('Sin permiso', 'No se puede enviar la notificación. Activa los permisos en configuración.');
      return;
    }
    const angle = getAngle();
    const direction = getDirection(angle);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📍 Orientación detectada',
        body: `Estás mirando hacia el ${direction} (${angle}°)`,
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.angle}>{getAngle()}°</Text>
      <Text style={styles.direction}>{getDirection(getAngle())}</Text>

      {/* Botón de notificación */}
      <TouchableOpacity style={styles.button} onPress={sendNotification}>
        <Text style={styles.buttonText}>📣 Notificar dirección</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Details')}>
        <Text style={styles.link}>Ver mi GPS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  angle: { fontSize: 80, fontWeight: 'bold' },
  direction: { fontSize: 30, color: 'gray', marginBottom: 40 },
  button: { backgroundColor: 'black', padding: 16, borderRadius: 10, marginBottom: 20, paddingHorizontal: 28 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  link: { color: 'blue', marginTop: 10 },
});