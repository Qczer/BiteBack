import Food from "@/classes/Food";
import ShoppingList from "@/components/ShoppingList";
import { getItem, setItem } from "@/services/AuthService";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const SHOPPING_LISTS_KEY = "shoppingLists";

export interface ShoppingListType {
  food: Food[]
}

export default function ShoppingListsScreen() {
  const [lists, setLists] = useState<ShoppingListType[]>([{food: []}]);

  useEffect(() => {
    let shoppingLists = getItem(SHOPPING_LISTS_KEY)
    shoppingLists.then(data => {
      if (data) {
        try {
          setLists(JSON.parse(data));
        }
        catch (e) {
          console.error("Błąd parsowania danych", e);
        }
      }
    })
  }, [])

  useEffect(() => {
    setItem(SHOPPING_LISTS_KEY, JSON.stringify(lists));
  }, [lists])

  const handleAddFoodToList = (listIndex: number, newFoodItem: Food) => {
    setLists(prevLists => {
      const newLists = [...prevLists];
      const targetList = { ...newLists[listIndex] };
      targetList.food = [...targetList.food, newFoodItem];
      newLists[listIndex] = targetList;
      
      return newLists;
    });
  };

  const handleRemoveFoodFromList = (listIndex: number, newFoodItem: Food) => {
    setLists(prevLists => {
      const newLists = [...prevLists];
      const targetList = { ...newLists[listIndex] };
      targetList.food = targetList.food.filter(f => f != newFoodItem);
      newLists[listIndex] = targetList;
      
      return newLists;
    });
  };

  const handleUpdateFood = (listIndex: number, foodIndex: number, newFood: Food) => {
    setLists(prevLists => {
      const newLists = [...prevLists];
      const targetList = { ...newLists[listIndex] };
      const newFoodArray = [...targetList.food];
      newFoodArray[foodIndex] = newFood;

      targetList.food = newFoodArray;
      newLists[listIndex] = targetList;

      if (newLists != prevLists)
        console.log("Updated food at index", foodIndex, "in list", listIndex);
      return newLists;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      {lists.map((list, listIndex) => (
        <ShoppingList
          key={listIndex+1} 
          list={list} 
          onAdd={(newFood) => handleAddFoodToList(listIndex, newFood)} 
          onRemove={(food) => handleRemoveFoodFromList(listIndex, food)}
          onUpdate={(updatedFood, foodIndex) => handleUpdateFood(listIndex, foodIndex, updatedFood)}
        />
      ))}
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
