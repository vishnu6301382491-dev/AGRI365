import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Correct import for useNavigation
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';

// Mock user data
const USER_DATA = {
  username: 'farmer_john',
  name: 'John Smith',
  bio: 'Agricultural specialist | Crop health expert | Sustainable farming advocate 🌱',
  avatar: 'https://picsum.photos/100/100?random=20',
  posts: 24,
  followers: 843,
  following: 492,
  highlights: [
    { id: '1', title: 'Crops', image: 'https://picsum.photos/80/80?random=21' },
    { id: '2', title: 'Tools', image: 'https://picsum.photos/80/80?random=22' },
    { id: '3', title: 'Harvest', image: 'https://picsum.photos/80/80?random=23' },
    { id: '4', title: 'Tips', image: 'https://picsum.photos/80/80?random=24' },
  ],
  photos: [
    { id: '1', uri: 'https://picsum.photos/400/400?random=25' },
    { id: '2', uri: 'https://picsum.photos/400/400?random=26' },
    { id: '3', uri: 'https://picsum.photos/400/400?random=27' },
    { id: '4', uri: 'https://picsum.photos/400/400?random=28' },
    { id: '5', uri: 'https://picsum.photos/400/400?random=29' },
    { id: '6', uri: 'https://picsum.photos/400/400?random=30' },
    { id: '7', uri: 'https://picsum.photos/400/400?random=31' },
    { id: '8', uri: 'https://picsum.photos/400/400?random=32' },
    { id: '9', uri: 'https://picsum.photos/400/400?random=33' },
  ]
};

interface ProfileScreenProps {
  onLogout?: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('grid');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          }
        }
      ]
    );
  };

  const handlePhotoPress = (photoId: string) => {
    Alert.alert('Photo', `Photo ${photoId} pressed - Feature coming soon!`);
  };

  const renderHighlight = ({ item }: { item: any }) => (
    <View style={styles.highlightItem}>
      <View style={styles.highlightImageWrapper}>
        <Image source={{ uri: item.image }} style={styles.highlightImage} />
      </View>
      <Text style={styles.highlightTitle}>{item.title}</Text>
    </View>
  );

  const renderGridItem = ({ item, index }: { item: any; index: number }) => {
    const windowWidth = Dimensions.get('window').width;
    const size = windowWidth / 3 - 2;
    return (
      <TouchableOpacity 
        style={[styles.gridItem, { width: size, height: size }]}
        onPress={() => handlePhotoPress(item.id)}
      >
        <Image source={{ uri: item.uri }} style={styles.gridImage} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.headerTitle}>{USER_DATA.username}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Feather name="log-out" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile info */}
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: USER_DATA.avatar }} style={styles.profileImage} />
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{USER_DATA.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{USER_DATA.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{USER_DATA.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{USER_DATA.name}</Text>
            <Text style={styles.profileBio}>{USER_DATA.bio}</Text>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Highlights */}
        <View style={styles.highlightsContainer}>
          <FlatList
            data={USER_DATA.highlights}
            renderItem={renderHighlight}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsList}
          />
        </View>

        {/* Tab buttons */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'grid' && styles.activeTab]}
            onPress={() => setActiveTab('grid')}
          >
            <MaterialIcons 
              name="grid-on" 
              size={24} 
              color={activeTab === 'grid' ? '#4CAF50' : '#999'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'list' && styles.activeTab]}
            onPress={() => setActiveTab('list')}
          >
            <MaterialIcons 
              name="list" 
              size={24} 
              color={activeTab === 'list' ? '#4CAF50' : '#999'} 
            />
          </TouchableOpacity>
        </View>

        {/* Photos grid */}
        {activeTab === 'grid' && (
          <FlatList
            data={USER_DATA.photos}
            renderItem={renderGridItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            style={styles.photosGrid}
          />
        )}

        {/* Photos list */}
        {activeTab === 'list' && (
          <View style={styles.photosList}>
            {USER_DATA.photos.map((photo, index) => (
              <TouchableOpacity 
                key={photo.id}
                style={styles.listItem}
                onPress={() => handlePhotoPress(photo.id)}
              >
                <Image source={{ uri: photo.uri }} style={styles.listImage} />
                <View style={styles.listContent}>
                  <Text style={styles.listTitle}>Farm Photo {index + 1}</Text>
                  <Text style={styles.listDescription}>
                    Agricultural documentation and progress tracking
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 5,
  },
  profileContainer: {
    padding: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
  },
  profileInfo: {
    marginTop: 15,
  },
  profileName: {
    fontWeight: '600',
    fontSize: 14,
  },
  profileBio: {
    fontSize: 14,
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    paddingVertical: 7,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    fontWeight: '600',
  },
  highlightsContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  highlightsList: {
    paddingVertical: 10,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  highlightImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  highlightTitle: {
    fontSize: 12,
    marginTop: 4,
    color: '#262626',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  photosGrid: {
    marginTop: 1,
  },
  photosList: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  listContent: {
    flex: 1,
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  listDescription: {
    fontSize: 12,
    color: 'gray',
  },
  gridItem: {
    margin: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});