import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import {Modal, StyleSheet, Text, Touchable, TouchableOpacity, View} from "react-native";
import {useUser} from "@/contexts/UserContext";

interface InvitationsProps {
  visible: boolean;
  onClose: () => void;
  invitations: string[];
  onAccept: (index: number) => void;
  onReject: (index: number) => void;
}

export default function Invitations({
  visible,
  onClose,
  invitations = [],
  onAccept,
  onReject,
}: InvitationsProps) {
  const { refreshData } = useUser();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.panelTitle}>📩 Invitations</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={async () => await refreshData()}
          >
            <Ionicons name="refresh" size={24} color={GreenVar} />
          </TouchableOpacity>
          {invitations.length > 0 ? (
            invitations.map((inv, i) => (
              <View key={i} style={styles.inviteRow}>
                <Text style={styles.inviteText}>{inv}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.accept} onPress={() => onAccept(i)}>
                    <Ionicons name="checkmark" size={18} color={WhiteVar} />
                    <Text style={styles.actionText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reject} onPress={() => onReject(i)}>
                    <Ionicons name="close" size={18} color={WhiteVar} />
                    <Text style={styles.actionText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.infoText}>No invitations</Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
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
  refreshButton: {
    position: 'absolute',
    right: 0,
    padding: 4
  },
  inviteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  inviteText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  accept: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GreenVar,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  reject: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    color: WhiteVar,
    fontWeight: "600",
    marginLeft: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  closeText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
});
