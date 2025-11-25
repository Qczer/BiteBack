import { getProfile } from "@/api/endpoints/user";
import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import translate from "@/locales/i18n";
import { Profile, MutualFriendsInterface } from "@/types/User";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getMutualFriends } from "@/api/endpoints/friends";
import { useUser } from "@/contexts/UserContext";

export default function PublicProfileScreen() {
  const tURL = "screens.profile.";
  const t = (key: string) => translate(tURL + key);
  const { userName }: { userName: string } = useLocalSearchParams();
  const { token } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mutualFriends, setMutualFriends] = useState<MutualFriendsInterface | null>(null);


  useEffect(() => {
    const getFriend = async () => {
      const profileRes = await getProfile(userName, token);
      if (profileRes.success)
        setProfile(profileRes.data);

      const friendsRes = await getMutualFriends(userName, token);
      if (friendsRes.success)
        setMutualFriends(friendsRes.data)
    };
    getFriend();
  }, [userName]);

  return (
    <View style={{ flex: 1, backgroundColor: WhiteVar }}>
      {/* <HeaderBar /> */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backgroundHigher}></View>

        {/* Karta profilu */}
        <View style={styles.card}>
          <Image
            source={{ uri: profile?.avatar }}
            style={styles.avatar}
            resizeMode="contain"
          />
          <View style={styles.cardInfo}>
            <Text style={styles.nickname}>{profile?.username}</Text>
            <Text style={styles.infoText}>
              Joined: {profile?.createDate ? new Date(profile?.createDate).toLocaleDateString() : t("noDate")}
            </Text>
            <Text style={styles.infoText}>BiteScore: {profile?.bitescore}</Text>
          </View>
        </View>

        {/* Pasek znajomych */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{translate("common.mutualFriends")}</Text>
          <View style={styles.friendsList}>
            {mutualFriends && mutualFriends?.mutualFriends.length > 0 ? (
              mutualFriends.mutualFriends.map(f => (
                <TouchableOpacity
                  key={f._id}
                  style={styles.friendCard}
                  onPress={() => {
                    router.push({
                      pathname: "/(more)/PublicProfileScreen",
                      params: { userName: f.username },
                    });
                  }}
                >
                  <Image
                    style={styles.friendAvatar}
                    resizeMode="cover"
                    source={{ uri: f.avatar}}
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

        {mutualFriends && mutualFriends.mutualFriends.length > 0 && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{t("mutualLeaderboard")}</Text>
            <View style={styles.podium}>
              {
                mutualFriends.mutualFriends
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
  }
});
