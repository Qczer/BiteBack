import { GreenVar } from "@/assets/colors/colors";
import Food from "@/types/Food";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FoodModal from "./FoodModal";

interface FridgeFoodProps {
  food: Food;
  refresh?: () => void;
}

export default function FridgeFood({ food, refresh }: FridgeFoodProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ width: "17.5%", backgroundColor: "transparent" }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {(food.iconUrl && food.iconUrl != "no-photo.png") ? (
          <Image
            source={{ uri: food.iconUrl }}
            style={{
              width: 90,
              height: 90,
              resizeMode: "contain",
            }}
          />
        ) : (
          // defaultowa ikonka
          <View style={{ height: "100%", margin: 0 }}>
            <Ionicons name="cube-outline" color={"gray"} size={50}></Ionicons>
            <Text style={{ fontSize: 12, textAlign: "center" }} ellipsizeMode="tail" numberOfLines={1}>
              {food.name}
            </Text>
          </View>
        )}
        <Text style={styles.amount}>{food.amount}</Text>
      </TouchableOpacity>
      <FoodModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); refresh?.(); }}
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
