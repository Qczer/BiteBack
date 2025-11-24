import { addFoodToFridge } from "@/api/endpoints/fridge";
import { GreenVar } from "@/assets/colors/colors";
import { useUser } from "@/contexts/UserContext";
import Food from "@/types/Food";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ListRenderItemInfo
} from "react-native";
import Toast from "react-native-toast-message";
import FoodEditor from "./FoodEditor";
import translate from "@/locales/i18n"

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
  const { userID } = useUser();

  const tURL = "cards.shoppingLists.";
  const t = (key: string) => translate(tURL + key)

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

      await addFoodToFridge(userID, list);
      clearList();
      showSuccessToast("Successfully added!");
    } catch (error) {
      showToast("Error: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funkcja renderująca pojedynczy element listy
  const renderItem = ({ item: food, index: foodIndex }: ListRenderItemInfo<Food>) => {
    const editing = editingIndices.includes(foodIndex);
    return (
      <View style={styles.foodContainer}>
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
          <Pressable style={styles.button} onPress={() => handleEditClick(foodIndex)}>
            <Feather
              name={editing ? "check-square" : "edit"}
              color={editing ? "green" : "blue"}
              size={16}
            />
          </Pressable>
          {!editing && (
            <Pressable style={styles.button} onPress={() => onRemove(food)}>
              <Feather name="x" color="red" size={22}/>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        // Dodajemy odstęp między elementami listy (zamiast gap w kontenerze)
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        
        // Nagłówek listy (Formularz dodawania)
        ListHeaderComponent={
          <View style={styles.headerWrapper}>
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
                  {t("addToList")}
                </Text>
              </Pressable>
            </View>
            <View style={styles.separator} />
          </View>
        }

        // Stopka listy (Przycisk dodawania do lodówki)
        ListFooterComponent={
          <Pressable
            style={[styles.addButton, isSubmitting && { opacity: 0.5 }]}
            onPress={handleAddListToFridge}
            disabled={isSubmitting}
          >
            <Text style={styles.addButtonText}>
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={GreenVar} />
                </View>
              ) : (
                <Text style={styles.addButtonText}>{t("addToFridge")}</Text>
              )}
            </Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Usunięto ScrollView style props, przeniesiono do View
    flex: 1, // Ważne, aby lista zajmowała dostępną przestrzeń
    padding: 16,
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerWrapper: {
    marginBottom: 10,
    gap: 10
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
    paddingVertical: 12,
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
    marginVertical: 5, // Zmniejszono, bo FlatList Header ma swoje odstępy
  },
  // listBlock usunięty - FlatList zarządza układem
  foodContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    alignItems: "center", // Poprawa wyrównania
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
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 8,
    margin: 0
  },
  addButton: {
    width: "100%", // Zmieniono na 100% względem kontenera lub dopasuj według uznania
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20, // Odstęp od listy
    marginBottom: 10,
    zIndex: -1
  },
  addButtonText: {
    fontSize: 18,
    textAlign: "center",
    paddingVertical: 7.5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  }
});