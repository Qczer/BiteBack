import Food, { FoodType } from "@/classes/Food";
import { Dimensions, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle, } from "react-native";
import FridgeFood from "./FridgeFood";
import Filter from "@/classes/Filter";
import FoodFilter from "@/classes/FoodFilter";

const food: Food[] = [
  { name: "🍎", amount: 2, type: FoodType.fruit },
  { name: "🍌", amount: 1, type: FoodType.fruit },
  { name: "🥦", amount: 3, type: FoodType.vegetable },
  { name: "🥩", amount: 8, type: FoodType.meat },
  { name: "🥖", amount: 5, type: FoodType.junk },
  { name: "🧀", amount: 3, type: FoodType.snack },
  { name: "🍪", amount: 4, type: FoodType.snack },
];

const SHELF_SIZE = 5;
const MIN_SHELVES = 5;

interface FridgeProps {
  addStyles?: StyleProp<ViewStyle>;
  filters?: FoodFilter[];
}

export default function Fridge({ addStyles, filters }: FridgeProps) {
  const filteredFood = filters?.length && filters.some(f => f.active)
    ? food.filter(f => filters.some(fl => fl.active && fl.foodType === f.type))
    : food;

  const shelves = Array.from(
    { length: Math.max(MIN_SHELVES, Math.ceil(filteredFood.length / SHELF_SIZE)) },
    (_, i) => filteredFood.slice(i * SHELF_SIZE, (i + 1) * SHELF_SIZE)
  );

  return (
    <View style={[styles.fridgeContainer, addStyles]}>
      <ScrollView contentContainerStyle={styles.scrollArea}>
        {shelves.map((shelf, shelfIndex) => (
          <View key={shelfIndex} style={styles.shelf}>
            {shelf.map((food, idx) => (
              <FridgeFood key={idx + 1} food={food} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  fridgeContainer: {
    width: width * 0.8,
    height: 500,
    borderWidth: 6,
    borderColor: "#b0b0b0",
    borderRadius: 10,
    backgroundColor: "#e6f0f7",
    overflow: "hidden",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 25,
  },
  scrollArea: {
    paddingVertical: 10,
  },
  shelf: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    marginBottom: 12,
    backgroundColor: "#fafafa", // lekko przezroczysta, jak szkło
    borderRadius: 5,
    borderBottomWidth: 5,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
