import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CommodityPrice {
  id: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  market: string;
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
  prediction: {
    nextDay: number;
    confidence: number;
    recommendation: 'buy' | 'sell' | 'hold';
  };
}

interface MarketNews {
  id: string;
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

interface GroceryItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // Optional, for deals
  unit: string;
  store: string;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  deal?: string; // e.g., "Buy One Get One Free"
  imageUrl: string;
}

export default function MarketPricesScreen() {
  const [commodities, setCommodities] = useState<CommodityPrice[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Today');
  const [priceAlerts, setPriceAlerts] = useState<string[]>([]);

  // Simulated commodity data with AI predictions
  const sampleCommodities: CommodityPrice[] = [
    {
      id: '1',
      name: 'Rice (Basmati)',
      currentPrice: 75.50,
      previousPrice: 73.20,
      change: 2.30,
      changePercent: 3.14,
      unit: '₹/kg',
      market: 'Delhi Mandi',
      lastUpdated: new Date(),
      trend: 'up',
      prediction: {
        nextDay: 76.80,
        confidence: 87,
        recommendation: 'hold'
      }
    },
    {
      id: '2',
      name: 'Wheat',
      currentPrice: 45.75,
      previousPrice: 47.10,
      change: -1.35,
      changePercent: -2.87,
      unit: '₹/kg',
      market: 'Punjab Mandi',
      lastUpdated: new Date(),
      trend: 'down',
      prediction: {
        nextDay: 44.20,
        confidence: 79,
        recommendation: 'sell'
      }
    },
    {
      id: '3',
      name: 'Tomato',
      currentPrice: 35.00,
      previousPrice: 32.50,
      change: 2.50,
      changePercent: 7.69,
      unit: '₹/kg',
      market: 'Mumbai APMC',
      lastUpdated: new Date(),
      trend: 'up',
      prediction: {
        nextDay: 37.20,
        confidence: 92,
        recommendation: 'buy'
      }
    },
    {
      id: '4',
      name: 'Onion',
      currentPrice: 28.75,
      previousPrice: 30.20,
      change: -1.45,
      changePercent: -4.80,
      unit: '₹/kg',
      market: 'Nashik Market',
      lastUpdated: new Date(),
      trend: 'down',
      prediction: {
        nextDay: 27.50,
        confidence: 85,
        recommendation: 'hold'
      }
    },
    {
      id: '5',
      name: 'Potato',
      currentPrice: 22.30,
      previousPrice: 21.80,
      change: 0.50,
      changePercent: 2.29,
      unit: '₹/kg',
      market: 'Agra Mandi',
      lastUpdated: new Date(),
      trend: 'up',
      prediction: {
        nextDay: 22.80,
        confidence: 76,
        recommendation: 'hold'
      }
    },
    {
      id: '6',
      name: 'Sugarcane',
      currentPrice: 285.00,
      previousPrice: 280.00,
      change: 5.00,
      changePercent: 1.79,
      unit: '₹/quintal',
      market: 'UP Sugar Mills',
      lastUpdated: new Date(),
      trend: 'up',
      prediction: {
        nextDay: 288.50,
        confidence: 81,
        recommendation: 'buy'
      }
    }
  ];

  // Simulated grocery items data
  const sampleGroceryItems: GroceryItem[] = [
    {
      id: 'g1',
      name: 'Fresh Tomatoes',
      price: 28.00,
      originalPrice: 35.00,
      unit: '₹/kg',
      store: 'Local Fresh Mart',
      availability: 'in-stock',
      deal: '20% Off',
      imageUrl: 'https://picsum.photos/id/1080/100/100', // Placeholder image
    },
    {
      id: 'g2',
      name: 'Organic Spinach',
      price: 45.00,
      unit: '₹/bunch',
      store: 'Green Grocers',
      availability: 'low-stock',
      imageUrl: 'https://picsum.photos/id/1082/100/100', // Placeholder image
    },
    {
      id: 'g3',
      name: 'Potatoes (Local)',
      price: 20.00,
      originalPrice: 25.00,
      unit: '₹/kg',
      store: 'Farmers Co-op',
      availability: 'in-stock',
      deal: 'Bulk Discount',
      imageUrl: 'https://picsum.photos/id/1083/100/100', // Placeholder image
    },
    {
      id: 'g4',
      name: 'Farm Fresh Eggs',
      price: 6.00,
      unit: '₹/egg',
      store: 'Dairy Delight',
      availability: 'in-stock',
      imageUrl: 'https://picsum.photos/id/1084/100/100', // Placeholder image
    },
  ];

  const sampleNews: MarketNews[] = [
    {
      id: '1',
      title: 'Monsoon Prediction Shows Good Rainfall',
      summary: 'IMD predicts above-normal rainfall this season, potentially boosting crop yields',
      impact: 'positive',
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Export Demand for Basmati Rice Increases',
      summary: 'International demand drives rice prices up by 5% this week',
      impact: 'positive',
      timestamp: new Date()
    },
    {
      id: '3',
      title: 'Fuel Price Hike Affects Transportation',
      summary: 'Rising fuel costs may impact crop transportation and market prices',
      impact: 'negative',
      timestamp: new Date()
    }
  ];

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Spices', 'Dairy'];
  const timeframes = ['Today', 'Week', 'Month', 'Quarter'];

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      await fetchCommodityPrices();
      await fetchMarketNews();
      await fetchGroceryUpdates();
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  };

  const fetchCommodityPrices = async () => {
    const response = await simulateGoogleMarketAPI();
    setCommodities(response.commodities);
  };

  const fetchMarketNews = async () => {
    const response = await simulateGoogleNewsAPI();
    setMarketNews(response.news);
  };

  const fetchGroceryUpdates = async () => {
    const response = await new Promise<GroceryItem[]>((resolve) => {
      setTimeout(() => {
        resolve(sampleGroceryItems);
      }, 1200);
    });
    setGroceryItems(response);
  };

  const simulateGoogleMarketAPI = async (): Promise<{ commodities: CommodityPrice[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ commodities: sampleCommodities });
      }, 1000);
    });
  };

  const simulateGoogleNewsAPI = async (): Promise<{ news: MarketNews[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ news: sampleNews });
      }, 800);
    });
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadMarketData();
    setIsRefreshing(false);
  };

  const filteredCommodities = useMemo(() => {
    return commodities.filter(commodity =>
      commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [commodities, searchQuery]);

  const filteredGroceryItems = useMemo(() => {
    return groceryItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.store.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groceryItems, searchQuery]);

  const togglePriceAlert = (commodityId: string) => {
    setPriceAlerts(prev => 
      prev.includes(commodityId) 
        ? prev.filter(id => id !== commodityId)
        : [...prev, commodityId]
    );
  };

  const PriceCard = ({ commodity }: { commodity: CommodityPrice }) => {
    const isPositive = commodity.change >= 0;
    const hasAlert = priceAlerts.includes(commodity.id);
    
    return (
      <View style={styles.priceCard}>
        <View style={styles.priceHeader}>
          <View style={styles.commodityInfo}>
            <Text style={styles.commodityName}>{commodity.name}</Text>
            <Text style={styles.marketName}>{commodity.market}</Text>
          </View>
          <TouchableOpacity
            onPress={() => togglePriceAlert(commodity.id)}
            style={[styles.alertButton, hasAlert && styles.alertButtonActive]}
          >
            <Ionicons 
              name={hasAlert ? "notifications" : "notifications-outline"} 
              size={20} 
              color={hasAlert ? "#FF6B35" : "#666"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>
            {commodity.currentPrice.toFixed(2)} {commodity.unit}
          </Text>
          <View style={[styles.changeContainer, isPositive ? styles.positive : styles.negative]}>
            <Feather 
              name={isPositive ? "trending-up" : "trending-down"} 
              size={16} 
              color={isPositive ? "#4CAF50" : "#F44336"} 
            />
            <Text style={[styles.changeText, isPositive ? styles.positiveText : styles.negativeText]}>
              {isPositive ? '+' : ''}{commodity.change.toFixed(2)} ({commodity.changePercent.toFixed(1)}%)
            </Text>
          </View>
        </View>

        <View style={styles.predictionContainer}>
          <View style={styles.predictionRow}>
            <Text style={styles.predictionLabel}>AI Prediction (24h):</Text>
            <Text style={styles.predictionPrice}>
              ₹{commodity.prediction.nextDay.toFixed(2)}
            </Text>
          </View>
          <View style={styles.predictionRow}>
            <Text style={styles.confidenceText}>
              {commodity.prediction.confidence}% confidence
            </Text>
            <View style={[
              styles.recommendationBadge,
              commodity.prediction.recommendation === 'buy' && styles.buyBadge,
              commodity.prediction.recommendation === 'sell' && styles.sellBadge,
              commodity.prediction.recommendation === 'hold' && styles.holdBadge
            ]}>
              <Text style={[
                styles.recommendationText,
                commodity.prediction.recommendation === 'buy' && styles.buyText,
                commodity.prediction.recommendation === 'sell' && styles.sellText,
                commodity.prediction.recommendation === 'hold' && styles.holdText
              ]}>
                {commodity.prediction.recommendation.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.lastUpdated}>
          Updated: {commodity.lastUpdated.toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  const NewsCard = ({ news }: { news: MarketNews }) => (
    <View style={styles.newsCard}>
      <View style={styles.newsHeader}>
        <View style={[
          styles.impactBadge,
          news.impact === 'positive' && styles.positiveImpact,
          news.impact === 'negative' && styles.negativeImpact,
          news.impact === 'neutral' && styles.neutralImpact
        ]}>
          <Text style={styles.impactText}>{news.impact.toUpperCase()}</Text>
        </View>
        <Text style={styles.newsTime}>
          {news.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      <Text style={styles.newsTitle}>{news.title}</Text>
      <Text style={styles.newsSummary}>{news.summary}</Text>
    </View>
  );

  const GroceryItemCard = ({ item }: { item: GroceryItem }) => (
    <TouchableOpacity style={styles.groceryCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.groceryImage} />
      <View style={styles.groceryInfo}>
        <Text style={styles.groceryName}>{item.name}</Text>
        <View style={styles.groceryPriceContainer}>
          {item.originalPrice && (
            <Text style={styles.groceryOriginalPrice}>₹{item.originalPrice.toFixed(2)}</Text>
          )}
          <Text style={styles.groceryCurrentPrice}>₹{item.price.toFixed(2)} {item.unit}</Text>
        </View>
        <View style={styles.groceryDetailsRow}>
          <Text style={styles.groceryStore}><Feather name="map-pin" size={12} color="#666" /> {item.store}</Text>
          <View style={[styles.availabilityBadge, item.availability === 'in-stock' && styles.inStock, item.availability === 'low-stock' && styles.lowStock, item.availability === 'out-of-stock' && styles.outOfStock]}>
            <Text style={styles.availabilityText}>{item.availability.replace('-', ' ').toUpperCase()}</Text>
          </View>
        </View>
        {item.deal && (
          <View style={styles.dealBadge}>
            <Feather name="tag" size={14} color="#FFFFFF" />
            <Text style={styles.dealText}>{item.deal}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const MarketOverview = () => (
    <View style={styles.overviewContainer}>
      <Text style={styles.overviewTitle}>Market Overview</Text>
      <View style={styles.overviewStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>+12</Text>
          <Text style={styles.statLabel}>Gainers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>-8</Text>
          <Text style={styles.statLabel}>Losers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Stable</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>Market Sentiment</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Prices & Groceries</Text>
        <TouchableOpacity onPress={onRefresh} disabled={isRefreshing}>
          <Feather name="refresh-cw" size={24} color="#2E8B57" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search commodities or groceries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'Grocery' && styles.selectedCategory
          ]}
          onPress={() => setSelectedCategory('Grocery')}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === 'Grocery' && styles.selectedCategoryText
          ]}>
            Grocery
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {selectedCategory !== 'Grocery' && <MarketOverview />}

        {selectedCategory !== 'Grocery' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Commodity Prices</Text>
            {filteredCommodities.map((commodity) => (
              <PriceCard key={commodity.id} commodity={commodity} />
            ))}
          </View>
        )}

        {selectedCategory === 'Grocery' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}> 
              <Text style={styles.sectionTitle}>Daily Grocery Deals</Text>
              <TouchableOpacity 
                style={styles.subscribeButton} 
                onPress={() => Alert.alert('Notifications', 'You will now receive daily grocery deal alerts!')}
              >
                <Feather name="bell" size={16} color="#FFFFFF" />
                <Text style={styles.subscribeButtonText}>Subscribe to Deals</Text>
              </TouchableOpacity>
            </View>
            
            {filteredGroceryItems.map((item) => (
              <GroceryItemCard key={item.id} item={item} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market News</Text>
          {marketNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <MaterialIcons name="psychology" size={24} color="#FF6B35" />
              <Text style={styles.insightTitle}>Smart Trading Suggestion</Text>
            </View>
            <Text style={styles.insightText}>
              Based on weather patterns, market trends, and historical data, consider increasing tomato inventory. 
              Predicted 15% price increase in the next 7 days due to supply constraints.
            </Text>
            <View style={styles.confidenceIndicator}>
              <Text style={styles.confidenceLabel}>AI Confidence: </Text>
              <View style={styles.confidenceBar}>
                <View style={[styles.confidenceFill, { width: '89%' }]} />
              </View>
              <Text style={styles.confidencePercent}>89%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  selectedCategory: {
    backgroundColor: '#2E8B57',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  commodityInfo: {
    flex: 1,
  },
  commodityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  marketName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  alertButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  alertButtonActive: {
    backgroundColor: '#FEF3F2',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  positive: {
    backgroundColor: '#DCFCE7',
  },
  negative: {
    backgroundColor: '#FEE2E2',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  positiveText: {
    color: '#16A34A',
  },
  negativeText: {
    color: '#DC2626',
  },
  predictionContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  predictionLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  predictionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  confidenceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  recommendationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  buyBadge: {
    backgroundColor: '#DCFCE7',
  },
  sellBadge: {
    backgroundColor: '#FEE2E2',
  },
  holdBadge: {
    backgroundColor: '#FEF3C7',
  },
  recommendationText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  buyText: {
    color: '#16A34A',
  },
  sellText: {
    color: '#DC2626',
  },
  holdText: {
    color: '#D97706',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveImpact: {
    backgroundColor: '#DCFCE7',
  },
  negativeImpact: {
    backgroundColor: '#FEE2E2',
  },
  neutralImpact: {
    backgroundColor: '#F3F4F6',
  },
  impactText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  newsTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  newsSummary: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 15,
  },
  confidenceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  confidencePercent: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35', // Orange color for notifications
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  groceryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groceryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  groceryInfo: {
    flex: 1,
  },
  groceryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  groceryPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  groceryCurrentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginRight: 8,
  },
  groceryOriginalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  groceryDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groceryStore: {
    fontSize: 13,
    color: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  inStock: {
    backgroundColor: '#DCFCE7',
  },
  lowStock: {
    backgroundColor: '#FEF3C7',
  },
  outOfStock: {
    backgroundColor: '#FEE2E2',
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  dealBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  dealText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});