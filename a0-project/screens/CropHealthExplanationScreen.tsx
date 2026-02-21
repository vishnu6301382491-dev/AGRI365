import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CropHealthData {
  id: string;
  name: string;
  category: 'pest' | 'disease' | 'deficiency' | 'disorder';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: {
    chemical: string[];
    organic: string[];
    preventive: string[];
  };
  affectedCrops: string[];
  timeToRecover: string;
  preventionTips: string[];
}

export default function CropHealthExplanationScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cropHealthData, setCropHealthData] = useState<CropHealthData[]>([]);
  const [filteredData, setFilteredData] = useState<CropHealthData[]>([]);
  const [selectedItem, setSelectedItem] = useState<CropHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCropHealthData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, selectedCategory, cropHealthData]);

  const loadCropHealthData = async () => {
    setLoading(true);
    // Simulate API call to load comprehensive crop health data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sampleData: CropHealthData[] = [
      {
        id: '1',
        name: 'Aphids',
        category: 'pest',
        severity: 'medium',
        description: 'Small, soft-bodied insects that feed on plant sap, causing stunted growth and yellowing leaves.',
        symptoms: ['Yellowing leaves', 'Stunted growth', 'Sticky honeydew', 'Curled leaves', 'Black sooty mold'],
        causes: ['Overcrowding', 'High nitrogen levels', 'Warm weather', 'Poor air circulation'],
        treatments: {
          chemical: ['Imidacloprid 17.8% SL (0.5ml/L)', 'Thiamethoxam 25% WG (0.2g/L)', 'Acetamiprid 20% SP (0.2g/L)'],
          organic: ['Neem oil spray (5ml/L)', 'Insecticidal soap', 'Ladybug release', 'Garlic spray'],
          preventive: ['Regular monitoring', 'Proper spacing', 'Encourage beneficial insects', 'Remove weeds']
        },
        affectedCrops: ['Tomato', 'Pepper', 'Cucumber', 'Beans', 'Lettuce'],
        timeToRecover: '7-14 days with treatment',
        preventionTips: ['Use reflective mulch', 'Plant companion herbs', 'Maintain proper plant spacing', 'Regular inspection']
      },
      {
        id: '2',
        name: 'Early Blight',
        category: 'disease',
        severity: 'high',
        description: 'Fungal disease causing dark spots with concentric rings on leaves, leading to defoliation.',
        symptoms: ['Dark brown spots on leaves', 'Concentric ring patterns', 'Yellow halos around spots', 'Premature leaf drop'],
        causes: ['High humidity', 'Warm temperatures', 'Poor air circulation', 'Water on leaves', 'Plant stress'],
        treatments: {
          chemical: ['Copper oxychloride 50% WP (3g/L)', 'Mancozeb 75% WP (2.5g/L)', 'Azoxystrobin 23% SC (1ml/L)'],
          organic: ['Baking soda spray (5g/L)', 'Copper-based fungicides', 'Compost tea', 'Milk spray'],
          preventive: ['Crop rotation', 'Proper spacing', 'Mulching', 'Drip irrigation']
        },
        affectedCrops: ['Tomato', 'Potato', 'Eggplant', 'Pepper'],
        timeToRecover: '2-3 weeks with proper treatment',
        preventionTips: ['Avoid overhead watering', 'Remove infected plant debris', 'Improve air circulation', 'Use disease-resistant varieties']
      },
      {
        id: '3',
        name: 'Nitrogen Deficiency',
        category: 'deficiency',
        severity: 'medium',
        description: 'Nutrient deficiency causing yellowing of older leaves and stunted plant growth.',
        symptoms: ['Yellowing of older leaves', 'Stunted growth', 'Pale green color', 'Reduced yield', 'Poor fruit development'],
        causes: ['Poor soil fertility', 'Excessive rainfall', 'Sandy soils', 'Over-cultivation', 'pH imbalance'],
        treatments: {
          chemical: ['Urea 46% N (20-30g/plant)', 'Ammonium sulfate (15-25g/plant)', 'NPK 20:20:20 (2-3g/L)'],
          organic: ['Compost application', 'Fish emulsion (5ml/L)', 'Blood meal', 'Green manure'],
          preventive: ['Regular soil testing', 'Balanced fertilization', 'Organic matter addition', 'Proper pH management']
        },
        affectedCrops: ['All crops', 'Leafy vegetables', 'Cereals', 'Legumes'],
        timeToRecover: '1-2 weeks after fertilizer application',
        preventionTips: ['Regular soil testing', 'Balanced fertilization schedule', 'Add organic matter', 'Monitor plant color']
      },
      {
        id: '4',
        name: 'Spider Mites',
        category: 'pest',
        severity: 'high',
        description: 'Tiny arachnids that create fine webbing and cause stippling damage on leaves.',
        symptoms: ['Fine webbing on leaves', 'Yellow stippling', 'Bronze appearance', 'Leaf drop', 'Reduced vigor'],
        causes: ['Hot, dry conditions', 'Low humidity', 'Dusty conditions', 'Pesticide overuse'],
        treatments: {
          chemical: ['Abamectin 1.8% EC (0.5ml/L)', 'Spiromesifen 22.9% SC (0.5ml/L)', 'Propargite 57% EC (2ml/L)'],
          organic: ['Neem oil (5ml/L)', 'Predatory mites release', 'Horticultural oil', 'High-pressure water spray'],
          preventive: ['Increase humidity', 'Regular misting', 'Avoid over-fertilization', 'Encourage beneficial insects']
        },
        affectedCrops: ['Tomato', 'Bean', 'Cucumber', 'Strawberry', 'Rose'],
        timeToRecover: '10-14 days with consistent treatment',
        preventionTips: ['Maintain proper humidity', 'Regular water spray', 'Avoid dusty conditions', 'Monitor regularly']
      },
      {
        id: '5',
        name: 'Powdery Mildew',
        category: 'disease',
        severity: 'medium',
        description: 'White, powdery fungal growth on leaf surfaces, reducing photosynthesis.',
        symptoms: ['White powdery coating', 'Yellowing leaves', 'Stunted growth', 'Premature leaf drop', 'Distorted leaves'],
        causes: ['High humidity', 'Poor air circulation', 'Crowded plants', 'Cool nights, warm days'],
        treatments: {
          chemical: ['Sulfur 80% WP (3g/L)', 'Tebuconazole 10% + Sulphur 65% WG (2g/L)', 'Myclobutanil 10% WP (1g/L)'],
          organic: ['Baking soda spray (5g/L)', 'Milk spray (1:10 ratio)', 'Potassium bicarbonate', 'Neem oil'],
          preventive: ['Proper spacing', 'Good air circulation', 'Avoid overhead watering', 'Remove infected parts']
        },
        affectedCrops: ['Cucumber', 'Zucchini', 'Grapes', 'Rose', 'Peas'],
        timeToRecover: '1-2 weeks with proper treatment',
        preventionTips: ['Improve air circulation', 'Plant resistant varieties', 'Avoid crowding', 'Morning watering']
      }
    ];
    
    setCropHealthData(sampleData);
    setLoading(false);
  };

  const filterData = () => {
    let filtered = cropHealthData;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredData(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      case 'critical': return '#D32F2F';
      default: return '#9E9E9E';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pest': return 'bug';
      case 'disease': return 'medical';
      case 'deficiency': return 'flask';
      case 'disorder': return 'warning';
      default: return 'help-circle';
    }
  };

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'pest', name: 'Pests', icon: 'bug' },
    { id: 'disease', name: 'Diseases', icon: 'medical' },
    { id: 'deficiency', name: 'Deficiencies', icon: 'flask' },
    { id: 'disorder', name: 'Disorders', icon: 'warning' }
  ];

  const renderCategoryFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Ionicons
            name={category.icon as any}
            size={20}
            color={selectedCategory === category.id ? '#FFFFFF' : '#4CAF50'}
          />
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderHealthItem = (item: CropHealthData) => (
    <TouchableOpacity
      key={item.id}
      style={styles.healthCard}
      onPress={() => setSelectedItem(item)}
    >
      <View style={styles.healthCardHeader}>
        <View style={styles.healthCardTitle}>
          <Ionicons
            name={getCategoryIcon(item.category) as any}
            size={24}
            color="#4CAF50"
          />
          <Text style={styles.healthCardName}>{item.name}</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.healthCardDescription}>{item.description}</Text>
      
      <View style={styles.healthCardFooter}>
        <Text style={styles.affectedCropsText}>
          Affects: {item.affectedCrops.slice(0, 3).join(', ')}
          {item.affectedCrops.length > 3 && ` +${item.affectedCrops.length - 3} more`}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  );

  const renderDetailView = () => {
    if (!selectedItem) return null;

    return (
      <ScrollView style={styles.detailContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedItem(null)}
        >
          <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          <Text style={styles.backButtonText}>Back to List</Text>
        </TouchableOpacity>

        <View style={styles.detailHeader}>
          <View style={styles.detailTitleRow}>
            <Ionicons
              name={getCategoryIcon(selectedItem.category) as any}
              size={32}
              color="#4CAF50"
            />
            <View style={styles.detailTitleText}>
              <Text style={styles.detailTitle}>{selectedItem.name}</Text>
              <Text style={styles.detailCategory}>{selectedItem.category.toUpperCase()}</Text>
            </View>
            <View style={[styles.detailSeverityBadge, { backgroundColor: getSeverityColor(selectedItem.severity) }]}>
              <Text style={styles.detailSeverityText}>{selectedItem.severity.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.detailDescription}>{selectedItem.description}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Symptoms</Text>
          {selectedItem.symptoms.map((symptom, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="ellipse" size={6} color="#4CAF50" />
              <Text style={styles.listItemText}>{symptom}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Causes</Text>
          {selectedItem.causes.map((cause, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="ellipse" size={6} color="#FF9800" />
              <Text style={styles.listItemText}>{cause}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Treatment Options</Text>
          
          <View style={styles.treatmentCategory}>
            <Text style={styles.treatmentCategoryTitle}>🧪 Chemical Treatments</Text>
            {selectedItem.treatments.chemical.map((treatment, index) => (
              <View key={index} style={styles.treatmentItem}>
                <Text style={styles.treatmentText}>{treatment}</Text>
              </View>
            ))}
          </View>

          <View style={styles.treatmentCategory}>
            <Text style={styles.treatmentCategoryTitle}>🌱 Organic Treatments</Text>
            {selectedItem.treatments.organic.map((treatment, index) => (
              <View key={index} style={styles.treatmentItem}>
                <Text style={styles.treatmentText}>{treatment}</Text>
              </View>
            ))}
          </View>

          <View style={styles.treatmentCategory}>
            <Text style={styles.treatmentCategoryTitle}>🛡️ Preventive Measures</Text>
            {selectedItem.treatments.preventive.map((treatment, index) => (
              <View key={index} style={styles.treatmentItem}>
                <Text style={styles.treatmentText}>{treatment}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Recovery Information</Text>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Recovery Time: {selectedItem.timeToRecover}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Prevention Tips</Text>
          {selectedItem.preventionTips.map((tip, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark" size={16} color="#4CAF50" />
              <Text style={styles.listItemText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Affected Crops</Text>
          <View style={styles.cropsContainer}>
            {selectedItem.affectedCrops.map((crop, index) => (
              <View key={index} style={styles.cropTag}>
                <Text style={styles.cropTagText}>{crop}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading crop health database...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedItem ? (
        renderDetailView()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Crop Health Guide</Text>
            <Text style={styles.headerSubtitle}>Comprehensive disease, pest & deficiency database</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search symptoms, diseases, pests..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {renderCategoryFilter()}

          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.resultsText}>
              {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found
            </Text>
            {filteredData.map(renderHealthItem)}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
  healthCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  healthCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  healthCardDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  healthCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  affectedCropsText: {
    color: '#999',
    fontSize: 12,
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailHeader: {
    padding: 20,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTitleText: {
    flex: 1,
    marginLeft: 12,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailCategory: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  detailSeverityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailSeverityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailDescription: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 22,
  },
  detailSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  treatmentCategory: {
    marginBottom: 20,
  },
  treatmentCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  treatmentItem: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  treatmentText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cropTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  cropTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});