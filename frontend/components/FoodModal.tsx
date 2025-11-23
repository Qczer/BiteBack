import { deleteFood, editFood, editFoodProperty } from "@/api/endpoints/fridge";
import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { useUser } from "@/contexts/UserContext";
import Food, {FoodCategory} from "@/types/Food";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import FoodIconPickerModal from "./IconModal";

interface FoodModalProps {
  visible: boolean;
  onClose: () => void;
  food: Food | null;
}

const categoryItems = [
  { label: "Meat 🍖", value: FoodCategory.Meat },
  { label: "Dairy 🥛", value: FoodCategory.Dairy },
  { label: "Fruit 🍎", value: FoodCategory.Fruit },
  { label: "Vegetable 🥦", value: FoodCategory.Vegetable },
  { label: "Snacks 🍪", value: FoodCategory.Snack },
  { label: "Fastfood 🍔", value: FoodCategory.Junk },
  { label: "Other ❓", value: FoodCategory.Other },
];
const unitItems = [
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Gram (g)", value: "g" },
  { label: "Mililiter (ml)", value: "ml" },
  { label: "Litr (l)", value: "l" },
];

export default function FoodModal({ visible, onClose, food }: FoodModalProps) {
  if (!food) return null;

  const { userID } = useUser();

  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(
    food.iconUrl ?? "cube-outline"
  );

  const [date, setDate] = useState( new Date(food.expDate as Date) ?? new Date());
  const [show, setShow] = useState(false);

  const [editedFood, setEditedFood] = useState<Food>(food);
  const [unitValue, setUnitValue] = useState(editedFood.unit || null);
  const [categoryValue, setCategoryValue] = useState(editedFood.category);

  const handleChange = (key: keyof Food, value: string) => {
    setEditedFood({ ...editedFood, [key]: value });
  };

  const handleSave = async () => {
    if (!food._id) return;

    let newParams: editFoodProperty[] = Object.entries(editedFood)
      .filter(
        ([key, value]) =>
          key !== "_id" &&
          key !== "__v" &&
          value !== undefined &&
          value !== null
      )
      .map(([key, value]) => ({
        name: key,
        value: key === "expDate" ? date.toISOString() : value,
      }));
    await editFood(userID, food._id, { id: food._id, params: newParams });
    onClose();
  };

  const handleDelete = async () => {
    if (!food._id) return;

    await deleteFood(userID, food._id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Product</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* IMAGE + EDIT ICON */}
          <View style={styles.imageRow}>
            <Ionicons name={selectedIcon as any} size={80} color="gray" />

            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => setIconModalVisible(true)}
            >
              <Ionicons name="create-outline" size={22} color={GreenVar} />
            </TouchableOpacity>
          </View>

          {/* INFO (EDITABLE) */}
          <View style={styles.infoBlock}>
            {/* NAME */}
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={editedFood.name || ""}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Product name"
              />
              <Ionicons name="create-outline" size={20} color={GreenVar} />
            </View>

            {/* AMOUNT */}
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={editedFood.amount?.toString() || ""}
                onChangeText={(text) => handleChange("amount", text)}
                placeholder="Amount"
              />
              <Ionicons name="create-outline" size={20} color={GreenVar} />
            </View>

            {/* UNIT */}
            <Text style={styles.label}>Unit</Text>
            <Dropdown
              value={unitValue}
              data={unitItems}
              onChange={(value) => {
                setUnitValue(value.value);
                handleChange("unit", value.value);
              }}
              placeholder="Select unit"
              style={{ marginBottom: 10 }}
              labelField="label"
              valueField="value"
            />

            {/* CATEGORY */}
            <Text style={styles.label}>Category</Text>
            <Dropdown
              value={categoryValue as string}
              data={categoryItems}
              onChange={(value) => {
                setCategoryValue(value.value);
                handleChange("category", value.value);
              }}
              placeholder="Select category"
              style={{ marginBottom: 10 }}
              labelField="label"
              valueField="value"
            />

            {/* EXPIRY DATE */}
            <Text style={styles.label}>Expiry Date</Text>
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
                <Text style={styles.dateButtonText}>Pick date</Text>
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

          {/* ACTIONS */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons name="save-outline" size={18} color={WhiteVar} />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "red" }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={18} color={WhiteVar} />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FoodIconPickerModal
        visible={iconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelect={(icon) => {
          setSelectedIcon(icon);
          handleChange("iconUrl", icon); // zapisujemy w editedFood
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: WhiteVar,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: GreenVar,
  },
  imageRow: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 8,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: WhiteVar,
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  infoBlock: {
    marginBottom: 16,
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
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GreenVar,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    color: WhiteVar,
    fontSize: 14,
    fontWeight: "500",
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
