import { WhiteVar } from "@/assets/colors/colors";
import HeaderBar from "@/components/HeaderBar";
import { Text, View } from "@/components/Themed";
import { getItem } from "@/services/AuthService";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [notificationsCount, setNotificationsCount] = useState<number>(3);

  useEffect(() => {
    const loadNickname = async () => {
      const nickname = await getItem("userNickname");
      setNickname(nickname);
    };
    loadNickname();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderBar />
      <Text style={styles.title}>Hello {nickname}</Text>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteVar,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "#eee",
  },
});
