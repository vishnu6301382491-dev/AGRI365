import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type Post = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
};

type CommunityPost = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
};

type RootStackParamList = {
  Community: undefined;
};

type CommunityScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Community'>;

const CommunityScreen = () => {
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchPosts();
    }
  }, [isFocused]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Simulate fetching posts without making actual network requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock community posts data
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          author: 'Rajesh Kumar',
          content: 'Great harvest this season! Got 25% more yield using the new irrigation technique.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          likes: 12,
          replies: 3,
        },
        {
          id: '2',
          author: 'Priya Sharma',
          content: 'Looking for advice on pest control for tomatoes. Noticed some white flies on my plants.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          likes: 8,
          replies: 5,
        },
        {
          id: '3',
          author: 'Manoj Singh',
          content: 'Weather forecast shows rain next week. Perfect timing for sowing wheat!',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          likes: 15,
          replies: 2,
        },
        {
          id: '4',
          author: 'Anjali Patel',
          content: 'Successfully implemented drip irrigation. Water usage reduced by 40%! Highly recommend.',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          likes: 22,
          replies: 7,
        },
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting.');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate submitting post without making actual network requests
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new mock post
      const newPost: CommunityPost = {
        id: (posts.length + 1).toString(),
        author: 'Current Farmer',
        content: newPostContent.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0,
      };
      
      // Add new post to the beginning of the list
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setNewPostContent('');
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Post submission error:', error);
      Alert.alert('Error', 'Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.postAuthor}><Ionicons name="person-circle" size={18} color="#4CAF50" /> {item.author}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Forum</Text>

      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.newPostInput}
          placeholder="Share your farming insights or ask a question..."
          multiline
          value={newPostContent}
          onChangeText={setNewPostContent}
        />
        <TouchableOpacity
          style={[styles.postButton, submitting && styles.postButtonDisabled]}
          onPress={handlePostSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          contentContainerStyle={styles.postsList}
          ListEmptyComponent={<Text style={styles.emptyListText}>No posts yet. Be the first to share!</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  newPostContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  newPostInput: {
    minHeight: 80,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postsList: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  postTimestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  loadingIndicator: {
    marginTop: 50,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
});

export default CommunityScreen;