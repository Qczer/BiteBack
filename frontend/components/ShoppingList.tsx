import Food from "@/types/Food";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import FoodEditor from "./FoodEditor";

interface ShoppingListProps {
  list: Food[];
  onAdd: (food: Food) => void;
  onRemove: (food: Food) => void;
  onUpdate: (food: Food, foodIndex: number) => void;
}

export default function ShoppingList({ list, onAdd, onRemove, onUpdate }: ShoppingListProps) {
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
      console.log("Please fill all fields to add a food item.");
  }

  const handleEditClick = (index: number) => {
    if (!editingIndices.includes(index)) {
      setEditingIndices(prev => [...prev, index]);
      setTempFood(prev => ({ ...prev, [index]: list[index] }) );
    }
  }

  const handleOKClick = (index: number) => {
    if (tempFood[index] !== list[index])
      onUpdate(tempFood[index], index);

    setTempFood(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setEditingIndices(prev => prev.filter(i => i !== index));
  }

  return (
    <View style={[styles.container, styles.border]}>
      {list?.map((food, foodIndex) => {
        const editing = editingIndices.includes(foodIndex);
        return (
          <View key={foodIndex+1} style={styles.foodContainer}>
            
            {editing ? (
              <FoodEditor initialFood={food} onChange={(food: Food | null) => {if(food) setTempFood(prev => ({ ...prev, [foodIndex]: food }))}} />
            ) : (
              <>
                <Text style={{fontSize: 16, flex: 3}}>{food.name}</Text>
                <Text style={{flex: 1.5}}>{food.amount} {food.unit}</Text>
              </>
            )}
            {
              editing ? (
                <Pressable onPress={() => handleOKClick(foodIndex)}><Text style={{color: 'blue', fontWeight: 'bold'}}>OK</Text></Pressable>
              ) : (
                <Pressable onPress={() => handleEditClick(foodIndex)}><Text style={{color: 'blue'}}>Edit</Text></Pressable>
              )
            }
            <Pressable onPress={() => onRemove(food)}><Text>x</Text></Pressable>
          </View>
        )
      })}
      <FoodEditor onChange={setNewFood} reset={reset}/>
      <Pressable style={[styles.addButton, styles.border]} onPress={() => { addFood(); setReset(true); setTimeout(() => setReset(false), 0); }}>
        <Text style={styles.addButtonText}>+</Text>
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
    padding: 10,
    width: '100%'
  },
  border: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  foodContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    gap: 10,
  },
  addFoodContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginTop: 20
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 0,
    margin: 0
  },
  addButton: {
    width: '60%',
    padding: 0
  },
  addButtonText: {
    fontSize: 24,
    textAlign: 'center',
    margin: 0,
    padding: 0
  }
})