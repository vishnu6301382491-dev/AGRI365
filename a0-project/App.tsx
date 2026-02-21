import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';

import TabNavigator from './screens/TabNavigator';
import WeatherForecastScreen from './screens/WeatherForecastScreen';
import PestIdentificationScreen from './screens/PestIdentificationScreen';
import AuthScreen from './screens/AuthScreen';

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  Auth: undefined;
  TabNavigator: undefined;
  WeatherForecast: undefined;
  PestIdentification: undefined;
};

function RootStack() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      {isAuthenticated ? (
        <Stack.Screen name="TabNavigator">
          {props => <TabNavigator {...props} onLogout={handleLogout} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Auth">
          {props => <AuthScreen {...props} onAuthenticate={handleAuthenticate} />}
        </Stack.Screen>
      )}
      <Stack.Screen name="WeatherForecast" component={WeatherForecastScreen} />
      <Stack.Screen name="PestIdentification" component={PestIdentificationScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
      <Toaster />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});