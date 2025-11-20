import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import HeaderBar from "@/components/HeaderBar";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useUser } from '@/hooks/useUser';
import translate from "@/locales/i18n";

export default function ProfileScreen() {
  const tURL = "screens.profile.";
  const t = (key: string) => translate(tURL + key);

  const { data: user } = useUser();
  const nickname = user?.name ?? "Guest";

  if (user)
    console.log("User data:", user);

  const accountDate = "2023-05-12";
  const currencyValue = 125.5;

  const friends: string[] = [];
  const leaderboard = [1, 2, 3, , 7, 9, 10];

  const newInvitationsCount = 3;

  return (
    <View style={{ flex: 1, backgroundColor: WhiteVar }}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backgroundHigher}></View>

        {/* Karta profilu */}
        <View style={styles.card}>
          <Image
            source={require("@/assets/images/adaptive-icon.png")}
            style={styles.avatar}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.infoText}>{t("joined")}: {accountDate}</Text>
            <Text style={styles.infoText}>BitePoints: {currencyValue}</Text>
          </View>
        </View>

        {/* Ikony pod kartą */}
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push("/(more)/FriendsScreen");
            }}
          >
            <Ionicons name="person-add" size={32} color={GreenVar} />
            <Text style={styles.iconLabel}>{t("addFriend")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push("/(more)/FriendsScreen");
            }}
          >
            <Ionicons name="share-social" size={32} color={GreenVar} />
            <Text style={styles.iconLabel}>{t("shareCode")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push("/(more)/FriendsScreen");
            }}
          >
            <Ionicons name="mail" size={32} color={GreenVar} />
            <Text style={styles.iconLabel}>{t("invitations")}</Text>
            {newInvitationsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{newInvitationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Pasek znajomych */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{translate("common.friends")}</Text>
          <View style={styles.friendsList}>
            {friends.length > 0 ? (
              friends.map((f, i) => (
                <Text key={i} style={styles.friend}>
                  👤 {f}
                </Text>
              ))
            ) : (
              <Text style={styles.infoText}>{t("noFriends")}</Text>
            )}
          </View>
        </View>

        {/* Leaderboard – tylko jeśli są znajomi */}
        {friends.length > 0 && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Leaderboard</Text>
            <View style={styles.leaderboard}>
              {leaderboard.map((l, i) => (
                <Text key={i} style={styles.leader}>
                  {l}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Rewards */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t("bitePointsRewards")}</Text>
          <Text style={styles.infoText}>{translate("common.comingSoon")}...</Text>
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
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
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
  rewards: {
    gap: 6,
  },
  reward: {
    fontSize: 14,
    color: "#333",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginVertical: 20,
    marginBottom: 40,
    backgroundColor: WhiteVar,
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -1,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
