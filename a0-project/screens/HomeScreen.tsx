import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useEffect } from 'react';
import { TextInput } from 'react-native';

// Weather condition mock data
const weatherData = {
  temperature: 24,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  location: 'Central Farm',
  forecast: [
    { day: 'Today', temp: 24, icon: 'partly-sunny-outline' },
    { day: 'Wed', temp: 26, icon: 'sunny-outline' },
    { day: 'Thu', temp: 23, icon: 'rainy-outline' },
    { day: 'Fri', temp: 22, icon: 'cloud-outline' },
    { day: 'Sat', temp: 25, icon: 'sunny-outline' }
  ]
};

// Crop insights mock data
const cropInsights = [
  {
    id: '1',
    name: 'Wheat',
    health: 'Good',
    stage: 'Flowering',
    nextAction: 'Check for pests',
    imageUrl: 'https://picsum.photos/id/100/300/200' // Replaced with placeholder
  },
  {
    id: '2',
    name: 'Corn',
    health: 'Needs Attention',
    stage: 'Vegetative',
    nextAction: 'Apply fertilizer',
    imageUrl: 'https://picsum.photos/id/101/300/200' // Replaced with placeholder
  },
  {
    id: '3',
    name: 'Soybeans',
    health: 'Excellent',
    stage: 'Mature',
    nextAction: 'Ready for harvest',
    imageUrl: 'https://picsum.photos/id/102/300/200' // Replaced with placeholder
  }
];

// Market insights mock data
const marketInsights = [
  { crop: 'Wheat', trend: 'up', price: '$7.25/bushel', change: '+2.3%' },
  { crop: 'Corn', trend: 'down', price: '$4.15/bushel', change: '-0.8%' },
  { crop: 'Soybeans', trend: 'up', price: '$13.50/bushel', change: '+1.5%' }
];

// Mock grocery deals for homepage display
const groceryDeals = [
  {
    id: 'g1',
    name: 'Fresh Tomatoes',
    price: '₹28/kg',
    originalPrice: '₹35/kg',
    deal: '20% Off',
    imageUrl: 'https://picsum.photos/id/1080/100/100',
  },
  {
    id: 'g2',
    name: 'Organic Spinach',
    price: '₹45/bunch',
    deal: 'Limited Stock',
    imageUrl: 'https://picsum.photos/id/1082/100/100',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('Fetching location...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocationName('Location Access Denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocodedAddress.length > 0) {
        const addr = reverseGeocodedAddress[0];
        setLocationName(`${addr.city || addr.region}, ${addr.country}`);
      }
    })();
  }, []);

  const features = [
    {
      id: 'f1',
      icon: <Feather name="activity" size={24} color="#ffffff" />,
      title: "Crop Health",
      description: "Monitor crop health via AI",
      color: "#4CAF50",
      target: 'PestIdentification'
    },
    {
      id: 'f2',
      icon: <MaterialCommunityIcons name="soil" size={24} color="#ffffff" />,
      title: "Soil Test",
      description: "Check soil fertility",
      color: "#8D6E63",
      target: 'SoilTest'
    },
    {
      id: 'f3',
      icon: <FontAwesome5 name="bug" size={24} color="#ffffff" />,
      title: "Pest ID",
      description: "Identify pests & diseases",
      color: "#FF5722",
      target: 'PestIdentification'
    },
    {
      id: 'f4',
      icon: <MaterialCommunityIcons name="water-pump" size={24} color="#ffffff" />,
      title: "Irrigation",
      description: "Control smart systems",
      color: "#03A9F4",
      target: null
    }
  ];

  const filteredFeatures = features.filter(f =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Feature card component
  const FeatureCard = ({ icon, title, description, color, onPress }) => (
    <TouchableOpacity
      style={[styles.featureCard, { backgroundColor: color }]}
      onPress={onPress}
    >
      <View style={styles.featureIconContainer}>
        {icon}
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </TouchableOpacity>
  );

  // Crop card component
  const CropCard = ({ crop }) => (
    <TouchableOpacity
      style={styles.cropCard}
      onPress={() => navigation.navigate('CropDetail', { cropId: crop.id })}
    >
      <ImageBackground
        source={{ uri: crop.imageUrl }}
        style={styles.cropImage}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.cropOverlay}>
          <Text style={styles.cropName}>{crop.name}</Text>
          <View style={styles.cropDetails}>
            <View style={[
              styles.healthIndicator,
              {
                backgroundColor: crop.health === 'Good' ? '#4CAF50' :
                  crop.health === 'Excellent' ? '#2E8B57' : '#FFC107'
              }
            ]} />
            <Text style={styles.cropStage}>{crop.stage}</Text>
          </View>
          <Text style={styles.cropAction}>{crop.nextAction}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  // New: Grocery Deal Card Component
  const GroceryDealCard = ({ item }) => (
    <TouchableOpacity
      style={styles.groceryDealCard}
      onPress={() => navigation.navigate('Market', { screen: 'MarketPrices', params: { category: 'Grocery' } })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.groceryDealImage} />
      <View style={styles.groceryDealInfo}>
        <Text style={styles.groceryDealName}>{item.name}</Text>
        <View style={styles.groceryPriceContainer}>
          {item.originalPrice && (
            <Text style={styles.groceryOriginalPrice}>{item.originalPrice}</Text>
          )}
          <Text style={styles.groceryCurrentPrice}>{item.price}</Text>
        </View>
        {item.deal && (
          <View style={styles.dealBadge}>
            <Feather name="tag" size={12} color="#FFFFFF" />
            <Text style={styles.dealText}>{item.deal}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.farmerName}>John Farmer</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={24} color="#2E8B57" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#757575" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks, crops, or tools..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.locationButton} onPress={() => Alert.alert('Location Source', 'Using GPS for live agricultural updates')}>
            <MaterialIcons name="my-location" size={20} color="#2E8B57" />
          </TouchableOpacity>
        </View>

        {/* Weather Widget - Links to WeatherForecastScreen */}
        <TouchableOpacity
          style={styles.weatherWidget}
          onPress={() => navigation.navigate('WeatherForecast')}
        >
          <View style={styles.currentWeather}>
            <Ionicons name="partly-sunny-outline" size={40} color="#ffffff" />
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
              <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
              <Text style={styles.location}>{locationName}</Text>
            </View>
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetail}>
                <Feather name="droplet" size={16} color="#ffffff" />
                <Text style={styles.weatherDetailText}>{weatherData.humidity}%</Text>
              </View>
              <View style={styles.weatherDetail}>
                <Feather name="wind" size={16} color="#ffffff" />
                <Text style={styles.weatherDetailText}>{weatherData.windSpeed} km/h</Text>
              </View>
            </View>
          </View>
          <View style={styles.weatherForecast}>
            {weatherData.forecast.map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={styles.forecastDayText}>{day.day}</Text>
                <Ionicons name={day.icon} size={20} color="#ffffff" />
                <Text style={styles.forecastTemp}>{day.temp}°</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {/* Key Features Section - Updated onPress for SoilTest and PestIdentification */}
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featuresContainer}>
          {filteredFeatures.map((f) => (
            <FeatureCard
              key={f.id}
              icon={f.icon}
              title={f.title}
              description={f.description}
              color={f.color}
              onPress={() => f.target ? navigation.navigate(f.target as any) : Alert.alert('Coming Soon', `${f.title} feature is under development!`)}
            />
          ))}
          {filteredFeatures.length === 0 && (
            <Text style={{ marginHorizontal: 16, color: '#757575' }}>No features match your search.</Text>
          )}
        </View>

        {/* Crop Insights Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Crop Insights</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.cropInsightsContainer}
        >
          {cropInsights.map(crop => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </ScrollView>

        {/* Market Insights Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Market Insights</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Market', { screen: 'MarketPrices' })}> // Link to MarketPricesScreen
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.marketContainer}>
          {marketInsights.map((item, index) => (
            <View key={index} style={styles.marketItem}>
              <View style={styles.marketItemLeft}>
                <Text style={styles.marketCrop}>{item.crop}</Text>
                <Text style={styles.marketPrice}>{item.price}</Text>
              </View>
              <View style={styles.marketItemRight}>
                <Feather
                  name={item.trend === 'up' ? 'arrow-up-right' : 'arrow-down-right'}
                  size={20}
                  color={item.trend === 'up' ? '#4CAF50' : '#F44336'}
                />
                <Text
                  style={[
                    styles.marketChange,
                    { color: item.trend === 'up' ? '#4CAF50' : '#F44336' }
                  ]}
                >
                  {item.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* New: Daily Grocery Deals Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Grocery Deals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Market', { screen: 'MarketPrices', params: { category: 'Grocery' } })}> // Link to MarketPricesScreen with Grocery category
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.groceryDealsContainer}
        >
          {groceryDeals.map(deal => (
            <GroceryDealCard key={deal.id} item={deal} />
          ))}
        </ScrollView>

        {/* Advisory Section */}
        <View style={styles.advisoryContainer}>
          <View style={styles.advisoryHeader}>
            <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#FFC107" />
            <Text style={styles.advisoryTitle}>Daily Advisory</Text>
          </View>
          <Text style={styles.advisoryText}>
            It's a good day to apply foliar fertilizer to your corn field. The current conditions are optimal.
          </Text>
          <TouchableOpacity style={styles.advisoryButton}>
            <Text style={styles.advisoryButtonText}>Learn more</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;

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
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 14,
    color: '#757575',
  },
  farmerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  locationButton: {
    padding: 8,
  },
  weatherWidget: {
    backgroundColor: '#2E8B57',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherInfo: {
    flex: 1,
    marginLeft: 10,
  },
  temperature: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  weatherCondition: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  location: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  weatherDetails: {
    alignItems: 'flex-end',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  weatherDetailText: {
    marginLeft: 6,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  weatherForecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  forecastDay: {
    alignItems: 'center',
  },
  forecastDayText: {
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 5,
  },
  forecastTemp: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    color: '#212121',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (windowWidth / 2) - 24,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  seeAllText: {
    color: '#2E8B57',
    fontWeight: '600',
  },
  cropInsightsContainer: {
    paddingLeft: 16,
  },
  cropCard: {
    width: 250,
    height: 150,
    marginRight: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cropImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cropOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
  },
  cropName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cropDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  healthIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  cropStage: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  cropAction: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  marketContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  marketItemLeft: {
    flex: 1,
  },
  marketCrop: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  marketPrice: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  marketItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketChange: {
    marginLeft: 5,
    fontWeight: '600',
  },
  advisoryContainer: {
    backgroundColor: '#FFF8E1',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  advisoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#212121',
  },
  advisoryText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  advisoryButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFC107',
    borderRadius: 4,
  },
  advisoryButtonText: {
    color: '#212121',
    fontWeight: '600',
    fontSize: 12,
  },
  // New Styles for Grocery Deals
  groceryDealsContainer: {
    paddingLeft: 16,
    marginBottom: 24,
  },
  groceryDealCard: {
    width: 180, // Fixed width for grocery deals
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  groceryDealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  groceryDealInfo: {
    alignItems: 'center',
  },
  groceryDealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  groceryPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  groceryCurrentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginRight: 5,
  },
  groceryOriginalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  dealBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dealText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});