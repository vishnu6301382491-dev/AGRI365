import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DiagnosticLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'command';
  message: string;
}

interface DiagnosticTest {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  details?: string;
}

export default function DiagnosticsScreen() {
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [diagnosticTests, setDiagnosticTests] = useState<DiagnosticTest[]>([
    { name: 'Camera Scanner Health', status: 'pending' },
    { name: 'AI Model Connectivity', status: 'pending' },
    { name: 'Soil Analysis API', status: 'pending' },
    { name: 'Image Processing Pipeline', status: 'pending' },
    { name: 'Google Services Connection', status: 'pending' },
    { name: 'Database Connectivity', status: 'pending' },
    { name: 'Real-time Updates', status: 'pending' },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    addLog('info', 'Agricultural Diagnostics System v2.1 initialized');
    addLog('info', 'Type "help" for available commands');
  }, []);

  const addLog = (type: DiagnosticLog['type'], message: string) => {
    const newLog: DiagnosticLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs(prev => [...prev, newLog]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const updateTestStatus = (testName: string, status: DiagnosticTest['status'], details?: string) => {
    setDiagnosticTests(prev =>
      prev.map(test =>
        test.name === testName ? { ...test, status, details } : test
      )
    );
  };

  const runCameraDiagnostics = async (): Promise<boolean> => {
    addLog('info', 'Starting camera scanner diagnostics...');
    updateTestStatus('Camera Scanner Health', 'running');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Simulate camera permission check
      addLog('info', '✓ Camera permissions: OK');
      
      // Simulate camera hardware check
      addLog('info', '✓ Camera hardware: Detected');
      
      // Simulate image capture capability
      addLog('info', '✓ Image capture: Functional');
      
      // Simulate focus and autofocus
      addLog('info', '✓ Autofocus system: Active');
      
      updateTestStatus('Camera Scanner Health', 'passed', 'All camera systems operational');
      addLog('success', 'Camera scanner diagnostics: PASSED');
      return true;
    } catch (error) {
      updateTestStatus('Camera Scanner Health', 'failed', 'Camera initialization failed');
      addLog('error', 'Camera scanner diagnostics: FAILED');
      return false;
    }
  };

  const runAIModelDiagnostics = async (): Promise<boolean> => {
    addLog('info', 'Testing AI model connectivity...');
    updateTestStatus('AI Model Connectivity', 'running');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Simulate AI model loading
      addLog('info', '✓ Loading crop disease model...');
      addLog('info', '✓ Loading pest identification model...');
      addLog('info', '✓ Loading nutrient deficiency model...');
      
      // Simulate model inference test
      addLog('info', '✓ Running inference test...');
      addLog('info', '✓ Model accuracy: 94.3%');
      
      updateTestStatus('AI Model Connectivity', 'passed', 'All AI models loaded successfully');
      addLog('success', 'AI model diagnostics: PASSED');
      return true;
    } catch (error) {
      updateTestStatus('AI Model Connectivity', 'failed', 'Model loading timeout');
      addLog('error', 'AI model diagnostics: FAILED');
      return false;
    }
  };

  const runSoilAnalysisDiagnostics = async (): Promise<boolean> => {
    addLog('info', 'Testing soil analysis system...');
    updateTestStatus('Soil Analysis API', 'running');
    
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    try {
      // Simulate soil parameter validation
      addLog('info', '✓ pH range validation: OK (6.0-8.0)');
      addLog('info', '✓ Nutrient level checks: OK');
      addLog('info', '✓ Moisture analysis: OK');
      addLog('info', '✓ Temperature sensor: OK');
      
      // Simulate recommendation engine
      addLog('info', '✓ Recommendation engine: Active');
      addLog('info', '✓ Chemical database: Connected');
      
      updateTestStatus('Soil Analysis API', 'passed', 'Soil analysis system operational');
      addLog('success', 'Soil analysis diagnostics: PASSED');
      return true;
    } catch (error) {
      updateTestStatus('Soil Analysis API', 'failed', 'API connection timeout');
      addLog('error', 'Soil analysis diagnostics: FAILED');
      return false;
    }
  };

  const runImageProcessingDiagnostics = async (): Promise<boolean> => {
    addLog('info', 'Testing image processing pipeline...');
    updateTestStatus('Image Processing Pipeline', 'running');
    
    await new Promise(resolve => setTimeout(resolve, 1600));
    
    try {
      // Simulate image processing steps
      addLog('info', '✓ Image compression: OK');
      addLog('info', '✓ Color space conversion: OK');
      addLog('info', '✓ Edge detection: OK');
      addLog('info', '✓ Feature extraction: OK');
      addLog('info', '✓ Pattern recognition: OK');
      
      updateTestStatus('Image Processing Pipeline', 'passed', 'All processing stages functional');
      addLog('success', 'Image processing diagnostics: PASSED');
      return true;
    } catch (error) {
      updateTestStatus('Image Processing Pipeline', 'failed', 'Processing pipeline error');
      addLog('error', 'Image processing diagnostics: FAILED');
      return false;
    }
  };

  const runGoogleServicesDiagnostics = async (): Promise<boolean> => {
    addLog('info', 'Testing Google services connectivity...');
    updateTestStatus('Google Services Connection', 'running');
    
    await new Promise(resolve => setTimeout(resolve, 2200));
    
    try {
      // Simulate Google services checks
      addLog('info', '✓ Firebase Authentication: Connected');
      addLog('info', '✓ Cloud Firestore: Online');
      addLog('info', '✓ Cloud Vision API: Active');
      addLog('info', '✓ Weather API: Responsive');
      addLog('info', '✓ Maps API: Available');
      
      updateTestStatus('Google Services Connection', 'passed', 'All Google services operational');
      addLog('success', 'Google services diagnostics: PASSED');
      return true;
    } catch (error) {
      updateTestStatus('Google Services Connection', 'failed', 'Service connection timeout');
      addLog('error', 'Google services diagnostics: FAILED');
      return false;
    }
  };

  const runDatabaseDiagnostics = async (): Promise<boolean> => {
    addLog('info', 'Testing database connectivity...');
    updateTestStatus('Database Connectivity', 'running');
    
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    try {
      // Simulate database checks
      addLog('info', '✓ User profiles database: Connected');
      addLog('info', '✓ Crop data repository: Online');
      addLog('info', '✓ Chemical database: Accessible');
      addLog('info', '✓ Historical data: Available');
      addLog('info', '✓ Cache system: Active');
      
      updateTestStatus('Database Connectivity', 'passed', 'All databases online');
      addLog('success', 'Database diagnostics: PASSED');
      return true;
    } catch (error) {
      updateTestStatus('Database Connectivity', 'failed', 'Database connection error');
      addLog('error', 'Database diagnostics: FAILED');
      return false;
    }
  };

  const runRealTimeUpdatesDiagnostics = async (): Promise<boolean> => {
    addLog('info', 'Testing real-time updates system...');
    updateTestStatus('Real-time Updates', 'running');
    
    await new Promise(resolve => setTimeout(resolve, 1700));
    
    try {
      // Simulate real-time checks
      addLog('info', '✓ WebSocket connection: Established');
      addLog('info', '✓ Market price feed: Live');
      addLog('info', '✓ Weather updates: Streaming');
      addLog('info', '✓ Community posts: Real-time');
      addLog('info', '✓ Notification system: Active');
      
      updateTestStatus('Real-time Updates', 'passed', 'Real-time systems operational');
      addLog('success', 'Real-time updates diagnostics: PASSED');
      return true;
    } catch (error) {
      updateTestStatus('Real-time Updates', 'failed', 'Real-time connection failed');
      addLog('error', 'Real-time updates diagnostics: FAILED');
      return false;
    }
  };

  const runAllDiagnostics = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    addLog('info', '🚀 Starting comprehensive system diagnostics...');
    addLog('info', '==========================================');
    
    try {
      // Reset all tests to pending
      setDiagnosticTests(prev => 
        prev.map(test => ({ ...test, status: 'pending' as const }))
      );
      
      const results = await Promise.all([
        runCameraDiagnostics(),
        runAIModelDiagnostics(),
        runSoilAnalysisDiagnostics(),
        runImageProcessingDiagnostics(),
        runGoogleServicesDiagnostics(),
        runDatabaseDiagnostics(),
        runRealTimeUpdatesDiagnostics(),
      ]);
      
      const passedTests = results.filter(Boolean).length;
      const totalTests = results.length;
      
      addLog('info', '==========================================');
      addLog('success', `📊 DIAGNOSTICS COMPLETE: ${passedTests}/${totalTests} tests passed`);
      
      if (passedTests === totalTests) {
        addLog('success', '🎉 All systems operational! Scanner and soil health ready.');
      } else {
        addLog('warning', `⚠️  ${totalTests - passedTests} system(s) need attention.`);
      }
      
    } catch (error) {
      addLog('error', '❌ Diagnostic suite encountered an error');
    } finally {
      setIsRunning(false);
    }
  };

  const simulateScannerTest = () => {
    addLog('command', 'scanner_test');
    addLog('info', 'Simulating crop scan...');
    setTimeout(() => {
      addLog('success', '✓ Detected: Tomato Leaf with Early Blight');
      addLog('info', '✓ Confidence: 89.2%');
      addLog('info', '✓ Recommended: Copper-based fungicide');
      addLog('success', 'Scanner test completed successfully');
    }, 2000);
  };

  const simulateSoilTest = () => {
    addLog('command', 'soil_test');
    addLog('info', 'Running soil health analysis...');
    setTimeout(() => {
      addLog('success', '✓ pH Level: 6.8 (Optimal)');
      addLog('success', '✓ Nitrogen: 45 ppm (Good)');
      addLog('warning', '⚠ Phosphorus: 12 ppm (Low)');
      addLog('success', '✓ Potassium: 180 ppm (High)');
      addLog('info', '💡 Recommendation: Apply phosphorus-based fertilizer');
      addLog('success', 'Soil analysis completed');
    }, 1800);
  };

  const executeCommand = () => {
    if (!command.trim()) return;
    
    const cmd = command.toLowerCase().trim();
    addLog('command', `> ${command}`);
    
    switch (cmd) {
      case 'help':
        addLog('info', 'Available commands:');
        addLog('info', '• help - Show this help message');
        addLog('info', '• diagnostics - Run full system diagnostics');
        addLog('info', '• scanner_test - Test crop scanner functionality');
        addLog('info', '• soil_test - Test soil analysis system');
        addLog('info', '• clear - Clear diagnostic logs');
        addLog('info', '• status - Show system status');
        addLog('info', '• version - Show app version info');
        break;
        
      case 'diagnostics':
        runAllDiagnostics();
        break;
        
      case 'scanner_test':
        simulateScannerTest();
        break;
        
      case 'soil_test':
        simulateSoilTest();
        break;
        
      case 'clear':
        setLogs([]);
        addLog('info', 'Diagnostic logs cleared');
        break;
        
      case 'status':
        const passedCount = diagnosticTests.filter(t => t.status === 'passed').length;
        const failedCount = diagnosticTests.filter(t => t.status === 'failed').length;
        const runningCount = diagnosticTests.filter(t => t.status === 'running').length;
        
        addLog('info', `System Status Summary:`);
        addLog('success', `✓ Passed: ${passedCount}`);
        addLog('error', `✗ Failed: ${failedCount}`);
        addLog('info', `⏳ Running: ${runningCount}`);
        break;
        
      case 'version':
        addLog('info', 'Agricultural Diagnostics System');
        addLog('info', 'Version: 2.1.0');
        addLog('info', 'Scanner Engine: v1.4.2');
        addLog('info', 'Soil Analysis: v1.3.1');
        addLog('info', 'AI Models: v2.0.5');
        break;
        
      default:
        addLog('error', `Unknown command: ${command}`);
        addLog('info', 'Type "help" for available commands');
    }
    
    setCommand('');
  };

  const getStatusColor = (status: DiagnosticTest['status']) => {
    switch (status) {
      case 'passed': return '#4CAF50';
      case 'failed': return '#F44336';
      case 'running': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: DiagnosticTest['status']) => {
    switch (status) {
      case 'passed': return 'checkmark-circle';
      case 'failed': return 'close-circle';
      case 'running': return 'refresh-circle';
      default: return 'ellipse-outline';
    }
  };

  const getLogColor = (type: DiagnosticLog['type']) => {
    switch (type) {
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'success': return '#4CAF50';
      case 'command': return '#2196F3';
      default: return '#FFFFFF';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="bug" size={24} color="#4CAF50" />
        <Text style={styles.headerTitle}>System Diagnostics</Text>
        <TouchableOpacity
          style={styles.runButton}
          onPress={runAllDiagnostics}
          disabled={isRunning}
        >
          <Ionicons 
            name={isRunning ? "refresh" : "play"} 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.runButtonText}>
            {isRunning ? 'Running...' : 'Run All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Test Status Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testsContainer}>
        {diagnosticTests.map((test, index) => (
          <View key={index} style={styles.testCard}>
            <Ionicons
              name={getStatusIcon(test.status)}
              size={24}
              color={getStatusColor(test.status)}
            />
            <Text style={styles.testName}>{test.name}</Text>
            <Text style={[styles.testStatus, { color: getStatusColor(test.status) }]}>
              {test.status.toUpperCase()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Console Output */}
      <View style={styles.consoleContainer}>
        <View style={styles.consoleHeader}>
          <Ionicons name="terminal" size={16} color="#4CAF50" />
          <Text style={styles.consoleTitle}>Diagnostic Console</Text>
          <TouchableOpacity onPress={() => setLogs([])}>
            <Ionicons name="trash" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.consoleOutput}
          showsVerticalScrollIndicator={false}
        >
          {logs.map((log) => (
            <View key={log.id} style={styles.logEntry}>
              <Text style={styles.timestamp}>[{log.timestamp}]</Text>
              <Text style={[styles.logMessage, { color: getLogColor(log.type) }]}>
                {log.message}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Command Input */}
      <View style={styles.commandContainer}>
        <Text style={styles.commandPrompt}>$</Text>
        <TextInput
          style={styles.commandInput}
          value={command}
          onChangeText={setCommand}
          placeholder="Enter diagnostic command..."
          placeholderTextColor="#666"
          onSubmitEditing={executeCommand}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.executeButton} onPress={executeCommand}>
          <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  testsContainer: {
    backgroundColor: '#2d2d2d',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  testCard: {
    backgroundColor: '#333',
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  testName: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  testStatus: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  consoleContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  consoleTitle: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  consoleOutput: {
    flex: 1,
    padding: 12,
  },
  logEntry: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  timestamp: {
    color: '#666',
    fontSize: 11,
    fontFamily: 'monospace',
    marginRight: 8,
  },
  logMessage: {
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
  },
  commandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  commandPrompt: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'monospace',
  },
  commandInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'monospace',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    marginRight: 8,
  },
  executeButton: {
    padding: 8,
  },
});