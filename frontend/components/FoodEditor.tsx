import { StyleSheet, TextInput } from "react-native";
import { View } from "./Themed";
import { useEffect, useState } from "react";
import Food from "@/types/Food";
import translate from "@/locales/i18n";

interface FoodEditorProps {
  initialFood?: Food;
  reset?: boolean;
  onChange: (food: Food | null) => void;
}

export default function FoodEditor({ initialFood, reset, onChange }: FoodEditorProps) {
  const tURL = "foodEditor."
  const t = (key: string) => translate(tURL + key);

  const [name, setName] = useState<string>(initialFood?.name ?? "");
  const [amount, setAmount] = useState<string>(initialFood?.amount.toString() ?? "");
  const [unit, setUnit] = useState(initialFood?.unit ?? "");
  
  useEffect(() => {
    if (name && amount && unit)
      onChange({ ...initialFood, name, amount: parseFloat(amount.replace(',', '.')) || 0, unit });
  }, [name, amount, unit])

  useEffect(() => {
    if (reset) {
      setName("");
      setAmount("");
      setUnit("");
    }
  }, [reset])

  return (
    <View style={styles.addFoodContainer}>
      <TextInput style={[styles.textInput, { flex: 3 }]} placeholder={t("foodName")} value={name} onChangeText={setName} autoFocus />
      <TextInput style={[styles.textInput, { flex: 1.5 }]} placeholder={t("amount")} keyboardType="numeric" value={amount} onChangeText={setAmount} />
      <TextInput style={[styles.textInput, { flex: 1 }]} placeholder={t("unit")} value={unit} onChangeText={setUnit} />
    </View>
  )
}

const styles = StyleSheet.create({
  addFoodContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginTop: 20,
    backgroundColor: 'transparent'
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 0,
    margin: 0
  }
})