import Food from "@/types/Food";
import ShoppingList from "@/components/ShoppingList";
import { getItem, removeItem, setItem } from "@/services/Storage";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import Toast from "react-native-toast-message";
import toastConfig from "@/components/ToastConfig";
import { showToast } from "../(auth)/LoginScreen";


const SHOPPING_LIST_KEY = "shoppingLists";

export default function ShoppingListsScreen() {
  const { food, fromScan } = useLocalSearchParams();
  const [list, setList] = useState<Food[]>(food ? JSON.parse(food as string) : []);

  useEffect(() => {
    if (fromScan)
      return;

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
    if (!fromScan)
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
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <ShoppingList
            list={list} 
            onAdd={(newFood) => handleAddFoodToList(newFood)} 
            onRemove={(food) => handleRemoveFoodFromList(food)}
            onUpdate={(updatedFood, foodIndex) => handleUpdateFood(updatedFood, foodIndex)}
            clearList={() => { setList([]); if(fromScan) {  router.replace("/(tabs)/VirtualFridgeScreen")} }}
            showToast={(key: string) => showToast(key)}
            />
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30
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
