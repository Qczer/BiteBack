import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface InviteCodeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InviteCodeModal({
  visible,
  onClose,
}: InviteCodeModalProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = () => {
    // przykładowa logika walidacji kodu
    if (code.trim() === "ABC123") {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.label}>Enter your friend's code:</Text>
          <TextInput
            style={styles.input}
            placeholder="Friend code"
            value={code}
            onChangeText={setCode}
          />

          {status === "success" && (
            <Text style={styles.success}>✅ Code accepted! Friend added.</Text>
          )}
          {status === "error" && (
            <Text style={styles.error}>❌ Invalid code, please try again.</Text>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: WhiteVar,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: GreenVar,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  success: {
    color: "green",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: GreenVar,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "600",
  },
});
