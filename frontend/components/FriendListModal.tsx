import User from "@/types/User";
import { router } from "expo-router";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FriendListModalProps {
  visible: boolean;
  onClose: () => void;
  friends: User[];
}
export default function FriendsModal({
  visible,
  onClose,
  friends,
}: FriendListModalProps) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>All Friends</Text>
        {friends.map((f: User) => (
          <TouchableOpacity
            key={f._id}
            style={styles.friendRow}
            onPress={() => {
              router.push({
                pathname: "/(more)/PublicProfileScreen",
                params: { userID: f._id },
              });
            }}
          >
            <Image
              style={styles.avatar}
              resizeMode="cover"
              source={require("@/assets/images/background.png")}
            />
            <Text style={styles.name}>{f.username}</Text>
          </TouchableOpacity>
        ))}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  friendRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  name: { fontSize: 16 },
  closeButton: { marginTop: 20, alignSelf: "center" },
  closeText: { color: "blue", fontSize: 16 },
});
