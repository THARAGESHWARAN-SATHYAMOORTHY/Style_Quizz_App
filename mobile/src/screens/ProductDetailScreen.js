import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { metadata } = product;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Scrollable Content */}
      <ScrollView>
        {/* Product Image */}
        <Image
          source={{ uri: metadata.img }}
          style={{ width, height: width * 1.2, resizeMode: "cover" }}
        />

        {/* Product Info */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>
            {metadata.name}
          </Text>
          <Text style={{ fontSize: 14, color: "#777", marginTop: 2 }}>
            {metadata.brand}
          </Text>

          {/* Price & Discount */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#222" }}>
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

          {/* Rating */}
          {metadata.avg_rating && (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
              <Icon name="star" size={16} color="#f5a623" />
              <Text style={{ marginLeft: 4, fontSize: 14, color: "#444" }}>
                {parseFloat(metadata.avg_rating).toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={{ height: 8, backgroundColor: "#f5f5f5" }} />

        {/* Product Details */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            Product Details
          </Text>
          <Text style={{ fontSize: 14, color: "#444", marginBottom: 4 }}>
            Color: {metadata.color || "Not specified"}
          </Text>
          <Text style={{ fontSize: 14, color: "#444", marginBottom: 4 }}>
            Occasion: {metadata.occasion || "Casual"}
          </Text>
          <Text style={{ fontSize: 14, color: "#444", marginBottom: 4 }}>
            Seller: {metadata.seller || "Unknown"}
          </Text>
          <Text style={{ fontSize: 14, color: "#444", marginTop: 6 }}>
            {metadata.description || "No description available."}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
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
  );
};

export default ProductDetailScreen;
