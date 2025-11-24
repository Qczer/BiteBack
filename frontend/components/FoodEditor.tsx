import translate from "@/locales/i18n";
import Food from "@/types/Food";
import { useEffect, useState } from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {Ionicons} from "@expo/vector-icons";
import {GreenVar, WhiteVar} from "@/assets/colors/colors";
import DateTimePicker from "@react-native-community/datetimepicker";

interface FoodEditorProps {
  initialFood?: Food;
  reset?: boolean;
  onChange: (food: Food | null) => void;
}

const catItems = [
  { label: `${translate("filters.meat")} 🍖`, value: "meat" },
  { label: `${translate("filters.dairy")} 🥛`, value: "dairy" },
  { label: `${translate("filters.fruit")} 🍎`, value: `fruit` },
  { label: `${translate("filters.vegetable")} 🥦`, value: "vegetable" },
  { label: `${translate("filters.snack")} 🍪`, value: "snack" },
  { label: `${translate("filters.junk")} 🍔`, value: "junk" },
  { label: `${translate("filters.other")} ❓`, value: "other" },
];

const unitItems = [
  { label: `${translate("units.g")} (g)`, value: "g" },
  { label: `${translate("units.ml")} (ml)`, value: "ml" },
  { label: `${translate("units.l")} (l)`, value: "l" },
  { label: `${translate("units.kg")} (kg)`, value: "kg" },
  { label: `${translate("units.pcs")}`, value: "pcs" },
];

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

  const [unitValue, setUnitValue] = useState(initialFood?.unit ?? null);
  const [catValue, setCatValue] = useState(initialFood?.category ?? null);
  const [date, setDate] = useState(new Date(initialFood?.expDate ?? Date.now() + 24 * 60 * 60 * 1000));
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (name && amount && unitValue && catValue) {
      onChange({
        ...initialFood,
        name,
        amount: parseFloat(amount.replace(",", ".")) || 0,
        unit: unitValue,
        category: catValue,
        expDate: date,
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
            onChange={(item) => {
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

      <View>
        <Text style={styles.label}>{t("expiryDate")}</Text>
        <View style={styles.inputRow}>
          {/* Podgląd aktualnej daty */}
          <Text style={styles.datePreview}>
            {date ? date.toLocaleDateString() : "No date selected"}
          </Text>

          {/* Przycisk do wyboru daty */}
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShow(true)}
          >
            <Text style={styles.dateButtonText}>{t("pickDate")}</Text>
          </TouchableOpacity>

          {/* Ikonka edycji */}
          <Ionicons name="create-outline" size={20} color={GreenVar} />

          {/* Picker w modalu */}
          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShow(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>
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
    borderColor: "black",
    borderWidth: 1, // Zamiast borderBottomWidth, dropdowny lepiej wyglądają z pełną ramką lub dostosuj do 0, 0, 1, 0
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
    marginTop: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    color: "#333",
  },
  datePreview: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  dateButton: {
    margin: 5,
    backgroundColor: GreenVar,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  dateButtonText: {
    color: WhiteVar,
    fontSize: 13,
    fontWeight: "500",
  },
});
