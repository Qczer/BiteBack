import translate from "@/locales/i18n";
import Food from "@/types/Food";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

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
  const [unitValue, setUnitValue] = useState(initialFood?.unit ?? null);
  const [unitItems, setUnitItems] = useState([
    { label: "Gram (g)", value: "g" },
    { label: "Mililiter (ml)", value: "ml" },
    { label: "Litr (l)", value: "l" },
    { label: "Kilogram (kg)", value: "kg" },
  ]);

  // Category dropdown
  const [catValue, setCatValue] = useState(initialFood?.category ?? null);
  const [catItems, setCatItems] = useState([
    { label: "Meat 🍖", value: "meat" },
    { label: "Dairy 🥛", value: "dairy" },
    { label: "Fruit 🍎", value: "fruit" },
    { label: "Vegetable 🥦", value: "vegetable" },
    { label: "Snacks 🍪", value: "snack" },
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
        expDate: new Date()
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
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={unitItems}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={t("unit")}
            value={unitValue}
            onChange={item => {
              setUnitValue(item.value);
            }}
          />
        </View>
      </View>

      {/* CATEGORY */}
      <View style={{ marginTop: 10 }}>
        <Dropdown 
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          placeholder={t("category")}
          data={catItems}
          labelField="label"
          valueField="value"
          value={catValue}
          onChange={(item: any) => {
            setCatValue(item.value);
          }}
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
  dropdown: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1, // Zamiast borderBottomWidth, dropdowny lepiej wyglądają z pełną ramką lub dostosuj do 0, 0, 1, 0
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
