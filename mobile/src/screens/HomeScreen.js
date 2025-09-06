import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Swiper from 'react-native-deck-swiper';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

// Card Component with safe checks
const Card = ({ item }) => {
  if (!item || !item.metadata) return null;

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.metadata.img }} style={styles.cardImage} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardName}>{item.metadata.name}</Text>
        <Text style={styles.cardBrand}>{item.metadata.brand}</Text>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { userInfo, logout } = useContext(AuthContext);
  const [fashionItems, setFashionItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  // Fetch products from FastAPI backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:8000/products/?n=10'); // Use 10.0.2.2 for Android emulator
        setFashionItems(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSwipeRight = useCallback((cardIndex) => {
    setLikedItems(currentLikedItems => [...currentLikedItems, fashionItems[cardIndex]]);
  }, [fashionItems]);

  const handleSwipedAll = useCallback(() => {
    navigation.navigate('Matches', { likedItems });
  }, [navigation, likedItems]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.welcomeMessage}>Discover</Text>
          <Text style={styles.userName}>{userInfo?.name || 'Fashionista'}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Icon name="logout" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Swiper */}
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={fashionItems}
          renderCard={(card) => <Card item={card} />}
          onSwipedRight={handleSwipeRight}
          onSwipedAll={handleSwipedAll}
          cardIndex={0}
          backgroundColor={'transparent'}
          stackSize={3}
          stackSeparation={15}
          overlayLabels={{
            left: { title: 'NOPE', style: { label: styles.nopeLabel, wrapper: styles.overlayWrapper } },
            right: { title: 'LIKE', style: { label: styles.likeLabel, wrapper: styles.overlayWrapper } },
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => swiperRef.current?.swipeLeft()}>
          <Icon name="close" size={32} color="#E74C3C" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => swiperRef.current?.swipeRight()}>
          <Icon name="heart" size={32} color="#2ECC71" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;