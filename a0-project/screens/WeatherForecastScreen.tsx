import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator, // Added for loading indicator
  RefreshControl // Added for pull-to-refresh
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Add MaterialCommunityIcons
import { useNavigation } from '@react-navigation/native';

// Mock weather forecast data
const weatherData = {
  currentLocation: {
    name: "Central Farm",
    region: "Midwest County"
  },
  current: {
    tempC: 24,
    tempF: 75.2,
    condition: "Partly cloudy",
    humidity: 65,
    windKph: 12,
    windDir: "NE",
    pressure: 1012,
    precip: 0,
    feelslike: 26,
    uv: 6,
    icon: "partly-sunny-outline"
  },
  forecast: [
    { 
      date: "Today", 
      day: { 
        maxtemp: 27, 
        mintemp: 18, 
        condition: "Partly cloudy", 
        icon: "partly-sunny-outline",
        chanceOfRain: 20 
      },
      hour: [
        { time: "06:00", temp: 18, condition: "Sunny", icon: "sunny-outline", chanceOfRain: 0 },
        { time: "09:00", temp: 21, condition: "Sunny", icon: "sunny-outline", chanceOfRain: 0 },
        { time: "12:00", temp: 25, condition: "Partly cloudy", icon: "partly-sunny-outline", chanceOfRain: 10 },
        { time: "15:00", temp: 27, condition: "Partly cloudy", icon: "partly-sunny-outline", chanceOfRain: 20 },
        { time: "18:00", temp: 24, condition: "Partly cloudy", icon: "partly-sunny-outline", chanceOfRain: 20 },
        { time: "21:00", temp: 20, condition: "Clear", icon: "moon-outline", chanceOfRain: 0 }
      ]
    },
    { 
      date: "Tomorrow", 
      day: { 
        maxtemp: 29, 
        mintemp: 19, 
        condition: "Sunny", 
        icon: "sunny-outline",
        chanceOfRain: 0 
      } 
    },
    { 
      date: "Wednesday", 
      day: { 
        maxtemp: 28, 
        mintemp: 20, 
        condition: "Sunny", 
        icon: "sunny-outline",
        chanceOfRain: 0 
      } 
    },
    { 
      date: "Thursday", 
      day: { 
        maxtemp: 24, 
        mintemp: 18, 
        condition: "Rainy", 
        icon: "rainy-outline",
        chanceOfRain: 80 
      } 
    },
    { 
      date: "Friday", 
      day: { 
        maxtemp: 22, 
        mintemp: 17, 
        condition: "Cloudy", 
        icon: "cloud-outline",
        chanceOfRain: 40 
      } 
    },
    { 
      date: "Saturday", 
      day: { 
        maxtemp: 24, 
        mintemp: 17, 
        condition: "Partly cloudy", 
        icon: "partly-sunny-outline",
        chanceOfRain: 20 
      } 
    },
    { 
      date: "Sunday", 
      day: { 
        maxtemp: 26, 
        mintemp: 18, 
        condition: "Sunny", 
        icon: "sunny-outline",
        chanceOfRain: 0 
      } 
    },
  ],
  alerts: [
    {
      type: "Strong Wind Advisory",
      description: "Strong winds expected tomorrow evening, secure loose farm equipment.",
      severity: "moderate"
    }
  ]
};

// Weather advice for farmers based on conditions
const farmingAdvice = {
  "Sunny": "Ideal conditions for harvesting. Consider irrigation for sensitive crops.",
  "Partly cloudy": "Good conditions for most farming activities. Monitor soil moisture levels.",
  "Cloudy": "Good day for applying fertilizers. Low evaporation rate.",
  "Rainy": "Avoid spraying pesticides. Check drainage systems.",
  "Clear": "Consider covering sensitive plants if temperatures drop significantly at night."
};

export default function WeatherForecastScreen() {
  const navigation = useNavigation();
  const [currentWeather, setCurrentWeather] = useState(weatherData.current);
  const [forecast, setForecast] = useState(weatherData.forecast);
  const [location, setLocation] = useState(weatherData.currentLocation);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [error, setError] = useState<string | null>(null); // New error state

  // Simulate fetching weather data from an API
  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate network delay for API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // In a real app, you would fetch from a weather API like OpenWeatherMap
      // const response = await fetch(`https://api.a0.dev/weather?lat=${userLat}&lon=${userLon}`);
      // const data = await response.json();
      
      // For now, use existing mock data
      setCurrentWeather(weatherData.current);
      setForecast(weatherData.forecast);
      setLocation(weatherData.currentLocation);

      // Simulate a random error for demonstration
      if (Math.random() < 0.1) { // 10% chance of error
        throw new Error("Failed to fetch weather data. Please try again.");
      }

    } catch (err) {
      console.error("Failed to fetch weather:", err);
      setError(err.message || "Could not load weather data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []); // Fetch data on component mount

  const onRefresh = () => {
    fetchWeatherData();
  };

  const { width } = Dimensions.get('window');
  const ITEM_WIDTH = width * 0.9; // Adjust as needed
  const ITEM_SPACING = 16; // Margin around items

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#212121" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
          <Text style={styles.headerSubtitle}>{weatherData.currentLocation.name}, {weatherData.currentLocation.region}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={24} color="#212121" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={onRefresh} 
            tintColor="#2E8B57" // Android
            colors={['#2E8B57']} // iOS
          />
        }
      >
        <View style={styles.currentWeatherCard}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Fetching live weather...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={30} color="#FF5722" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.locationHeader}>
                <Feather name="map-pin" size={18} color="#FFFFFF" />
                <Text style={styles.locationText}>{location.name}, {location.region}</Text>
              </View>
              <View style={styles.mainWeatherInfo}>
                <Ionicons name={currentWeather.icon} size={60} color="#FFFFFF" />
                <View style={styles.temperatureContainer}>
                  <Text style={styles.temperature}>{currentWeather.tempC}°C</Text>
                  <Text style={styles.condition}>{currentWeather.condition}</Text>
                </View>
              </View>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Feather name="droplet" size={18} color="#FFFFFF" />
                  <Text style={styles.detailText}>Humidity: {currentWeather.humidity}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Feather name="wind" size={18} color="#FFFFFF" />
                  <Text style={styles.detailText}>Wind: {currentWeather.windKph} km/h</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="gauge" size={18} color="#FFFFFF" />
                  <Text style={styles.detailText}>Pressure: {currentWeather.pressure} hPa</Text>
                </View>
                <View style={styles.detailItem}>
                  <Feather name="cloud-rain" size={18} color="#FFFFFF" />
                  <Text style={styles.detailText}>Precip: {currentWeather.precip} mm</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {!isLoading && !error && (
          <>
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyForecastContainer}>
              {forecast[0].hour.map((hour, index) => (
                <View key={index} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{hour.time}</Text>
                  <Ionicons name={hour.icon} size={30} color="#666" />
                  <Text style={styles.hourlyTemp}>{hour.temp}°C</Text>
                  {hour.chanceOfRain > 0 && (
                    <Text style={styles.hourlyRain}>💧 {hour.chanceOfRain}%</Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>5-Day Forecast</Text>
            <View style={styles.dailyForecastContainer}>
              {forecast.map((day, index) => (
                <View key={index} style={styles.dailyItem}>
                  <Text style={styles.dailyDay}>{day.date}</Text>
                  <Ionicons name={day.day.icon} size={30} color="#2E8B57" />
                  <View style={styles.dailyTempRange}>
                    <Text style={styles.dailyMaxTemp}>{day.day.maxtemp}°</Text>
                    <Text style={styles.dailyMinTemp}>{day.day.mintemp}°</Text>
                  </View>
                  {day.day.chanceOfRain > 0 && (
                    <Text style={styles.dailyRainChance}>💧 {day.day.chanceOfRain}%</Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  moreButton: {
    padding: 8,
  },
  currentWeatherCard: {
    backgroundColor: '#2E8B57', // Primary green
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  mainWeatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperatureContainer: {
    marginLeft: 15,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  condition: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Approx half width
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 15,
  },
  hourlyForecastContainer: {
    paddingHorizontal: 16,
  },
  hourlyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: 100, // Fixed width for hourly items
  },
  hourlyTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  hourlyRain: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 4,
    fontWeight: '500',
  },
  dailyForecastContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dailyDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  dailyTempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.5,
    justifyContent: 'flex-end',
  },
  dailyMaxTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 5,
  },
  dailyMinTemp: {
    fontSize: 14,
    color: '#6B7280',
  },
  dailyRainChance: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200, // Ensure it takes up space
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: '#FFEBEE', // Light red background
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#D32F2F', // Dark red text
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});