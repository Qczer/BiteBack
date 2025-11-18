import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface InvitationsModalProps {
  visible: boolean;
  onClose: () => void;
  invitations: string[];
}

export default function InvitationsModal({
  visible,
  onClose,
  invitations,
}: InvitationsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.label}>Pending Invitations</Text>

          {invitations.length > 0 ? (
            <FlatList
              data={invitations}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.inviteRow}>
                  <Text style={styles.inviteText}>{item}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.accept}>
                      <Text style={styles.actionText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reject}>
                      <Text style={styles.actionText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={styles.infoText}>No invitations</Text>
          )}

          <TouchableOpacity
            style={[styles.button, styles.cancel]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
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
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: GreenVar,
    marginBottom: 10,
  },
  inviteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  inviteText: {
    fontSize: 14,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  accept: {
    backgroundColor: GreenVar,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reject: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    color: WhiteVar,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: GreenVar,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "600",
  },
});
