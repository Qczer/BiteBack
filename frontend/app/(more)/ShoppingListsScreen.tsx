import Food from "@/types/Food";
import ShoppingList from "@/components/ShoppingList";
import { getItem, removeItem, setItem } from "@/services/AuthService";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const SHOPPING_LIST_KEY = "shoppingLists";

export default function ShoppingListsScreen() {
  const [list, setList] = useState<Food[]>([]);

  useEffect(() => {
    let shoppingLists = getItem(SHOPPING_LIST_KEY)
    shoppingLists.then(data => {
      if (data) {
        try {
          setList(JSON.parse(data));
        }
        catch (e) {
          console.error("Błąd parsowania danych", e);
        }
      }
    })
  }, [])

  useEffect(() => {
    setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
  }, [list])

  const handleAddFoodToList = (newFoodItem: Food) => { 
    setList(prev => [...prev, newFoodItem]);
  };

  const handleRemoveFoodFromList = (newFoodItem: Food) => {
    setList(prev => prev.filter((f: Food) => f !== newFoodItem));
  };

  const handleUpdateFood = (newFood: Food, foodIndex: number) => {
    setList(prev => prev.map((food, index) => index === foodIndex ? newFood : food));
  };

  return (
    <View style={styles.container}>
      <ShoppingList
        list={list} 
        onAdd={(newFood) => handleAddFoodToList(newFood)} 
        onRemove={(food) => handleRemoveFoodFromList(food)}
        onUpdate={(updatedFood, foodIndex) => handleUpdateFood(updatedFood, foodIndex)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 50
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
