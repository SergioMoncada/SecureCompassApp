import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';

export default function CompassScreen({ navigation }) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    setSubscription(Magnetometer.addListener(result => setData(result)));
    Magnetometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Cálculo de grados (0 - 360)
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
    const direction = getDirection(getAngle());
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📍 Orientación detectada",
        body: `Estás mirando hacia el ${direction} (${getAngle()}°)`,
      },
      trigger: null, // Envío inmediato
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.angle}>{getAngle()}°</Text>
      <Text style={styles.direction}>{getDirection(getAngle())}</Text>
      
      <TouchableOpacity style={styles.button} onPress={sendNotification}>
        <Text style={{ color: 'white' }}>QUIERO SABER MI ORIENTACIÓN</Text>
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
  button: { backgroundColor: 'black', padding: 20, borderRadius: 10, marginBottom: 20 },
  link: { color: 'blue', marginTop: 10 }
});
