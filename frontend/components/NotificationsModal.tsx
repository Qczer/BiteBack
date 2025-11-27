import { GreenVar } from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Notification from "@/types/Notification";
import {deleteNotification} from "@/api/endpoints/user";
import {useUser} from "@/contexts/UserContext";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export default function NotificationsModal({
  visible,
  onClose,
  notifications
}: NotificationsModalProps) {
  const { userID, token, refreshData } = useUser();

  const removeNotification = async (id: string) => {
    const delRes = await deleteNotification(userID, id, token);
    refreshData();
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => removeNotification(item._id)}
          >
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</Text>
      </View>
      <Text style={styles.message}>{item.body}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Powiadomienia</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyText}>Brak nowych powiadomień</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: GreenVar,
  },
  closeButton: {
    fontSize: 22,
    color: "#333",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  closeIcon: {
    marginLeft: 8, // odstęp od tytułu
  },

  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});
