import { addFoodToFridge } from "@/api/endpoints/fridge";
import { GreenVar } from "@/assets/colors/colors";
import { useUser } from "@/contexts/UserContext";
import t from "@/locales/i18n";
import Food from "@/types/Food";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import FoodEditor from "./FoodEditor";

interface ShoppingListProps {
  list: Food[];
  onAdd: (food: Food) => void;
  onRemove: (food: Food) => void;
  onUpdate: (food: Food, foodIndex: number) => void;
  clearList: () => void;
  showToast: (key: string) => void;
}

export default function ShoppingList({
  list,
  onAdd,
  onRemove,
  onUpdate,
  clearList,
  showToast,
}: ShoppingListProps) {
  const { userId } = useUser();

  const showSuccessToast = (message: string) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "top",
      swipeable: true,
    });
  };

  const [newFood, setNewFood] = useState<Food | null>(null);
  const [tempFood, setTempFood] = useState<Record<number, Food>>({});
  const [editingIndices, setEditingIndices] = useState<number[]>([]);
  const [reset, setReset] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addFood = () => {
    if (newFood?.name && newFood?.amount && newFood?.unit) {
      onAdd(newFood);
      setNewFood(null);
    } else {
      showToast("Please fill in all fields.");
    }
  };

  const handleEditClick = (index: number) => {
    if (!editingIndices.includes(index)) {
      setEditingIndices((prev) => [...prev, index]);
      setTempFood((prev) => ({ ...prev, [index]: list[index] }));
    } else {
      if (tempFood[index] !== list[index]) onUpdate(tempFood[index], index);

      setTempFood((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      setEditingIndices((prev) => prev.filter((i) => i !== index));
    }
  };
  const handleAddListToFridge = async () => {
    setIsSubmitting(true);
    try {
      if (list.length === 0) {
        showToast("Shopping list is empty.");
        setIsSubmitting(false);
        return;
      }
      await addFoodToFridge(userId, list);
      clearList();
      showSuccessToast("Successfully added!");
    } catch (error) {
      showToast("Failed to add items.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* FOOD EDITOR */}
      <View style={styles.editorBlock}>
        <FoodEditor onChange={setNewFood} reset={reset} />
        <Pressable
          style={styles.addToListButton}
          onPress={() => {
            addFood();
            setReset(true);
            setTimeout(() => setReset(false), 0);
          }}
        >
          <Feather name="plus-circle" color="#fff" size={18} />
          <Text style={styles.addToListText}>
            {t("cards.shoppingLists.addToList")}
          </Text>
        </Pressable>
      </View>

      {/* SEPARATOR */}
      <View style={styles.separator} />

      {/* LISTA ZAKUPÓW */}
      <View style={styles.listBlock}>
        {list?.map((food, foodIndex) => {
          const editing = editingIndices.includes(foodIndex);
          return (
            <View key={foodIndex + 1} style={styles.foodContainer}>
              {editing ? (
                <FoodEditor
                  initialFood={food}
                  onChange={(food: Food | null) => {
                    if (food)
                      setTempFood((prev) => ({ ...prev, [foodIndex]: food }));
                  }}
                />
              ) : (
                <>
                  <Text style={styles.itemName}>{food.name}</Text>
                  <Text style={styles.itemAmount}>
                    {food.amount} {food.unit}
                  </Text>
                </>
              )}
              <View style={styles.buttons}>
                <Pressable onPress={() => handleEditClick(foodIndex)}>
                  <Feather
                    name={editing ? "check-square" : "edit"}
                    color={editing ? "green" : "blue"}
                  />
                </Pressable>
                <Pressable onPress={() => onRemove(food)}>
                  <Feather name="x" color="red" size={20} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {/* GUZIK DODAJ DO LODÓWKI */}
      <Pressable
        style={[styles.addButton, isSubmitting && { opacity: 0.5 }]}
        onPress={handleAddListToFridge}
        disabled={isSubmitting}
      >
        <Text style={styles.addButtonText}>
          {isSubmitting ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <ActivityIndicator size="small" color={GreenVar} />
            </View>
          ) : (
            <Text style={styles.addButtonText}>Add to virtual fridge</Text>
          )}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: 16,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  editorBlock: {
    width: "100%",
    gap: 10,
  },
  addToListButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GreenVar,
    borderRadius: 8,
    paddingVertical: 8,
    gap: 6,
  },
  addToListText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  listBlock: {
    width: "100%",
    gap: 10,
  },
  foodContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 3,
    color: "#000",
    paddingHorizontal: 5,
  },
  itemAmount: {
    fontSize: 16,
    flex: 1.5,
    textAlign: "right",
    color: "#333",
    marginRight: 5,
  },
  buttons: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: "60%",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 18,
    textAlign: "center",
    paddingVertical: 7.5,
  },
});
