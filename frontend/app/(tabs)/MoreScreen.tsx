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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Twoje kolory
import { GreenVar, WhiteVar } from "@/assets/colors/colors";

const screenWidth = Math.round(Dimensions.get("window").width);

const MoreScreen = () => {
  const panels = [
    {
      title: "Maps",
      subtitle: "Explore food points near you",
      iconName: "map-outline",
      panel: "/MapsScreen",
    },
    {
      title: "Add Point",
      subtitle: "Add a new point to the map",
      iconName: "add-circle-outline",
      panel: "/AddPointScreen",
    },
    {
      title: "Shopping List",
      subtitle: "Create shopping lists and add items to Fridge.",
      iconName: "receipt-outline",
      panel: "/ShoppingListScreen",
    },
    {
      title: "Feedback",
      subtitle: "Tell us what you think about the app",
      iconName: "chatbubble-ellipses-outline",
      panel: "/FeedbackScreen",
    },
    {
      title: "Report a bug",
      subtitle: "Noticed something off? Let us know",
      iconName: "bug-outline",
      panel: "/ReportBugScreen",
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/adaptive-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
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
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={GreenVar} />
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.footer}>
            <Text style={styles.footerText}>2025 Biteback.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
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
    width: screenWidth * 0.35,
    height: screenWidth * 0.35,
    margin: "10%",
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
});

export default MoreScreen;
