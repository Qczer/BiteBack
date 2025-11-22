import { Courgette_400Regular, useFonts } from "@expo-google-fonts/courgette";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";

import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Twoje kolory
import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { useLanguage } from "@/contexts/LanguageContext";

const screenWidth = Math.round(Dimensions.get("window").width);

const MoreScreen = () => {
  const { t } = useLanguage();
  const [fontsLoaded] = useFonts({ Courgette_400Regular });

  const panels = [
    {
      name: "maps",
      iconName: "map-outline",
      panel: "/MapsScreen",
    },
    {
      name: "addPoint",
      iconName: "add-circle-outline",
      panel: "/AddPointScreen",
    },
    {
      name: "shoppingLists",
      iconName: "receipt-outline",
      panel: "/ShoppingListsScreen",
    },
    {
      name: "feedback",
      iconName: "chatbubble-ellipses-outline",
      panel: "/FeedbackScreen",
    },
    {
      name: "reportABug",
      iconName: "bug-outline",
      panel: "/ReportBugScreen",
    },
    {
      name: "settings",
      iconName: "cog-outline",
      panel: "/SettingsScreen",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>BiteBack</Text>
      </View>

      <ScrollView style={styles.flexContainer}>
        {panels.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(item.panel as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.iconName as any}
                size={36}
                color={GreenVar} // zielony akcent
                style={styles.cardIcon}
              />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>
                  {t(`cards.${item.name}.title`)}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {t(`cards.${item.name}.subtitle`)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={GreenVar} />
            </TouchableOpacity>
          </View>
        ))}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>2025 Biteback.</Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteVar, // jasne tło
  },
  header: {
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    // margin: "5%",
  },
  flexContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // jasny panel
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: GreenVar, // zielona ramka
  },
  cardIcon: {
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: "#333", // ciemny tekst
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#666", // subtelny szary
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: GreenVar,
    fontSize: 16,
    fontWeight: "bold",
  },
  appName: {
    fontSize: screenWidth * 0.07,
    fontFamily: "Courgette_400Regular",
    color: GreenVar,
    fontWeight: "600",
    marginTop: 10,
  },
});

export default MoreScreen;
