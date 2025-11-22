import Food from "@/types/Food";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FoodEditor from "./FoodEditor";
import { Feather } from '@expo/vector-icons';
import { addFoodToFridge } from "@/api/endpoints/fridge";
import { useUser } from "@/contexts/UserContext";
import t from "@/locales/i18n";

interface ShoppingListProps {
  list: Food[];
  onAdd: (food: Food) => void;
  onRemove: (food: Food) => void;
  onUpdate: (food: Food, foodIndex: number) => void;
  clearList: () => void;
  showToast: (key: string) => void;
}

export default function ShoppingList({ list, onAdd, onRemove, onUpdate, clearList, showToast }: ShoppingListProps) {
  const { userId } = useUser();

  const [newFood, setNewFood] = useState<Food | null>(null);
  const [tempFood, setTempFood] = useState<Record<number, Food>>({});
  const [editingIndices, setEditingIndices] = useState<number[]>([]);
  const [reset, setReset] = useState<boolean>(false);

  const addFood = () => {
    if (newFood?.name && newFood?.amount && newFood?.unit) {
      onAdd(newFood);
      setNewFood(null);
    }
    else
      showToast("Please fill in all fields.");
  }

  const handleEditClick = (index: number) => {
    if (!editingIndices.includes(index)) {
      setEditingIndices(prev => [...prev, index]);
      setTempFood(prev => ({ ...prev, [index]: list[index] }) );
    }
    else {
      if (tempFood[index] !== list[index])
        onUpdate(tempFood[index], index);

      setTempFood(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      setEditingIndices(prev => prev.filter(i => i !== index));
    }
  }

  const handleAddListToFridge = () => {
    addFoodToFridge(userId, list);
    clearList();
  }

  return (
    <View style={[styles.container]}>
      {list?.map((food, foodIndex) => {
        const editing = editingIndices.includes(foodIndex);
        return (
          <View key={foodIndex+1} style={styles.foodContainer}>
            
            {editing ? (
              <FoodEditor initialFood={food} onChange={(food: Food | null) => {if(food) setTempFood(prev => ({ ...prev, [foodIndex]: food }))}} />
            ) : (
              <>
                <Text style={styles.itemName}>{food.name}</Text>
                <Text style={styles.itemAmount}>{food.amount} {food.unit}</Text>
              </>
            )}
            <View style={styles.buttons}>
              <Pressable onPress={() => handleEditClick(foodIndex)}><Feather name={editing ? "check-square" : "edit"} color={editing ? "green" : "blue"} /></Pressable>
              <Pressable onPress={() => onRemove(food)}><Feather name="x" color="red" size={20} /></Pressable>
            </View>
          </View>
        )
      })}
      <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
        <FoodEditor onChange={setNewFood} reset={reset}/>
        <Pressable style={{}} onPress={() => { addFood(); setReset(true); setTimeout(() => setReset(false), 0); }}>
          <Feather name="plus-circle" color="#00cc11ff" size={20} />
        </Pressable>
      </View>
      <Pressable style={[styles.addButton]} onPress={() => handleAddListToFridge()}>
        <Text style={styles.addButtonText}>{t("cards.shoppingLists.addBtn")}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    width: '100%',

    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  foodContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  addFoodContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 20
  },

  itemName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 3, // Zajmuje najwięcej miejsca
    color: '#000',
    paddingHorizontal: 5
  },
  itemAmount: {
    fontSize: 16,
    flex: 1.5,
    textAlign: 'right',
    color: '#333',
    marginRight: 5,
  },

  textInput: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 0,
    margin: 0
  },

  buttons: {
    // marginLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: '60%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 0,
    paddingVertical: 7.5,
  }
})