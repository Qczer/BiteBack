import { getUser } from "@/api/endpoints/user";
import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import translate from "@/locales/i18n";
import User from "@/types/User";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PublicProfileScreen() {
  const tURL = "screens.profile.";
  const t = (key: string) => translate(tURL + key);
  const { userID } = useLocalSearchParams();
  // przykładowe dane – w realnej wersji pobierasz z API
  const [friend, setFriend] = useState<User | null>(null);
  const nickname = "OtherUser";
  const accountDate = "2024-01-15";
  const currencyValue = 250;

  const friends: string[] = ["Alice", "Bob", "Charlie"];

  useEffect(() => {
    const getFriend = async () => {
      const friend = await getUser(userID as string);
      setFriend(friend.data);
    };
    getFriend();
  }, [userID]);

  return (
    <View style={{ flex: 1, backgroundColor: WhiteVar }}>
      {/* <HeaderBar /> */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backgroundHigher}></View>

        {/* Karta profilu */}
        <View style={styles.card}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.avatar}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.nickname}>{friend?.username}</Text>
            <Text style={styles.infoText}>
              Joined: {new Date(friend?.createDate as any).toLocaleDateString()}
            </Text>
            <Text style={styles.infoText}>BiteScore: {friend?.bitescore}</Text>
          </View>
        </View>

        {/* Pasek znajomych */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{translate("common.friends")}</Text>
          <View style={styles.friendsList}>
            {/* {friend. && userFriends.friends?.length > 0 ? (
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
            )} */}
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
