import translate from "@/locales/i18n";
import Food from "@/types/Food";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface FoodEditorProps {
  initialFood?: Food;
  reset?: boolean;
  onChange: (food: Food | null) => void;
}

export default function FoodEditor({
  initialFood,
  reset,
  onChange,
}: FoodEditorProps) {
  const tURL = "foodEditor.";
  const t = (key: string) => translate(tURL + key);

  const [name, setName] = useState<string>(initialFood?.name ?? "");
  const [amount, setAmount] = useState<string>(
    initialFood?.amount?.toString() ?? ""
  );

  // Unit dropdown
  const [unitOpen, setUnitOpen] = useState(false);
  const [unitValue, setUnitValue] = useState(initialFood?.unit ?? null);
  const [unitItems, setUnitItems] = useState([
    { label: "Gram (g)", value: "g" },
    { label: "Mililiter (ml)", value: "ml" },
    { label: "Litr (l)", value: "l" },
    { label: "Kilogram (kg)", value: "kg" },
  ]);

  // Category dropdown
  const [catOpen, setCatOpen] = useState(false);
  const [catValue, setCatValue] = useState(initialFood?.category ?? null);
  const [catItems, setCatItems] = useState([
    { label: "Meat 🍖", value: "meat" },
    { label: "Dairy 🥛", value: "dairy" },
    { label: "Fruit 🍎", value: "fruit" },
    { label: "Vegetable 🥦", value: "vegetable" },
    { label: "Snacks 🍪", value: "snacks" },
    { label: "Fastfood 🍔", value: "fastfood" },
    { label: "Other ❓", value: "other" },
  ]);

  useEffect(() => {
    if (name && amount && unitValue && catValue) {
      onChange({
        ...initialFood,
        name,
        amount: parseFloat(amount.replace(",", ".")) || 0,
        unit: unitValue,
        category: catValue,
      });
    }
  }, [name, amount, unitValue, catValue]);

  useEffect(() => {
    if (reset) {
      setName("");
      setAmount("");
      setUnitValue(null);
      setCatValue(null);
    }
  }, [reset]);

  return (
    <View style={styles.addFoodContainer}>
      {/* NAME */}
      <TextInput
        style={[styles.textInput, { flex: 3 }]}
        placeholder={t("foodName")}
        value={name}
        onChangeText={setName}
        underlineColorAndroid="transparent"
      />

      {/* AMOUNT + UNIT */}
      <View style={styles.amountContainer}>
        <TextInput
          style={[styles.textInput, { flex: 0.7 }]}
          placeholder={t("amount")}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          underlineColorAndroid="transparent"
        />

        <View style={{ flex: 1.2 }}>
          {/* TODO: przeslanie tego do bazy */}
          <DropDownPicker
            open={unitOpen}
            value={unitValue}
            items={unitItems}
            setOpen={setUnitOpen}
            setValue={setUnitValue}
            setItems={setUnitItems}
            placeholder={t("unit")}
            style={{ borderColor: "black" }}
            dropDownContainerStyle={{ borderColor: "#ddd" }}
            zIndex={2000}
            zIndexInverse={3000}
          />
        </View>
      </View>

      {/* CATEGORY */}
      <View style={{ marginTop: 10 }}>
        <DropDownPicker
          open={catOpen}
          value={catValue}
          items={catItems}
          setOpen={setCatOpen}
          setValue={setCatValue}
          setItems={setCatItems}
          placeholder={t("category")}
          style={{ borderColor: "black" }}
          dropDownContainerStyle={{ borderColor: "#ddd" }}
          zIndex={1000}
          zIndexInverse={4000}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addFoodContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "transparent",
  },
  textInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 0,
    margin: 0,
    paddingHorizontal: 5,
  },
  amountContainer: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
});
