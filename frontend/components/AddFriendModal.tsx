import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {sendFriendRequest} from "@/api/endpoints/friends";
import {useUser} from "@/contexts/UserContext";
import translate from "@/locales/i18n"

interface AddFriendModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddFriendModal({
  visible,
  onClose,
}: AddFriendModalProps) {
  const tURL = "screens.profile."
  const t = (key: string) => translate(tURL + key)

  const { token } = useUser();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const res = await sendFriendRequest(name, token);
    if (res?.success)
      setStatus("success");
    else {
      setStatus("error");
      setMessage(res.message)
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.panelTitle}>👥 {t("addFriend")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("enterFriendsName")}
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Ionicons name="person-add" size={20} color={WhiteVar} />
            <Text style={styles.buttonText}>{translate("common.submit")}</Text>
          </TouchableOpacity>

          {status === "success" && (
            <Text style={styles.success}>✅ {t("success")}</Text>
          )}
          {status === "error" && (
            <Text style={styles.error}>❌ {message}</Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>{translate("common.close")}</Text>
          </TouchableOpacity>
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: GreenVar,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    backgroundColor: GreenVar,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 12,
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  success: {
    color: "green",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  closeText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
});
