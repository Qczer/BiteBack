import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
};

const foodIcons = [
  "pizza", // pizza
  "fast-food", // burger / fast food
  "ice-cream", // lody
  "cafe", // kawa / filiżanka kawy
  "beer", // piwo / kufel
  "wine", // kieliszek wina
  "restaurant", // sztućce
  "fish", // ryba
  "egg", // jajko
  "nutrition", // jabłko / zdrowe jedzenie
  "leaf", // liść – wege/vegan
  "water", // kropla wody
  "cube-outline", // placeholder / produkt
];

export default function FoodIconPickerModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Wybierz ikonę jedzenia</Text>

          <FlatList
            data={foodIcons}
            // horizontal
            numColumns={4}
            style={{ maxHeight: 300 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.iconBox}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Ionicons name={item as any} size={32} color={GreenVar} />
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Zamknij</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: WhiteVar,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: GreenVar,
  },
  iconBox: {
    width: 70,
    height: 70,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: GreenVar,
    borderRadius: 8,
  },
  closeText: {
    color: WhiteVar,
    fontWeight: "600",
  },
});
