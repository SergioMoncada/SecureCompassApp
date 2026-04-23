import React, { useEffect } from 'react'; // Agregamos useEffect
import { Platform } from 'react-native';   // Agregamos Platform
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';;

// Importar pantallas
import LoginScreen from './src/screens/LoginScreen';
import CompassScreen from './src/screens/CompassScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const Stack = createNativeStackNavigator();

// Configurar cómo se muestran las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Compass" component={CompassScreen} title="Brújula Segura" />
        <Stack.Screen name="Details" component={DetailsScreen} title="Mi Ubicación" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
