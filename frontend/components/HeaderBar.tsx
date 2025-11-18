import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { Text, View } from "@/components/Themed";
import {
  getCurrencyCount,
  getNotificationsCount,
} from "@/services/AuthService";
import { Courgette_400Regular, useFonts } from "@expo-google-fonts/courgette";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function HeaderBar() {
  const [fontsLoaded] = useFonts({ Courgette_400Regular });
  const [notifications, setNotifications] = useState<number>(0);
  const [currency, setCurrency] = useState<number>(0);

  // Ładowanie danych i cykliczne odświeżanie
  useEffect(() => {
    const fetchData = async () => {
      const notif = await getNotificationsCount();
      const curr = await getCurrencyCount();
      setNotifications(notif);
      setCurrency(curr);
    };

    fetchData();

    // odświeżaj co 30 sekund
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.header}>
      <View style={styles.headerBar}>
        {/* Left side */}
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/adaptive-icon.png")}
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
              <Ionicons name="cash-outline" size={26} color={GreenVar} />
              <Text style={styles.currencyText}>{currency.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color={GreenVar} />
            {notifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notifications > 9 ? "9+" : notifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const HEADER_HEIGHT = 100;
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
    backgroundColor: WhiteVar,
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
    backgroundColor: WhiteVar,
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
