import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import AddFriendModal from "@/components/AddFriendModal";
import HeaderBar from "@/components/HeaderBar";
import Invitations from "@/components/InvitationsModal";
import LogoutModal from "@/components/LogoutModal";
import { useUser } from "@/contexts/UserContext";
import translate from "@/locales/i18n";
import { handleLogout } from "@/services/Storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const { user, userFriends, clearUser } = useUser();
  console.log("=========================");
  console.log("UserID: " + userFriends?.userID);
  console.log("Username: ", userFriends?.username);
  console.log("Friends: ", userFriends?.friends);
  console.log("Requests: ", userFriends?.requests);

  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const tURL = "screens.profile.";
  const t = (key: string) => translate(tURL + key);

  // const leaderboard = [1, 2, 3, 5, 7, 9, 10];
  const newInvitationsCount = 3;

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: WhiteVar,
        paddingBottom: 60 + insets.bottom,
      }}
    >
      <LogoutModal
        showConfirm={showConfirm}
        cancelOnPress={() => setShowConfirm(false)}
        acceptOnPress={async () => {
          setShowConfirm(false);
          clearUser();
          await handleLogout();
        }}
      />

      {/* Modals */}
      <AddFriendModal
        visible={showAddFriend}
        onClose={() => setShowAddFriend(false)}
      />
      <Invitations
        visible={showInvitations}
        onClose={() => setShowInvitations(false)}
        invitations={[]}
      />

      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backgroundHigher}></View>

        {/* Karta profilu */}
        <View style={styles.card}>
          <View
            style={{ position: "relative", backgroundColor: "transparent" }}
          >
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : require("@/assets/images/logo.png")
              }
              style={styles.avatar}
            />
            {/* Ikonka edycji */}
            <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
              <Ionicons name="create-outline" size={18} color={WhiteVar} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.nickname}>{user?.username ?? "Guest"}</Text>
            <Text style={styles.infoText}>
              {t("joined")}:{" "}
              {new Date(user?.createDate ?? "").toLocaleDateString()}
            </Text>
            <Text style={styles.infoText}>
              BiteScore: {user?.bitescore ?? 0}
            </Text>
          </View>
        </View>

        {/* Ikony pod kartą */}
        <View style={[styles.iconRow, styles.shadow]}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setShowAddFriend(true);
            }}
          >
            <Ionicons name="person-add" size={32} color={GreenVar} />
            <Text style={styles.iconLabel}>{t("addFriend")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setShowInvitations(true);
            }}
          >
            <Ionicons name="mail" size={32} color={GreenVar} />
            <Text style={styles.iconLabel}>{t("invitations")}</Text>
            {userFriends && userFriends.requests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {userFriends.requests.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Pasek znajomych */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{translate("common.friends")}</Text>
          <View style={styles.friendsList}>
            {userFriends && userFriends.friends?.length > 0 ? (
              userFriends.friends.map((f, i) => (
                <TouchableOpacity
                  key={f._id}
                  style={styles.friendCard}
                  onPress={() => {
                    router.push({
                      pathname: "/(more)/PublicProfileScreen",
                      params: { userID: f._id },
                    });
                  }}
                >
                  <Image
                    style={styles.friendAvatar}
                    resizeMode="cover"
                    source={require("@/assets/images/background.png")}
                  />
                  <Text style={styles.friendName}>{f.username}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View>
                <Image
                  source={require("@/assets/images/people/noFriends.png")}
                  style={{
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                  height={100}
                  width={100}
                  resizeMode="contain"
                ></Image>
                <Text style={{ textAlign: "center" }}>{t("noFriends")}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Leaderboard – tylko jeśli są znajomi */}
        {userFriends && userFriends.friends.length > 0 && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Leaderboard</Text>
            <View style={styles.podium}>
              {userFriends.friends
                .slice()
                .sort((a, b) => b.bitescore - a.bitescore)
                .slice(0, 3)
                .map((f, i) => {
                  const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
                  const podiumStyle =
                    i === 0
                      ? styles.goldBox
                      : i === 1
                      ? styles.silverBox
                      : styles.bronzeBox;

                  return (
                    <View key={i} style={[styles.podiumSlot, podiumStyle]}>
                      <Text style={styles.medal}>{medal}</Text>
                      <Text style={styles.username}>{f.username}</Text>
                      <Text style={styles.score}>{f.bitescore} pts</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {/* Rewards */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t("biteScoreRewards")}</Text>
          <Text style={styles.infoText}>
            {translate("common.comingSoon")}...
          </Text>
        </View>

        {/* Logout */}
        <View style={styles.panel}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.6}
            onPress={() => {
              setShowConfirm(true);
            }}
          >
            <Ionicons name="log-out-outline" size={24} color={WhiteVar} />
            <Text style={styles.logoutText}>{t("logout")}</Text>
          </TouchableOpacity>
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
    backgroundColor: "transparent",
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
    fontSize: 18,
    color: "#333",
  },
  leaderboard: {
    gap: 6,
    backgroundColor: "snow",
  },
  leader: {
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 50,
    marginVertical: 40,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: "snow",
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
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: WhiteVar,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: GreenVar,
    borderRadius: 16,
    padding: 8,
  },
  friendCard: {
    alignItems: "center",
    justifyContent: "center",
  },
  friendName: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
    padding: 7,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  shadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  // panel: {
  //   marginTop: 20,
  //   padding: 10,
  //   backgroundColor: "#f9f9f9",
  //   borderRadius: 8,
  // },
  // panelTitle: {
  //   fontSize: 18,
  //   fontWeight: "700",
  //   marginBottom: 12,
  //   textAlign: "center",
  // },
  podium: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  podiumSlot: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 8,
  },
  goldBox: {
    backgroundColor: "#FFD700",
    height: 120, // najwyższe
  },
  silverBox: {
    backgroundColor: "#C0C0C0",
    height: 90,
  },
  bronzeBox: {
    backgroundColor: "#CD7F32",
    height: 70,
  },
  medal: {
    fontSize: 28,
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  score: {
    fontSize: 12,
    color: "#555",
  },
});
