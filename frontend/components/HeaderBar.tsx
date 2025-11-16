import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { Text, View } from "@/components/Themed";
import { getNotificationsCount } from "@/services/AuthService";
import { Courgette_400Regular, useFonts } from "@expo-google-fonts/courgette";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface HeaderBarProps {
  notificationsCount?: number; // teraz opcjonalne
  nickname?: string | null;
}

export default function HeaderBar({
  notificationsCount,
  nickname,
}: HeaderBarProps) {
  const [fontsLoaded] = useFonts({ Courgette_400Regular });
  const [internalCount, setInternalCount] = useState<number>(0);

  useEffect(() => {
    if (notificationsCount === undefined) {
      getNotificationsCount().then(setInternalCount);
    }
  }, [notificationsCount]);

  const count = notificationsCount ?? internalCount;

  if (!fontsLoaded) return null;

  return (
    <View style={styles.header}>
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/adaptive-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>BiteBack</Text>
        </View>

        <TouchableOpacity style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={28} color={GreenVar} />
          {count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const HEADER_HEIGHT = 80;
const HEADER_BAR_HEIGHT = 48;

const styles = StyleSheet.create({
  header: {
    position: "relative",
    backgroundColor: WhiteVar,
    width: "100%",
    height: HEADER_HEIGHT,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    elevation: 2,
    paddingHorizontal: 16,
  },
  headerBar: {
    backgroundColor: WhiteVar,
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 8,
    height: HEADER_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WhiteVar,
  },
  logo: {
    width: screenWidth * 0.08,
    height: screenWidth * 0.08,
    marginRight: 8,
  },
  appName: {
    fontSize: screenWidth * 0.05,
    fontFamily: "Courgette_400Regular",
    color: GreenVar,
    fontWeight: "600",
  },
  headerRight: {
    padding: 4,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
});
