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

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
};

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  fetchNotifications: () => Promise<Notification[]>; // API podasz później
}

export default function NotificationsModal({
  visible,
  onClose,
  fetchNotifications,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (visible) {
      fetchNotifications().then(setNotifications).catch(console.error);
    }
  }, [visible]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => removeNotification(item.id)}
          >
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
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
              keyExtractor={(item) => item.id}
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
