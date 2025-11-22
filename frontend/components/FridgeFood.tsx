import { GreenVar } from "@/assets/colors/colors";
import Food from "@/types/Food";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FoodModal from "./FoodModal";

interface FridgeFoodProps {
  food: Food;
}

export default function FridgeFood({ food }: FridgeFoodProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const isLocalImage = typeof food.iconUrl === "number"; // require return a number
  const isRemoteImage =
    typeof food.iconUrl === "string" && food.iconUrl.startsWith("http");

  const isImage = isLocalImage || isRemoteImage;

  return (
    <View style={{ width: "17.5%", backgroundColor: "transparent" }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {isImage ? (
          <Image
            source={
              isLocalImage
                ? (food.iconUrl as any)
                : { uri: food.iconUrl as any }
            }
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
            }}
          />
        ) : (
          // defaultowa ikonka
          <View style={{ height: "100%", margin: 0 }}>
            <Ionicons name="cube-outline" color={"gray"} size={50}></Ionicons>
            <Text style={{ fontSize: 14, textAlign: "center" }}>
              {food.name}
            </Text>
          </View>
        )}
        <Text style={styles.amount}>{food.amount}</Text>
      </TouchableOpacity>
      <FoodModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        food={food}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: GreenVar,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    color: "#fff",
  },
});
