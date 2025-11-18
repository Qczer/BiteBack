import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { Text, View } from "@/components/Themed";
import { getItem } from "@/services/AuthService";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function FriendsScreen() {
  const nickname = getItem("userNickname") || "GuestUser";
  const accountDate = "2023-05-12";
  const currencyValue = 125.5;

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const friends: string[] = [];
  const leaderboard = [1, 2, 3, , 7, 9, 10];

  const userCode = "ABC123";
  const invitations = ["User1", "User2", "User3"];

  const handleSubmit = () => {
    if (code.trim() === "ABC123") {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: WhiteVar }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backgroundHigher}></View>

        {/* Sekcja dodawania znajomego */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Add Friend</Text>
          <TextInput
            style={styles.input}
            placeholder="Friend code"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          {status === "success" && (
            <Text style={styles.success}>✅ Code accepted! Friend added.</Text>
          )}
          {status === "error" && (
            <Text style={styles.error}>❌ Invalid code, please try again.</Text>
          )}
        </View>

        {/* Sekcja udostępniania kodu */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Share Code</Text>
          <Text style={styles.code}>{userCode}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* Sekcja zaproszeń */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Invitations</Text>
          {invitations.length > 0 ? (
            invitations.map((inv, i) => (
              <View key={i} style={styles.inviteRow}>
                <Text style={styles.inviteText}>{inv}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.accept}>
                    <Text style={styles.actionText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reject}>
                    <Text style={styles.actionText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.infoText}>No invitations</Text>
          )}
        </View>

        {/* Pasek znajomych */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Friends</Text>
          <View style={styles.friendsList}>
            {friends.length > 0 ? (
              friends.map((f, i) => (
                <Text key={i} style={styles.friend}>
                  👤 {f}
                </Text>
              ))
            ) : (
              <Text style={styles.infoText}>No friends yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: WhiteVar,
  },
  backgroundHigher: {
    backgroundColor: GreenVar,
    width: "100%",
    height: "55%",
    position: "absolute",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    top: 0,
    zIndex: -1,
  },
  card: {
    flexDirection: "row",
    width: "85%",
    backgroundColor: "snow",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 40,
    marginRight: 16,
  },
  cardInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "snow",
  },
  nickname: {
    fontSize: 22,
    fontWeight: "bold",
    color: GreenVar,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  panel: {
    width: "90%",
    backgroundColor: "snow",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  panelTitle: {
    fontSize: 18,
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
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  button: {
    backgroundColor: GreenVar,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "600",
  },
  code: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  inviteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: "snow",
  },
  inviteText: {
    fontSize: 14,
    color: "#333",
  },
  actions: {
    backgroundColor: "snow",
    flexDirection: "row",
    gap: 8,
  },
  accept: {
    backgroundColor: GreenVar,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
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
  friendsList: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "snow",
  },
  friend: {
    fontSize: 14,
    color: "#333",
  },
  leaderboard: {
    gap: 6,
    backgroundColor: "snow",
  },
  leader: {
    fontSize: 14,
    color: "#333",
  },
});
