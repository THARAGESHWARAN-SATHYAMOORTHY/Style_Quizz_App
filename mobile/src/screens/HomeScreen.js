import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Swiper from 'react-native-deck-swiper';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";


const Card = ({ item }) => {
  if (!item || !item.metadata) return null;

  const { name, brand, price, avg_rating, colour, products } = item.metadata;

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.metadata.img }} style={styles.cardImage} />

      <View style={styles.cardTextContainer}>
        <Text style={styles.cardName}>{name}</Text>
        <Text style={styles.cardBrand}>{brand}</Text>

        <View style={styles.cardInfoRow}>
          {price && (
            <View style={styles.infoChip}>
              <Icon name="currency-inr" size={16} color="#333" />
              <Text style={styles.infoText}>{price}</Text>
            </View>
          )}
          {avg_rating && (
            <View style={styles.infoChip}>
              <Icon name="star" size={16} color="#f1c40f" />
              <Text style={styles.infoText}>{parseFloat(avg_rating).toFixed(1)}</Text>
            </View>
          )}
          {colour && (
            <View style={styles.infoChip}>
              <Icon name="palette" size={16} color="#8e44ad" />
              <Text style={styles.infoText}>{colour}</Text>
            </View>
          )}
          {products && (
            <View style={styles.infoChip}>
              <Icon name="tag" size={16} color="#2980b9" />
              <Text style={styles.infoText}>{products}</Text>
            </View>
          )}
        </View>
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

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://10.0.2.2:8000/products/?n=20');
      setFashionItems(response.data);
      setLikedItems([]);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  const handleSwipeRight = useCallback((cardIndex) => {
    setLikedItems(currentLikedItems => [...currentLikedItems, fashionItems[cardIndex]]);
  }, [fashionItems]);

  const handleSwipedAll = useCallback(() => {
    const likedIds = likedItems.map((item) => item.metadata.p_id);
    navigation.navigate('Matches', { likedItems, likedIds });
  }, [navigation, likedItems]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.userName}>Discover</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Icon name="logout" size={26} color="#333" />
        </TouchableOpacity>
      </View>

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
