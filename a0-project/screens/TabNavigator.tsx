import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import MarketPricesScreen from './MarketPricesScreen';
import WeatherForecastScreen from './WeatherForecastScreen';
import PestIdentificationScreen from './PestIdentificationScreen';
import SoilTestScreen from './SoilTestScreen';
import CommunityScreen from './CommunityScreen';
import ProfileScreen from './ProfileScreen';
import DiagnosticsScreen from './DiagnosticsScreen';
import CropHealthExplanationScreen from './CropHealthExplanationScreen';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  onLogout: () => void;
}

export default function TabNavigator({ onLogout }: TabNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Market') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Weather') {
            iconName = focused ? 'partly-sunny' : 'partly-sunny-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Soil Test') {
            iconName = focused ? 'flask' : 'flask-outline';
          } else if (route.name === 'Health Guide') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Debug') {
            iconName = focused ? 'bug' : 'bug-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Market" component={MarketPricesScreen} />
      <Tab.Screen name="Weather" component={WeatherForecastScreen} />
      <Tab.Screen name="Scanner" component={PestIdentificationScreen} />
      <Tab.Screen name="Soil Test" component={SoilTestScreen} />
      <Tab.Screen name="Health Guide" component={CropHealthExplanationScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen 
        name="Profile" 
        children={() => <ProfileScreen onLogout={onLogout} />}
      />
      <Tab.Screen name="Debug" component={DiagnosticsScreen} />
    </Tab.Navigator>
  );
}