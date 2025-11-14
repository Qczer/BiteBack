import { Dimensions, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

const foods = ["🍎", "🍌", "🥦", "🥩", "🥖", "🧀", "🍪"];
const SHELF_SIZE = 5;

interface FridgeProps {
  addStyles?: StyleProp<ViewStyle>;
}

export default function Fridge({ addStyles }: FridgeProps) {
    const shelves = Array.from({ length: 20 }, (_, shelfIndex) => {
        const items = Array.from({ length: SHELF_SIZE }, (_, i) => {
        // Obliczamy indeks w tablicy foods z zawijaniem
          return foods[(shelfIndex + i) % foods.length];
        });
        return { index: shelfIndex, items };
    });

    return (
      <View style={[styles.fridgeContainer, addStyles]}>
        <ScrollView contentContainerStyle={styles.scrollArea}>
          {shelves.map(shelf => (
            <View key={shelf.index+1} style={styles.shelf}>
              {shelf.items.map((item, idx) => (
                <Text key={idx+1} style={styles.food}>
                  {item}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    )
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
    marginBottom: 25
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
    backgroundColor: "#ffffffcc", // lekko przezroczysta, jak szkło
    borderRadius: 5,
    borderBottomWidth: 5,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  food: {
    fontSize: 28,
  },
});