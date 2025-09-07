import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { styles } from "./styles";

const { width } = Dimensions.get("window");


const ProductDetailScreen = ({ route, navigation }) => {
  const { product, likedIds } = route.params;
  const { metadata } = product;

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {
  const fetchReason = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://10.0.2.2:8000/recommend_reason/",
        {
          current_product: metadata,
          liked_list: likedIds,
        },
        { timeout: 5000 }
      );
      await new Promise(resolve => setTimeout(resolve, 20000));
      setReason(
        response.data.reason || "This product is recommended for you."
      );
    } catch (error) {
      console.error("Error fetching recommendation reason:", error.message);
      setReason("Could not fetch recommendation details.");
    } finally {
      setLoading(false);
    }
  };

  
  fetchReason();
}, [metadata, likedIds]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView>
          <Image
            source={{
              uri:
                metadata.img ||
                `http://10.0.2.2:8000/images/${metadata.p_id}.jpg`,
            }}
            style={{ width, height: width * 1.2, resizeMode: "cover" }}
          />

          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#222" }}>
              {metadata.name}
            </Text>
            <Text style={{ fontSize: 14, color: "#777", marginTop: 4 }}>
              {metadata.brand}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#e74c3c" }}>
                ₹{metadata.price}
              </Text>
              {metadata.originalPrice && metadata.discount && (
                <>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#777",
                      textDecorationLine: "line-through",
                      marginLeft: 8,
                    }}
                  >
                    ₹{metadata.originalPrice}
                  </Text>
                  <Text style={{ fontSize: 14, color: "green", marginLeft: 8 }}>
                    {metadata.discount}% OFF
                  </Text>
                </>
              )}
            </View>

            {metadata.avg_rating && (
              <View
                style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
              >
                <Icon name="star" size={16} color="#f5a623" />
                <Text style={{ marginLeft: 4, fontSize: 14, color: "#444" }}>
                  {metadata.avg_rating}
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 8, backgroundColor: "#f5f5f5" }} />

          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
              Why We Recommend This
            </Text>
            {loading ? (
              <ActivityIndicator size="small" color="#e74c3c" />
            ) : (
              <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
                {reason}
              </Text>
            )}
          </View>

          <View style={{ height: 8, backgroundColor: "#f5f5f5" }} />

          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
              Product Details
            </Text>

            <DetailRow label="Brand" value={metadata.brand} />
            <DetailRow label="Color" value={metadata.colour} />
            <DetailRow label="Size" value={metadata.size} />
            <DetailRow label="Occasion" value={metadata.occasion || "Casual"} />
            <DetailRow label="Seller" value={metadata.seller || "Style by Zara"} />

            <Text
              style={{
                fontSize: 14,
                color: "#444",
                marginTop: 12,
                lineHeight: 20,
              }}
            >
              {metadata.description || "No description available."}
            </Text>
          </View>
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: "#eee",
            backgroundColor: "#fff",
            padding: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              marginRight: 8,
              paddingVertical: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#e74c3c",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#e74c3c", fontWeight: "600" }}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 6,
              backgroundColor: "#e74c3c",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={{ flexDirection: "row", marginBottom: 6 }}>
    <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", width: 90 }}>
      {label}:
    </Text>
    <Text style={{ fontSize: 14, color: "#444", flex: 1 }}>
      {value || "Not specified"}
    </Text>
  </View>
);

export default ProductDetailScreen;