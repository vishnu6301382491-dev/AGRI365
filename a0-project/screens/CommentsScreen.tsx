import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, AntDesign } from '@expo/vector-icons';

// This would come from a database or context in a real app
const getMockPostById = (id) => {
  const posts = [
    {
      id: '1',
      username: 'sarah_js',
      userAvatar: 'https://api.a0.dev/assets/image?text=Sarah&aspect=1:1',
      caption: 'Enjoying the beautiful sunset today! #sunset #vibes',
      comments: [
        { id: '1', username: 'michael_dev', text: 'Amazing view!', timestamp: '2h', likes: 3 },
        { id: '2', username: 'tech_jane', text: 'Wish I was there!', timestamp: '1h', likes: 5 },
        { id: '3', username: 'photo_master', text: 'Great composition! What camera did you use?', timestamp: '45m', likes: 2 },
        { id: '4', username: 'travel_guru', text: 'This location is on my bucket list!', timestamp: '30m', likes: 1 }
      ],
    },
    {
      id: '2',
      username: 'alex_travel',
      userAvatar: 'https://api.a0.dev/assets/image?text=Alex&aspect=1:1',
      caption: 'Mountain adventures are the best! 🏔️ #hiking #mountains',
      comments: [
        { id: '1', username: 'hike_lover', text: 'Which trail is this?', timestamp: '3h', likes: 2 },
        { id: '2', username: 'nature_photo', text: 'Perfect lighting!', timestamp: '2h', likes: 4 },
        { id: '3', username: 'outdoor_enthusiast', text: 'How difficult was the climb?', timestamp: '1h', likes: 1 }
      ],
    }
  ];
  return posts.find(p => p.id === id);
};

export default function CommentsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const post = getMockPostById(postId);
  
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    const newCommentObj = {
      id: Date.now().toString(),
      username: 'current_user', // In a real app, get from auth
      text: newComment.trim(),
      timestamp: 'now',
      likes: 0
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likes + 1
        };
      }
      return comment;
    }));
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image 
        source={{ uri: `https://api.a0.dev/assets/image?text=${item.username.charAt(0)}&aspect=1:1` }} 
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity onPress={() => handleLikeComment(item.id)}>
            <Text style={styles.likeText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
          {item.likes > 0 && (
            <View style={styles.likesContainer}>
              <AntDesign name="heart" size={12} color="#FF3B30" />
              <Text style={styles.likesCount}>{item.likes}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Image 
          source={{ uri: post.userAvatar }} 
          style={styles.avatar}
        />
        <View style={styles.captionContent}>
          <View style={styles.captionHeader}>
            <Text style={styles.username}>{post.username}</Text>
          </View>
          <Text style={styles.captionText}>{post.caption}</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={100}
      >
        {/* Comments list */}
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={item => item.id}
          style={styles.commentsList}
        />

        {/* Comment input */}
        <View style={styles.commentInputContainer}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=Me&aspect=1:1' }} 
            style={styles.currentUserAvatar}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity 
            onPress={handleAddComment}
            disabled={newComment.trim() === ''}
          >
            <Text 
              style={[
                styles.postButton, 
                newComment.trim() === '' && styles.disabledButton
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
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
  captionContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  captionContent: {
    flex: 1,
  },
  captionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5,
  },
  captionText: {
    fontSize: 14,
  },
  commentsList: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: '#EFEFEF',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 5,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 12,
    color: 'gray',
    marginRight: 15,
  },
  replyText: {
    fontSize: 12,
    color: 'gray',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  likesCount: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
    padding: 10,
    alignItems: 'center',
  },
  currentUserAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  postButton: {
    color: '#0095F6',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});