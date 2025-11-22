import { StyleSheet, TextInput, View } from "react-native";
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
      <TextInput style={[styles.textInput, { flex: 3, fontWeight: '500' }]} placeholder={t("foodName")} value={name} onChangeText={setName}  underlineColorAndroid="transparent" />
      <View style={styles.amountContainer}>
        <TextInput style={[styles.textInput, { flex: 0.5, textAlign: 'right' }]} placeholder={t("amount")} keyboardType="numeric" value={amount} onChangeText={setAmount}  underlineColorAndroid="transparent" />
        <TextInput style={[styles.textInput, { flex: 1, textAlign: 'left' }]} placeholder={t("unit")} value={unit} onChangeText={setUnit}  underlineColorAndroid="transparent" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  addFoodContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'transparent'
  },
  textInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 0,
    margin: 0,
    paddingHorizontal: 5,
  },
  amountContainer: {
    flex: 1.5, 
    display: 'flex', 
    flexDirection: 'row',
  }
})