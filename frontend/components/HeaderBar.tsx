import { GreenVar } from "@/assets/colors/colors";
import NotificationsModal from "@/components/NotificationsModal";
import { useUser } from "@/contexts/UserContext";
import { Courgette_400Regular, useFonts } from "@expo-google-fonts/courgette";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export const HEADER_HEIGHT = 100;
const HEADER_BAR_HEIGHT = 48;

export default function HeaderBar() {
  const { user, unreadNotifications } = useUser();
  const [fontsLoaded] = useFonts({ Courgette_400Regular });
  const [modalVisible, setModalVisible] = useState(false);

  if (!fontsLoaded) return null;

  return (
    // pointerEvents="box-none" pozwala przekazywać gesty do elementów pod headerem
    <View style={styles.header} pointerEvents="box-none">
      <View style={styles.headerBar}>
        {/* Left side */}
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>BiteBack</Text>
        </View>

        {/* Right side */}
        <View style={styles.headerRight}>
          {/* Currency */}
          <TouchableOpacity style={{ marginRight: 16 }}>
            <View style={styles.currencyBox}>
              <Image
                source={require("@/assets/images/BiteScore.png")}
                style={{ width: 35, height: 35 }}
              />
              <Text style={styles.currencyText}>{user?.bitescore ?? 0}</Text>
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="notifications-outline" size={28} color={GreenVar} />
            {unreadNotifications?.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadNotifications.length > 9
                    ? "9+"
                    : unreadNotifications.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <NotificationsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        fetchNotifications={async () => {
          // TODO: podłącz swoje API
          return [
            {
              id: "1",
              title: "Witaj w BiteBack!",
              message: "Twoje konto zostało pomyślnie utworzone.",
              date: "2025-11-25",
            },
            {
              id: "2",
              title: "Nowa nagroda",
              message: "Zdobyłeś 50 punktów BiteScore 🎉",
              date: "2025-11-24",
            },
          ];
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "relative",
    backgroundColor: "snow",
    width: "100%",
    height: HEADER_HEIGHT,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    elevation: 2,
    paddingHorizontal: 16,
    zIndex: 10, // upewnij się, że header jest nad treścią
  },
  headerBar: {
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
    justifyContent: "center",
  },
  logo: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    marginRight: 8,
  },
  appName: {
    fontSize: screenWidth * 0.05,
    lineHeight: screenWidth * 0.125,
    fontFamily: "Courgette_400Regular",
    color: GreenVar,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -6,
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
  currencyBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "600",
    color: GreenVar,
  },
});
