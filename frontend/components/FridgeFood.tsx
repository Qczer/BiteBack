import { GreenVar } from "@/assets/colors/colors";
import Food from "@/types/Food";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FoodModal from "./FoodModal";

interface FridgeFoodProps {
  food: Food;
  refresh?: () => void;
}

export default function FridgeFood({ food, refresh }: FridgeFoodProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const expiryDate = new Date(food.expDate!);
  const dateDiff = expiryDate.getTime() - Date.now();

  const day = 24 * 60 * 60 * 1000;

  const ratio = Math.max(0, Math.min(1, dateDiff / day));

  const r = 85 + (33 - 85) * ratio;
  const g = 92 + (150 - 92) * ratio;
  const b = 20 + (243 - 20) * ratio;

  const dynamicColor = `rgb(${r}, ${g}, ${b})`;
  const dynamicOpacity = 0.3 + ratio * 0.7;

  return (
    <View style={{ width: "17.5%", backgroundColor: "transparent" }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={{ height: "100%", margin: 0 }}>
          <Ionicons
            name={food?.iconUrl ?? ("cube-outline" as any)}
            color={dynamicColor}
            style={{opacity: dynamicOpacity}}
            size={50}
          ></Ionicons>
          <Text
            style={{ fontSize: 12, textAlign: "center" }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {food.name}
          </Text>
        </View>
        <Text style={styles.amount}>{food.amount}</Text>
      </TouchableOpacity>
      <FoodModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          refresh?.();
        }}
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
