import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import HeaderBar from "@/components/HeaderBar";
import { Text, View } from "@/components/Themed";
import { Image, ScrollView, StyleSheet } from "react-native";

export default function PublicProfileScreen() {
  // przykładowe dane – w realnej wersji pobierasz z API
  const nickname = "OtherUser";
  const accountDate = "2024-01-15";
  const currencyValue = 250;

  const friends: string[] = ["Alice", "Bob", "Charlie"];
  const leaderboard = [1, 2, 3, 4, 5];

  return (
    <View style={{ flex: 1, backgroundColor: WhiteVar }}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backgroundHigher}></View>

        {/* Karta profilu */}
        <View style={styles.card}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.avatar}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.infoText}>Joined: {accountDate}</Text>
            <Text style={styles.infoText}>BitePoints: {currencyValue}</Text>
          </View>
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
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: WhiteVar,
  },
  backgroundHigher: {
    backgroundColor: GreenVar,
    width: "100%",
    height: "35%",
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
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
