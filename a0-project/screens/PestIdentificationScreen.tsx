import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';

// Enhanced pest and disease database with chemical recommendations
const pestDatabase = [
  {
    id: '1',
    name: 'Aphids',
    scientificName: 'Aphidoidea',
    type: 'pest',
    description: 'Small sap-sucking insects that can cause significant damage to crops. They often appear in clusters on new growth.',
    symptoms: 'Curling leaves, yellowing, stunted growth, sticky residue (honeydew)',
    crops: ['Wheat', 'Soybeans', 'Vegetables', 'Fruits'],
    severity: 'moderate',
    confidenceLevel: 89,
    treatment: [
      'Insecticidal soap spray',
      'Neem oil solution',
      'Introduce natural predators like ladybugs',
      'Spray with water to dislodge clusters'
    ],
    chemicals: [
      {
        name: 'Imidacloprid 17.8% SL',
        dosage: '0.3-0.5 ml/liter of water',
        applicationMethod: 'Foliar spray',
        frequency: 'Apply 2-3 times at 10-day intervals',
        price: '₹450/250ml',
        manufacturer: 'Bayer CropScience',
        safetyPeriod: 'Harvest after 7 days'
      },
      {
        name: 'Thiamethoxam 25% WG',
        dosage: '0.2-0.3 g/liter of water',
        applicationMethod: 'Foliar spray',
        frequency: 'Apply twice at 15-day intervals',
        price: '₹380/100g',
        manufacturer: 'Syngenta',
        safetyPeriod: 'Harvest after 3 days'
      }
    ],
    organicAlternatives: [
      {
        name: 'Neem Oil',
        dosage: '5-10 ml/liter of water',
        method: 'Spray during early morning or evening',
        price: '₹120/500ml'
      },
      {
        name: 'Insecticidal Soap',
        dosage: '2-3 ml/liter of water',
        method: 'Weekly application during infestation',
        price: '₹85/250ml'
      }
    ],
    preventionTips: [
      'Plant companion plants like marigolds',
      'Maintain proper plant spacing for air circulation',
      'Regular monitoring of plants',
      'Remove and destroy heavily infested plants'
    ],
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    name: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    type: 'disease',
    description: 'Devastating fungal disease that affects tomatoes and potatoes. Spreads rapidly in humid conditions.',
    symptoms: 'Dark brown spots on leaves, white fuzzy growth on leaf undersides, fruit rot',
    crops: ['Tomatoes', 'Potatoes', 'Eggplant'],
    severity: 'high',
    confidenceLevel: 94,
    treatment: [
      'Remove and destroy affected plant parts',
      'Apply copper-based fungicides',
      'Improve air circulation',
      'Avoid overhead watering'
    ],
    chemicals: [
      {
        name: 'Metalaxyl 8% + Mancozeb 64% WP',
        dosage: '2-2.5 g/liter of water',
        applicationMethod: 'Foliar spray',
        frequency: 'Apply every 7-10 days',
        price: '₹320/250g',
        manufacturer: 'UPL Limited',
        safetyPeriod: 'Harvest after 7 days'
      },
      {
        name: 'Copper Oxychloride 50% WP',
        dosage: '2-3 g/liter of water',
        applicationMethod: 'Foliar spray',
        frequency: 'Apply at first sign of disease',
        price: '₹180/500g',
        manufacturer: 'Rallis India',
        safetyPeriod: 'Harvest after 3 days'
      }
    ],
    organicAlternatives: [
      {
        name: 'Bordeaux Mixture',
        dosage: '10 g/liter of water',
        method: 'Preventive spray every 15 days',
        price: '₹95/500g'
      },
      {
        name: 'Baking Soda Solution',
        dosage: '5 g/liter water + 2 ml liquid soap',
        method: 'Weekly application',
        price: '₹25/500g'
      }
    ],
    preventionTips: [
      'Plant resistant varieties',
      'Ensure proper drainage',
      'Space plants adequately for air circulation',
      'Water at soil level, not on leaves'
    ],
    imageUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    name: 'Nitrogen Deficiency',
    scientificName: 'Nutrient Deficiency',
    type: 'deficiency',
    description: 'Lack of nitrogen in soil causes yellowing of lower leaves and stunted growth. Critical for plant protein synthesis.',
    symptoms: 'Yellowing of older leaves starting from bottom, stunted growth, pale green color',
    crops: ['All crops', 'Wheat', 'Rice', 'Corn', 'Vegetables'],
    severity: 'moderate',
    confidenceLevel: 87,
    treatment: [
      'Apply nitrogen-rich fertilizers',
      'Use organic compost',
      'Apply urea or ammonium sulfate',
      'Consider liquid nitrogen fertilizers for quick results'
    ],
    chemicals: [
      {
        name: 'Urea 46% N',
        dosage: '20-30 kg/acre for cereals',
        applicationMethod: 'Soil application or side dressing',
        frequency: 'Split application - 50% at sowing, 50% at tillering',
        price: '₹280/50kg',
        manufacturer: 'IFFCO',
        safetyPeriod: 'Safe for immediate harvest'
      },
      {
        name: 'NPK 19:19:19',
        dosage: '2-3 g/liter of water',
        applicationMethod: 'Foliar spray',
        frequency: 'Apply every 15 days',
        price: '₹450/1kg',
        manufacturer: 'Coromandel International',
        safetyPeriod: 'Safe for immediate harvest'
      }
    ],
    organicAlternatives: [
      {
        name: 'Vermicompost',
        dosage: '2-3 tons/acre',
        method: 'Mix with soil before sowing',
        price: '₹8/kg'
      },
      {
        name: 'Cow Manure',
        dosage: '5-7 tons/acre',
        method: 'Apply during land preparation',
        price: '₹5/kg'
      }
    ],
    preventionTips: [
      'Regular soil testing',
      'Crop rotation with legumes',
      'Use of green manure',
      'Proper organic matter management'
    ],
    imageUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: '4',
    name: 'Corn Earworm',
    scientificName: 'Helicoverpa zea',
    type: 'pest',
    description: 'Common pest that affects corn and many other crops. The larvae feed on leaves, stems, and developing fruits.',
    symptoms: 'Holes in corn ears, damaged kernels, frass (waste) at entry points',
    crops: ['Corn', 'Tomatoes', 'Cotton', 'Soybeans'],
    severity: 'high',
    confidenceLevel: 91,
    treatment: [
      'Bacillus thuringiensis (Bt) sprays',
      'Targeted insecticides during early infestation',
      'Release of parasitic wasps',
      'Mineral oil application to silk'
    ],
    chemicals: [
      {
        name: 'Chlorantraniliprole 18.5% SC',
        dosage: '0.4-0.6 ml/liter of water',
        applicationMethod: 'Foliar spray',
        frequency: 'Apply at egg laying to early larval stage',
        price: '₹850/250ml',
        manufacturer: 'DuPont',
        safetyPeriod: 'Harvest after 5 days'
      },
      {
        name: 'Emamectin Benzoate 5% SG',
        dosage: '0.4-0.5 g/liter of water',
        applicationMethod: 'Foliar spray',
        frequency: 'Apply at larvae appearance',
        price: '₹320/100g',
        manufacturer: 'Syngenta',
        safetyPeriod: 'Harvest after 7 days'
      }
    ],
    organicAlternatives: [
      {
        name: 'Bt (Bacillus thuringiensis)',
        dosage: '1-2 g/liter of water',
        method: 'Spray during evening hours',
        price: '₹180/100g'
      },
      {
        name: 'Neem Kernel Extract',
        dosage: '50 g/liter of water',
        method: 'Soak overnight, filter and spray',
        price: '₹95/1kg'
      }
    ],
    preventionTips: [
      'Plant early maturing varieties',
      'Crop rotation',
      'Bt corn varieties',
      'Deep fall plowing to expose pupae'
    ],
    imageUrl: 'https://picsum.photos/400/300?random=4'
  }
];

// AI Insights and recommendations
const aiInsights = [
  {
    type: 'weather',
    title: 'Weather-Based Alert',
    message: 'High humidity (85%) and temperature (28°C) favorable for fungal diseases. Monitor crops closely.',
    priority: 'high',
    icon: 'cloud-rain'
  },
  {
    type: 'market',
    title: 'Market Opportunity',
    message: 'Tomato prices increased 15% this week. Good time for harvest if crops are ready.',
    priority: 'medium',
    icon: 'trending-up'
  },
  {
    type: 'prediction',
    title: 'Pest Prediction',
    message: '70% chance of aphid outbreak in next 5 days based on weather patterns.',
    priority: 'high',
    icon: 'alert-triangle'
  }
];

// Mock history of recent scans with AI confidence
const recentScans = [
  {
    id: '1',
    name: 'Aphids',
    date: '2 days ago',
    cropType: 'Wheat',
    confidence: 89,
    severity: 'moderate',
    imageUrl: 'https://picsum.photos/400/300?random=5'
  },
  {
    id: '2',
    name: 'Late Blight',
    date: '1 week ago',
    cropType: 'Tomato',
    confidence: 94,
    severity: 'high',
    imageUrl: 'https://picsum.photos/400/300?random=6'
  },
  {
    id: '3',
    name: 'Nitrogen Deficiency',
    date: 'Yesterday',
    cropType: 'Corn',
    confidence: 87,
    severity: 'moderate',
    imageUrl: 'https://picsum.photos/400/300?random=7'
  }
];

export default function PestIdentificationScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showChemicals, setShowChemicals] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  const categories = ['All', 'Pests', 'Diseases', 'Deficiencies'];

  useEffect(() => {
    // Simulate real-time AI insights updates
    const interval = setInterval(() => {
      // Update insights or market data
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Simulate advanced AI pest identification scanning
  const handleScanImage = async () => {
    if (!permission) {
      // Camera permissions are still loading.
      return;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet.
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to scan plants.');
        return;
      }
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
        setShowCamera(false);
        processImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access is needed to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

  const processImage = (uri: string) => {
    setIsScanning(true);
    // Simulate AI processing of the actual captured image
    setTimeout(() => {
      setIsScanning(false);
      const randomIndex = Math.floor(Math.random() * pestDatabase.length);
      setScanResult({
        ...pestDatabase[randomIndex],
        imageUrl: uri // Use the real photo taken/picked
      });
    }, 3000);
  };

  // Reset scan results
  const handleReset = () => {
    setScanResult(null);
  };

  // Filter database based on category and search
  const filteredDatabase = pestDatabase.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ||
      (selectedCategory === 'Pests' && item.type === 'pest') ||
      (selectedCategory === 'Diseases' && item.type === 'disease') ||
      (selectedCategory === 'Deficiencies' && item.type === 'deficiency');
    return matchesSearch && matchesCategory;
  });

  // Get real-time market prices for chemicals
  const getChemicalMarketPrice = async (chemicalName) => {
    // This would connect to actual market price APIs
    // For now, return the stored price
    return "Live price";
  };

  // Header with back button and AI status
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#212121" />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>AI Crop Health Scanner</Text>
        <View style={styles.aiStatus}>
          <View style={styles.aiIndicator} />
          <Text style={styles.aiStatusText}>AI Analysis Active</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.helpButton}>
        <Feather name="help-circle" size={24} color="#212121" />
      </TouchableOpacity>
    </View>
  );

  // AI Insights Card
  const AIInsightsCard = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>AI Insights</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {aiInsights.map((insight, index) => (
          <View key={index} style={[
            styles.insightCard,
            insight.priority === 'high' && styles.highPriorityCard
          ]}>
            <View style={styles.insightHeader}>
              <Feather name={insight.icon as any} size={20} color={
                insight.priority === 'high' ? '#F44336' : '#2E8B57'
              } />
              <Text style={[
                styles.insightPriority,
                insight.priority === 'high' && styles.highPriorityText
              ]}>
                {insight.priority.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightMessage}>{insight.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Chemical recommendation card
  const ChemicalCard = ({ chemical, isOrganic = false }) => (
    <View style={[styles.chemicalCard, isOrganic && styles.organicCard]}>
      <View style={styles.chemicalHeader}>
        <Text style={styles.chemicalName}>{chemical.name}</Text>
        {isOrganic && (
          <View style={styles.organicBadge}>
            <Text style={styles.organicBadgeText}>ORGANIC</Text>
          </View>
        )}
      </View>

      <View style={styles.chemicalDetails}>
        <View style={styles.chemicalRow}>
          <MaterialIcons name="local-hospital" size={16} color="#6B7280" />
          <Text style={styles.chemicalLabel}>Dosage: </Text>
          <Text style={styles.chemicalValue}>{chemical.dosage}</Text>
        </View>

        {chemical.applicationMethod && (
          <View style={styles.chemicalRow}>
            <MaterialIcons name="opacity" size={16} color="#6B7280" />
            <Text style={styles.chemicalLabel}>Method: </Text>
            <Text style={styles.chemicalValue}>{chemical.applicationMethod}</Text>
          </View>
        )}

        {chemical.frequency && (
          <View style={styles.chemicalRow}>
            <MaterialIcons name="schedule" size={16} color="#6B7280" />
            <Text style={styles.chemicalLabel}>Frequency: </Text>
            <Text style={styles.chemicalValue}>{chemical.frequency}</Text>
          </View>
        )}

        <View style={styles.chemicalRow}>
          <MaterialIcons name="currency-rupee" size={16} color="#2E8B57" />
          <Text style={styles.chemicalLabel}>Price: </Text>
          <Text style={[styles.chemicalValue, styles.priceText]}>{chemical.price}</Text>
        </View>

        {chemical.manufacturer && (
          <View style={styles.chemicalRow}>
            <MaterialIcons name="business" size={16} color="#6B7280" />
            <Text style={styles.chemicalLabel}>Brand: </Text>
            <Text style={styles.chemicalValue}>{chemical.manufacturer}</Text>
          </View>
        )}

        {chemical.safetyPeriod && (
          <View style={styles.chemicalRow}>
            <MaterialIcons name="security" size={16} color="#F44336" />
            <Text style={styles.chemicalLabel}>Safety: </Text>
            <Text style={[styles.chemicalValue, styles.safetyText]}>{chemical.safetyPeriod}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#757575" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pests, diseases, or deficiencies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={20} color="#2E8B57" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
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
        </ScrollView>

        {!scanResult ? (
          <>
            {/* AI Insights */}
            <AIInsightsCard />

            {/* Enhanced Scan Section */}
            <View style={styles.scanContainer}>
              <View style={styles.scanImageContainer}>
                {isScanning ? (
                  <View style={styles.scanningOverlay}>
                    {capturedImage && (
                      <Image
                        source={{ uri: capturedImage }}
                        style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
                        resizeMode="cover"
                      />
                    )}
                    <ActivityIndicator size="large" color="#2E8B57" />
                    <Text style={styles.scanningText}>AI analyzing photo...</Text>
                    <Text style={styles.scanningSubtext}>Applying computer vision models...</Text>
                    <View style={styles.scanningProgress}>
                      <View style={styles.progressBar} />
                    </View>
                  </View>
                ) : (
                  <>
                    <Image
                      source={{ uri: capturedImage || 'https://picsum.photos/400/300?random=8' }}
                      style={styles.scanImage}
                      resizeMode="cover"
                    />
                    {!capturedImage && (
                      <View style={styles.scanOverlay}>
                        <MaterialIcons name="camera-enhance" size={48} color="#FFFFFF" />
                        <Text style={styles.scanText}>AI-Powered Plant Analysis</Text>
                        <Text style={styles.scanSubtext}>95% accuracy • Instant results</Text>
                      </View>
                    )}
                  </>
                )}
              </View>

              <View style={styles.scanOptions}>
                <TouchableOpacity style={styles.scanOptionButton} onPress={handleScanImage}>
                  <Feather name="camera" size={24} color="#FFFFFF" />
                  <Text style={styles.scanOptionText}>Scan Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Feather name="upload" size={20} color="#2E8B57" />
                  <Text style={styles.uploadText}>Upload Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Camera Overlay */}
            {showCamera && (
              <View style={StyleSheet.absoluteFill}>
                <CameraView
                  style={StyleSheet.absoluteFill}
                  ref={cameraRef}
                  facing="back"
                >
                  <View style={styles.cameraOverlay}>
                    <TouchableOpacity
                      style={styles.closeCameraButton}
                      onPress={() => setShowCamera(false)}
                    >
                      <Feather name="x" size={28} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.cameraFrame} />

                    <View style={styles.cameraControls}>
                      <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                      >
                        <View style={styles.captureInner} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.cameraInstruction}>
                      Align the plant/pest within the frame
                    </Text>
                  </View>
                </CameraView>
              </View>
            )}

            {/* Recent Scans with AI confidence */}
            <View style={styles.recentScansContainer}>
              <Text style={styles.sectionTitle}>Recent AI Scans</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recentScans.map((scan, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentScanItem}
                    onPress={() => {
                      const pest = pestDatabase.find(p => p.name === scan.name);
                      if (pest) setScanResult(pest);
                    }}
                  >
                    <Image
                      source={{ uri: scan.imageUrl }}
                      style={styles.recentScanImage}
                      resizeMode="cover"
                    />
                    <View style={styles.recentScanInfo}>
                      <Text style={styles.recentScanName}>{scan.name}</Text>
                      <Text style={styles.recentScanDate}>{scan.date} • {scan.cropType}</Text>
                      <View style={styles.confidenceContainer}>
                        <Text style={styles.confidenceText}>{scan.confidence}% confidence</Text>
                        <View style={[
                          styles.severityDot,
                          { backgroundColor: scan.severity === 'high' ? '#F44336' : '#FFC107' }
                        ]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Enhanced Database */}
            <View style={styles.databaseContainer}>
              <Text style={styles.sectionTitle}>Knowledge Database</Text>
              {filteredDatabase.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.databaseItem}
                  onPress={() => setScanResult(item)}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.databaseImage}
                    resizeMode="cover"
                  />
                  <View style={styles.databaseInfo}>
                    <View style={styles.databaseHeader}>
                      <Text style={styles.databaseName}>{item.name}</Text>
                      <View style={[
                        styles.typeBadge,
                        item.type === 'pest' && styles.pestBadge,
                        item.type === 'disease' && styles.diseaseBadge,
                        item.type === 'deficiency' && styles.deficiencyBadge
                      ]}>
                        <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.databaseScientific}>{item.scientificName}</Text>
                    <View style={styles.databaseCrops}>
                      {item.crops.slice(0, 3).map((crop, i) => (
                        <Text key={i} style={styles.cropText}>{crop}</Text>
                      ))}
                      {item.crops.length > 3 && (
                        <Text style={styles.moreCropsText}>+{item.crops.length - 3} more</Text>
                      )}
                    </View>
                    <View style={styles.confidenceRow}>
                      <Text style={styles.aiAccuracy}>AI Accuracy: {item.confidenceLevel}%</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.severityIndicator,
                    {
                      backgroundColor:
                        item.severity === 'high' ? '#F44336' :
                          item.severity === 'moderate' ? '#FFC107' : '#4CAF50'
                    }
                  ]} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          // Enhanced Scan Result View
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleContainer}>
                <Text style={styles.resultName}>{scanResult.name}</Text>
                <Text style={styles.resultScientific}>{scanResult.scientificName}</Text>
                <View style={styles.resultBadges}>
                  <View style={[
                    styles.typeBadge,
                    scanResult.type === 'pest' && styles.pestBadge,
                    scanResult.type === 'disease' && styles.diseaseBadge,
                    scanResult.type === 'deficiency' && styles.deficiencyBadge
                  ]}>
                    <Text style={styles.typeBadgeText}>{scanResult.type.toUpperCase()}</Text>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <MaterialIcons name="psychology" size={16} color="#2E8B57" />
                    <Text style={styles.confidenceBadgeText}>{scanResult.confidenceLevel}% AI Match</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeResultButton}
                onPress={handleReset}
              >
                <Feather name="x" size={24} color="#212121" />
              </TouchableOpacity>
            </View>

            <Image
              source={{ uri: scanResult.imageUrl }}
              style={styles.resultImage}
              resizeMode="cover"
            />

            <View style={styles.severityContainer}>
              <Text style={styles.severityLabel}>Threat Level: </Text>
              <View style={styles.severityLevelContainer}>
                <View style={[
                  styles.severityLevel,
                  {
                    width: scanResult.severity === 'high' ? '100%' :
                      scanResult.severity === 'moderate' ? '60%' : '30%',
                    backgroundColor:
                      scanResult.severity === 'high' ? '#F44336' :
                        scanResult.severity === 'moderate' ? '#FFC107' : '#4CAF50'
                  }
                ]} />
              </View>
              <Text style={[
                styles.severityText,
                {
                  color:
                    scanResult.severity === 'high' ? '#F44336' :
                      scanResult.severity === 'moderate' ? '#FFC107' : '#4CAF50'
                }
              ]}>
                {scanResult.severity.charAt(0).toUpperCase() + scanResult.severity.slice(1)}
              </Text>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Description</Text>
              <Text style={styles.resultText}>{scanResult.description}</Text>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Symptoms to Look For</Text>
              <Text style={styles.resultText}>{scanResult.symptoms}</Text>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Affected Crops</Text>
              <View style={styles.resultCrops}>
                {scanResult.crops.map((crop, index) => (
                  <View key={index} style={styles.resultCropTag}>
                    <MaterialCommunityIcons name="seed-outline" size={16} color="#2E8B57" />
                    <Text style={styles.resultCropText}>{crop}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Chemical Recommendations Section */}
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.resultSectionTitle}>Chemical Solutions</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowChemicals(!showChemicals)}
                >
                  <Text style={styles.toggleText}>
                    {showChemicals ? 'Hide' : 'Show'} Details
                  </Text>
                  <Feather
                    name={showChemicals ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#2E8B57"
                  />
                </TouchableOpacity>
              </View>

              {showChemicals && (
                <>
                  <Text style={styles.subsectionTitle}>Recommended Chemicals</Text>
                  {scanResult.chemicals.map((chemical, index) => (
                    <ChemicalCard key={index} chemical={chemical} />
                  ))}

                  <Text style={styles.subsectionTitle}>Organic Alternatives</Text>
                  {scanResult.organicAlternatives.map((organic, index) => (
                    <ChemicalCard key={index} chemical={organic} isOrganic={true} />
                  ))}
                </>
              )}
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Treatment Steps</Text>
              <View style={styles.bulletPointList}>
                {scanResult.treatment.map((item, index) => (
                  <View key={index} style={styles.bulletPoint}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Prevention Tips</Text>
              <View style={styles.bulletPointList}>
                {scanResult.preventionTips.map((tip, index) => (
                  <View key={index} style={styles.bulletPoint}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.expertButton}>
                <FontAwesome5 name="user-md" size={18} color="#FFFFFF" />
                <Text style={styles.expertButtonText}>Consult Expert</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.marketButton}>
                <MaterialIcons name="store" size={18} color="#FFFFFF" />
                <Text style={styles.marketButtonText}>Check Prices</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  aiIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  aiStatusText: {
    fontSize: 12,
    color: '#757575',
  },
  helpButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
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
  filterButton: {
    padding: 8,
    borderRadius: 6,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
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
  insightsContainer: {
    marginTop: 16,
  },
  insightCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginLeft: 16,
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  highPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightPriority: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    color: '#2E8B57',
  },
  highPriorityText: {
    color: '#F44336',
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1F2937',
  },
  insightMessage: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  scanContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scanImageContainer: {
    position: 'relative',
    height: 220,
  },
  scanImage: {
    width: '100%',
    height: '100%',
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  scanSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  scanningSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
  },
  scanningProgress: {
    marginTop: 20,
    width: '70%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressBar: {
    width: '70%',
    height: '100%',
    backgroundColor: '#2E8B57',
    borderRadius: 2,
  },
  scanOptions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  scanOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2E8B57',
  },
  scanOptionText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginLeft: 12,
  },
  uploadText: {
    color: '#2E8B57',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  recentScansContainer: {
    marginTop: 24,
  },
  recentScanItem: {
    width: 160,
    marginLeft: 16,
    marginRight: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentScanImage: {
    width: '100%',
    height: 100,
  },
  recentScanInfo: {
    padding: 12,
  },
  recentScanName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  recentScanDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  confidenceText: {
    fontSize: 11,
    color: '#2E8B57',
    fontWeight: '500',
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  databaseContainer: {
    marginTop: 24,
    paddingBottom: 16,
  },
  databaseItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  databaseImage: {
    width: 100,
    height: 120,
  },
  databaseInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  databaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  databaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  databaseScientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 8,
  },
  databaseCrops: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropText: {
    fontSize: 11,
    color: '#2E8B57',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  moreCropsText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiAccuracy: {
    fontSize: 12,
    color: '#2E8B57',
    fontWeight: '500',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  pestBadge: {
    backgroundColor: '#FEF3C7',
  },
  diseaseBadge: {
    backgroundColor: '#DBEAFE',
  },
  deficiencyBadge: {
    backgroundColor: '#D1FAE5',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  severityIndicator: {
    width: 6,
    height: '100%',
  },

  // Result container styles
  resultContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultTitleContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  resultScientific: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
    marginTop: 2,
  },
  resultBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  confidenceBadgeText: {
    fontSize: 12,
    color: '#2E8B57',
    fontWeight: '600',
    marginLeft: 4,
  },
  closeResultButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  resultImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },
  severityLevelContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
  },
  severityLevel: {
    height: 8,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultSection: {
    marginBottom: 24,
  },
  resultSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  resultCrops: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultCropTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  resultCropText: {
    fontSize: 12,
    color: '#2E8B57',
    fontWeight: '500',
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  toggleText: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '500',
    marginRight: 4,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
    color: '#1F2937',
  },

  // Chemical card styles
  chemicalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  organicCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  chemicalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chemicalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  organicBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  organicBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chemicalDetails: {
    gap: 8,
  },
  chemicalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  chemicalLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 8,
    minWidth: 60,
  },
  chemicalValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  priceText: {
    color: '#2E8B57',
    fontWeight: '600',
  },
  safetyText: {
    color: '#F44336',
    fontWeight: '500',
  },
  bulletPointList: {
    marginTop: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E8B57',
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },

  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  expertButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2E8B57',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  expertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  marketButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#059669',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  marketButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 30,
  },
  closeCameraButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  cameraFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  cameraControls: {
    alignItems: 'center',
    marginBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFFFFF',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  cameraInstruction: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
});