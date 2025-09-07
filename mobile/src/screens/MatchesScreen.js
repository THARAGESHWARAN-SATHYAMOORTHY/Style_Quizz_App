import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const MatchesScreen = ({ route, navigation }) => {
  const { likedIds } = route.params;

  const [recommendedItems, setRecommendedItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWishlist, setShowWishlist] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!likedIds || likedIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://10.0.2.2:8000/recommendation/",
          {
            liked_ids: likedIds.map(String),
          },
        );

        const formattedData = response.data.map((product) => {
          const price = parseFloat(product.Price_INR);
          const originalPrice = product.Original_Price_INR
            ? parseFloat(product.Original_Price_INR)
            : null;
          let discount = null;
          if (originalPrice && price < originalPrice) {
            discount = Math.round(
              ((originalPrice - price) / originalPrice) * 100,
            );
          }

          return {
            metadata: {
              p_id: product.Product_id,
              name: product.Name,
              brand: product.Brand,
              price: price,
              originalPrice: originalPrice,
              discount: discount,
              avg_rating: product.Rating
                ? parseFloat(product.Rating).toFixed(1)
                : null,
              img:
                product.image_url ||
                `http://10.0.2.2:8000/images/${product.Product_id}.jpg`,
              description: product.Description,
              size: product.Size,
              colour: product.Colour,
              brand: product.Brand,
            },
          };
        });

        setRecommendedItems(formattedData);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [likedIds]);

  const toggleWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.metadata.p_id === item.metadata.p_id);
      if (exists) {
        return prev.filter((p) => p.metadata.p_id !== item.metadata.p_id);
      } else {
        return [...prev, item];
      }
    });
  };
  const isWishlisted = (item) =>
    wishlist.some((p) => p.metadata.p_id === item.metadata.p_id);

  const displayItems = showWishlist ? wishlist : recommendedItems;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E74C3C" />
        <Text style={styles.loadingText}>Finding Your Style Matches...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.matchesHeader}>
        <Text style={styles.matchesTitle}>
          {showWishlist ? "Your Wishlist" : "Your Style Matches"}
        </Text>
        <TouchableOpacity
          style={styles.wishlistToggle}
          onPress={() => setShowWishlist(!showWishlist)}
        >
          <Icon
            name={showWishlist ? "cards-heart" : "heart"}
            size={24}
            color="#E74C3C"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {displayItems && displayItems.length > 0 ? (
          displayItems.map((item) => {
            const { metadata } = item;
            return (
              <TouchableOpacity
                key={metadata.p_id}
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate("ProductDetail", {
                    product: item,
                    likedIds: likedIds,
                  })
                }
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: metadata.img }}
                    style={styles.productImage}
                  />
                  <TouchableOpacity
                    style={styles.wishlistIcon}
                    onPress={() => toggleWishlist(item)}
                  >
                    <Icon
                      name={isWishlisted(item) ? "heart" : "heart-outline"}
                      size={22}
                      color={isWishlisted(item) ? "#E74C3C" : "#333"}
                    />
                  </TouchableOpacity>
                  {metadata.discount && (
                    <View style={styles.saleTag}>
                      <Text style={styles.saleText}>SALE</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.productName} numberOfLines={2}>
                  {metadata.name}
                </Text>
                <Text style={styles.productBrand}>{metadata.brand}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.discountedPrice}>₹{metadata.price}</Text>
                  {metadata.originalPrice && metadata.discount && (
                    <>
                      <Text style={styles.originalPrice}>
                        ₹{metadata.originalPrice}
                      </Text>
                      <Text style={styles.discountLabel}>
                        {metadata.discount}% off
                      </Text>
                    </>
                  )}
                </View>
                {metadata.avg_rating && (
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={14} color="#f5a623" />
                    <Text style={styles.ratingText}>{metadata.avg_rating}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.noMatchesContainer}>
            <Icon name="tshirt-crew-outline" size={60} color="#ccc" />
            <Text style={styles.noMatchesText}>
              {showWishlist
                ? "Your wishlist is empty."
                : "No recommendations found."}
            </Text>
            {!showWishlist && (
              <Text style={styles.noMatchesSubText}>
                Swipe on more items to get new matches!
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {!showWishlist && (
        <View style={styles.matchesFooter}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Discover More</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MatchesScreen;
