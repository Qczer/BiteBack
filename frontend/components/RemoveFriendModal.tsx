import { removeFriend } from "@/api/endpoints/friends";
import { WhiteVar } from "@/assets/colors/colors";
import { useUser } from "@/contexts/UserContext";
import translate from "@/locales/i18n";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RemoveFriendModalProps {
  name: string;
  visible: boolean;
  onClose: () => void;
}

export default function RemoveFriendModal({
  name,
  visible,
  onClose,
}: RemoveFriendModalProps) {
  const tURL = "screens.profile.";
  const t = (key: string) => translate(tURL + key);

  const { token, refreshData } = useUser();
  const [status, setStatus] = useState<"success" | "error" | "loading" | null>(
    null
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await removeFriend(name, token);
      if (res?.success) {
        setStatus("success");
        await refreshData();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatus("error");
        setMessage(res.message);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Error" + error);
    }
  };

  const handleClose = () => {
    // Resetujemy stan przy zamknięciu ręcznym
    setStatus(null);
    setMessage("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {status === "success" ? (
            <View style={styles.centerContent}>
              <View style={[styles.iconCircle, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="checkmark" size={40} color="green" />
              </View>
              <Text style={styles.successTitle}>{t("successRemove")}</Text>
              <Text style={styles.subText}>
                {name} nie jest już Twoim znajomym.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.centerContent}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#FFEBEE" }]}
                >
                  <Ionicons name="person-remove" size={32} color="#D32F2F" />
                </View>

                <Text style={styles.panelTitle}>{t("askToRemoveFriend")}</Text>

                <Text style={styles.description}>
                  {translate("common.confirmText")}{" "}
                  <Text style={{ fontWeight: "bold" }}>{name}</Text>{" "}
                  {translate("common.fromFriends")}
                </Text>
              </View>

              {status === "error" && (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={16} color="#D32F2F" />
                  <Text style={styles.errorText}>{message}</Text>
                </View>
              )}

              <View style={styles.buttonRow}>
                {/* Przycisk Anuluj */}
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  disabled={status === "loading"}
                >
                  <Text style={styles.cancelButtonText}>
                    {translate("common.cancel") || "Anuluj"}
                  </Text>
                </TouchableOpacity>

                {/* Przycisk Usuń */}
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleSubmit}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <ActivityIndicator color={WhiteVar} size="small" />
                  ) : (
                    <Text style={styles.deleteButtonText}>
                      {translate("common.confirm") || "Usuń"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Ionicons name="person-remove" size={20} color={WhiteVar} />
            <Text style={styles.buttonText}>{translate("common.confirm")}</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>{translate("common.close")}</Text>
          </TouchableOpacity> */}
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
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
  centerContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  subText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 4,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 10,
  },
  // Obsługa błędów
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    justifyContent: "center",
  },
  errorText: {
    color: "#D32F2F",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  // Przyciski
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12, // Dostępne od nowszych wersji RN, jeśli nie działa użyj marginHorizontal w przyciskach
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  deleteButton: {
    backgroundColor: "#D32F2F", // Czerwony ostrzegawczy
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButtonText: {
    color: WhiteVar,
    fontWeight: "600",
    fontSize: 16,
  },
});
