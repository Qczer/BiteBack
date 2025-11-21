import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import AddFriendModal from "@/components/AddFriendModal";
import ConfirmModal from "@/components/ConfirmModal";
import HeaderBar from "@/components/HeaderBar";
import Invitations from "@/components/InvitationsModal";
import LogoutModal from "@/components/LogoutModal";
import ShareCode from "@/components/ShareCodeModal";
import { Text, View } from "@/components/Themed";
import { useUser } from "@/hooks/useUser";
import translate from "@/locales/i18n";
import { handleLogout } from "@/services/Storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const tURL = "screens.profile.";
  const t = (key: string) => translate(tURL + key);

  const { data: user } = useUser();
  const nickname = user?.name ?? "Guest";

  const accountDate = "2023-05-12";
  const currencyValue = 125.5;

  const friends: string[] = [];
  const leaderboard = [1, 2, 3, , 7, 9, 10];
  const newInvitationsCount = 3;

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showShareCode, setShowShareCode] = useState(false);
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
    <View style={{ flex: 1, backgroundColor: WhiteVar }}>
      <LogoutModal showConfirm={showConfirm} cancelOnPress={() => setShowConfirm(false)} acceptOnPress={async () => { setShowConfirm(false); await handleLogout(); }} />

      {/* Modals */}
      <AddFriendModal
        visible={showAddFriend}
        onClose={() => setShowAddFriend(false)}
      />
      <ShareCode
        visible={showShareCode}
        onClose={() => setShowShareCode(false)}
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
          <View style={{ position: "relative" }}>
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
              <Ionicons name="create-outline" size={20} color={WhiteVar} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.infoText}>
              {t("joined")}: {accountDate}
            </Text>
            <Text style={styles.infoText}>BitePoints: {currencyValue}</Text>
          </View>
        </View>

        {/* Ikony pod kartą */}
        <View style={styles.iconRow}>
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
              setShowShareCode(true);
            }}
          >
            <Ionicons name="share-social" size={32} color={GreenVar} />
            <Text style={styles.iconLabel}>{t("shareCode")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setShowInvitations(true);
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
          <Text style={styles.infoText}>
            {translate("common.comingSoon")}...
          </Text>
        </View>

        {/* Logout */}
        <View style={styles.panel}>
          <TouchableOpacity
            style={styles.logoutButton}
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
    padding: 6,
  },
});
