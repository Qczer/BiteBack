import { WhiteVar } from "@/assets/colors/colors";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConfirmOption {
  label: string;
  onPress: () => void;
  type?: "default" | "cancel" | "danger";
}

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description?: string;
  options: ConfirmOption[];
}

export default function ConfirmModal({
  visible,
  title,
  description,
  options,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.buttonRow}>
            {options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.button,
                  opt.type === "cancel" && styles.cancel,
                  opt.type === "danger" && styles.danger,
                ]}
                onPress={opt.onPress}
              >
                <Text style={styles.buttonText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: WhiteVar,
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#4CAF50", // default zielony
  },
  cancel: {
    backgroundColor: "#ccc",
  },
  danger: {
    backgroundColor: "red",
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  closeText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
});
