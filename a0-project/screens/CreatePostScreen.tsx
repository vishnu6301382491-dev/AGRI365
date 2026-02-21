import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  
  // Sample filters
  const filters = [
    { id: 'normal', name: 'Normal' },
    { id: 'clarendon', name: 'Clarendon' },
    { id: 'gingham', name: 'Gingham' },
    { id: 'moon', name: 'Moon' },
    { id: 'lark', name: 'Lark' },
    { id: 'reyes', name: 'Reyes' },
    { id: 'juno', name: 'Juno' },
    { id: 'slumber', name: 'Slumber' }
  ];

  // For demo purposes, simulating image selection
  const handleSelectImage = () => {
    // In a real app, use ImagePicker
    const demoImage = 'https://api.a0.dev/assets/image?text=Selected+Photo&aspect=4:5';
    setSelectedImage(demoImage);
  };

  // For demo purposes, simulating image capture
  const handleCaptureImage = () => {
    // In a real app, use Camera API
    const capturedImage = 'https://api.a0.dev/assets/image?text=Captured+Photo&aspect=4:5';
    setSelectedImage(capturedImage);
  };

  const handleShare = () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }
    
    if (caption.trim() === '') {
      toast.warning('Add a caption to your post');
      return;
    }
    
    // Simulate post creation
    toast.success('Post shared successfully!');
    
    // Navigate back to the feed
    setTimeout(() => {
      navigation.navigate('Home');
    }, 1500);
  };

  const handleDiscard = () => {
    if (!selectedImage && caption.trim() === '') {
      navigation.goBack();
      return;
    }
    
    Alert.alert(
      'Discard Post?',
      'If you go back now, your post will not be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  const renderFilter = ({ item }) => (
    <TouchableOpacity 
      style={[styles.filterItem, selectedFilter === item.id && styles.selectedFilter]} 
      onPress={() => setSelectedFilter(item.id)}
    >
      <Image 
        source={{ uri: `https://api.a0.dev/assets/image?text=${item.name}&aspect=1:1&seed=${item.id}` }} 
        style={styles.filterImage} 
      />
      <Text style={styles.filterName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDiscard} style={styles.backButton}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={[
            styles.shareButtonText, 
            (!selectedImage || caption.trim() === '') && styles.disabledButton
          ]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView style={styles.scrollContainer}>
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              
              {/* Filter options */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
              >
                {filters.map(filter => (
                  <TouchableOpacity 
                    key={filter.id}
                    style={[styles.filterItem, selectedFilter === filter.id && styles.selectedFilter]} 
                    onPress={() => setSelectedFilter(filter.id)}
                  >
                    <Image 
                      source={{ uri: `https://api.a0.dev/assets/image?text=${filter.name}&aspect=1:1&seed=${filter.id}` }} 
                      style={styles.filterImage} 
                    />
                    <Text style={styles.filterName}>{filter.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Caption input */}
              <View style={styles.captionContainer}>
                <Image 
                  source={{ uri: 'https://api.a0.dev/assets/image?text=Me&aspect=1:1' }} 
                  style={styles.userAvatar} 
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  maxLength={2200}
                />
              </View>

              {/* Location, Tag people, etc */}
              <View style={styles.postSettingsContainer}>
                <TouchableOpacity style={styles.postSettingItem}>
                  <Text style={styles.postSettingText}>Add Location</Text>
                  <Feather name="chevron-right" size={18} color="gray" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.postSettingItem}>
                  <Text style={styles.postSettingText}>Tag People</Text>
                  <Feather name="chevron-right" size={18} color="gray" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.postSettingItem}>
                  <Text style={styles.postSettingText}>Add Music</Text>
                  <Feather name="chevron-right" size={18} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.imageSelectionContainer}>
              <Text style={styles.imageSelectionTitle}>Select a Photo</Text>
              
              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity 
                  style={styles.imageButton} 
                  onPress={handleSelectImage}
                >
                  <FontAwesome name="image" size={36} color="#0095F6" />
                  <Text style={styles.imageButtonText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imageButton}
                  onPress={handleCaptureImage}
                >
                  <MaterialIcons name="camera-alt" size={36} color="#0095F6" />
                  <Text style={styles.imageButtonText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    padding: 5,
  },
  shareButtonText: {
    color: '#0095F6',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  imageSelectionContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  imageSelectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  imageButton: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    width: 150,
  },
  imageButtonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#0095F6',
  },
  imagePreviewContainer: {
    flex: 1,
  },
  imagePreview: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  filtersContainer: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  filterItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  selectedFilter: {
    borderBottomWidth: 2,
    borderBottomColor: '#0095F6',
  },
  filterImage: {
    width: 64,
    height: 64,
    borderRadius: 5,
  },
  filterName: {
    marginTop: 5,
    fontSize: 12,
  },
  captionContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  captionInput: {
    flex: 1,
    minHeight: 40,
    fontSize: 14,
  },
  postSettingsContainer: {
    paddingVertical: 10,
  },
  postSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: '#EFEFEF',
  },
  postSettingText: {
    fontSize: 16,
  },
});