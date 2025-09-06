import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { styles } from './styles'; // We will add styles here later
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MatchesScreen = ({ route, navigation }) => {
  // Get the liked items passed from the HomeScreen
  const { likedItems } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.matchesHeader}>
        <Text style={styles.matchesTitle}>Your Style Matches</Text>
      </View>

      <ScrollView contentContainerStyle={styles.matchesContent}>
        {likedItems && likedItems.length > 0 ? (
          likedItems.map((item) => (
            <View key={item.metadata.p_id} style={styles.matchItem}>
              <Image source={{ uri: item.metadata.img }} style={styles.matchImage} />
              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>{item.metadata.name}</Text>
                <Text style={styles.matchBrand}>{item.metadata.brand}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noMatchesContainer}>
            <Icon name="heart-broken" size={60} color="#ccc" />
            <Text style={styles.noMatchesText}>You haven't liked any items yet.</Text>
            <Text style={styles.noMatchesSubText}>Swipe right on items you love!</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.matchesFooter}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Discover More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MatchesScreen;
