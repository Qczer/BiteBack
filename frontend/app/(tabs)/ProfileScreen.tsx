import HeaderBar from "@/components/HeaderBar";
import { Text, View } from "@/components/Themed";
import { getItem } from "@/services/AuthService";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  const nickname = getItem("userNickname");
  return (
    <View style={{ flex: 1 }}>
      <HeaderBar />
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
