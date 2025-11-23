import { Dimensions, ScrollView, StyleProp, StyleSheet, View, ViewStyle, } from "react-native";
import FridgeFood from "./FridgeFood";
import FoodFilter from "@/types/FoodFilter";
import Food from "@/types/Food";

const SHELF_SIZE = 4;
const MIN_SHELVES = 5;

interface FridgeProps {
  food: Food[];
  addStyles?: StyleProp<ViewStyle>;
  filters?: FoodFilter[];
  refresh?: () => void;
}

export default function Fridge({ food, addStyles, filters, refresh }: FridgeProps) {
  const filteredFood = filters?.length && filters.some(f => f.active)
    ? food.filter(f => filters.some(fl => fl.active && fl.FoodCategory === f.category))
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
              <FridgeFood key={idx + 1} food={food} refresh={refresh} />
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
