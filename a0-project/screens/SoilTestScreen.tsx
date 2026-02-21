import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // For icons

type SoilTestResult = {
  overallHealth: string;
  recommendations: {
    fertilizer: string;
    treatment: string;
    organicOptions: string;
    costEstimate: string;
  };
  nutrients: {
    nitrogen: { level: string; status: string };
    phosphorus: { level: string; status: string };
    potassium: { level: string; status: string };
    pH: { level: string; status: string };
  };
};

type RootStackParamList = {
  SoilTest: undefined;
};

type SoilTestScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SoilTest'>;

const SoilTestScreen = () => {
  const navigation = useNavigation<SoilTestScreenNavigationProp>();
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [ph, setPh] = useState('');
  const [result, setResult] = useState<SoilTestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSoil = async () => {
    if (!nitrogen || !phosphorus || !potassium || !ph) {
      Alert.alert('Error', 'Please fill in all soil parameters.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      // Simulate analysis delay without making actual network requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate AI analysis results based on input parameters
      const mockResult: SoilTestResult = {
        overallHealth: ph >= 6.0 && ph <= 7.0 ? 'Good' : ph < 6.0 ? 'Acidic' : 'Alkaline',
        recommendations: {
          fertilizer: nitrogen < 50 ? 'High nitrogen fertilizer recommended' : 'Balanced NPK fertilizer',
          treatment: ph < 6.0 ? 'Apply lime to increase pH' : ph > 7.5 ? 'Apply sulfur to decrease pH' : 'Maintain current pH level',
          organicOptions: 'Compost and organic matter addition recommended',
          costEstimate: `₹${Math.floor(Math.random() * 3000 + 1500)}`
        },
        nutrients: {
          nitrogen: { level: nitrogen, status: nitrogen < 40 ? 'Low' : nitrogen > 80 ? 'High' : 'Optimal' },
          phosphorus: { level: phosphorus, status: phosphorus < 25 ? 'Low' : phosphorus > 60 ? 'High' : 'Optimal' },
          potassium: { level: potassium, status: potassium < 150 ? 'Low' : potassium > 300 ? 'High' : 'Optimal' },
          pH: { level: ph, status: ph < 6.0 ? 'Too Acidic' : ph > 7.5 ? 'Too Alkaline' : 'Good' }
        }
      };

      setResult(mockResult);
      Alert.alert('Success', 'Soil analysis complete!');
    } catch (error) {
      console.error('Soil test error:', error);
      Alert.alert('Error', 'Analysis error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Soil Test & Recommendations</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nitrogen (N) - (e.g., mg/kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Nitrogen level"
          value={nitrogen}
          onChangeText={setNitrogen}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phosphorus (P) - (e.g., mg/kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phosphorus level"
          value={phosphorus}
          onChangeText={setPhosphorus}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Potassium (K) - (e.g., mg/kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Potassium level"
          value={potassium}
          onChangeText={setPotassium}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>pH Level (1-14)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter pH level"
          value={ph}
          onChangeText={setPh}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={analyzeSoil}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Analyzing Soil...' : 'Get Recommendations'}
        </Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Analysis Results</Text>
          
          <Text style={styles.resultText}>
            <Text style={{ fontWeight: 'bold' }}>Overall Health:</Text> {result.overallHealth}
          </Text>
          
          <Text style={styles.resultSubtitle}>Nutrient Levels:</Text>
          <Text style={styles.resultText}>
            <Text style={{ fontWeight: 'bold' }}>Nitrogen:</Text> {result.nutrients.nitrogen.level} mg/kg ({result.nutrients.nitrogen.status})
          </Text>
          <Text style={styles.resultText}>
            <Text style={{ fontWeight: 'bold' }}>Phosphorus:</Text> {result.nutrients.phosphorus.level} mg/kg ({result.nutrients.phosphorus.status})
          </Text>
          <Text style={styles.resultText}>
            <Text style={{ fontWeight: 'bold' }}>Potassium:</Text> {result.nutrients.potassium.level} mg/kg ({result.nutrients.potassium.status})
          </Text>
          <Text style={styles.resultText}>
            <Text style={{ fontWeight: 'bold' }}>pH Level:</Text> {result.nutrients.pH.level} ({result.nutrients.pH.status})
          </Text>
          
          <Text style={styles.resultSubtitle}>Recommendations:</Text>
          <Text style={styles.recommendationText}>{result.recommendations.fertilizer}</Text>
          <Text style={styles.recommendationText}>{result.recommendations.treatment}</Text>
          <Text style={styles.recommendationText}>{result.recommendations.organicOptions}</Text>
          <Text style={styles.costText}>Estimated Cost: {result.recommendations.costEstimate}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    width: '100%',
    backgroundColor: '#28a745', // Green color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  resultSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 15,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 17,
    color: '#007bff',
    marginTop: 15,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '600',
  },
  costText: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 15,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SoilTestScreen;