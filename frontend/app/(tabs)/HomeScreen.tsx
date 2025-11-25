import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import HeaderBar from "@/components/HeaderBar";
import { withCopilotProvider } from "@/components/WithCopilotProvider";
import { useUser } from "@/contexts/UserContext";
import translate from "@/locales/i18n";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useRef } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Category {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const CopilotView = walkthroughable(View);
const CopilotText = walkthroughable(Text);

const screenWidth = Dimensions.get("window").width;
function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tURL = "screens.home.";
  const t = (key: string) => translate(tURL + key);
  const copilot = (key: string) => translate("copilot." + key);

  const { user, userFood } = useUser();
  const { start } = useCopilot();
  const hasStartedTutorial = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkTutorialFlag = async () => {
        try {
          const hasSeen = await AsyncStorage.getItem(
            "@hasSeenHomeScreenTutorial"
          );
          if (!hasSeen && !hasStartedTutorial.current) {
            // Odpalamy tutorial z opóźnieniem
            const timer = setTimeout(() => {
              hasStartedTutorial.current = true;
              start();
              AsyncStorage.setItem("@hasSeenHomeScreenTutorial", "true");
            }, 250);

            return () => clearTimeout(timer);
          }
        } catch (error) {
          console.error("Error checking tutorial flag.", error);
        }
      };

      // ma byc !dev jesli production ready
      if (!__DEV__) {
        checkTutorialFlag();
      }
    }, [start])
  );

  const categoryColors: Record<string, string> = {
    meat: "#b22222",
    dairy: "#87ceeb",
    fruit: "#e84393",
    vegetable: "#228b22",
    snacks: "#ffd700",
    fastfood: "#ff8c00",
    other: "#808080",
  };

  const fridgeToPieData = (): Category[] => {
    let categories: Record<string, number> = {};
    userFood.forEach((food) => {
      if (food.category)
        categories[food.category] = (categories[food.category] || 0) + 1;
    });

    return Object.keys(categories).map((key) => {
      return {
        name: translate("filters." + key),
        population: categories[key],
        color: categoryColors[key] || "#ccc",
        legendFontColor: "#333",
        legendFontSize: 11,
      };
    });
  };

  const pieData = fridgeToPieData();

  const todayStr = new Date().toDateString();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: 70 + insets.bottom },
      ]}
    >
      <HeaderBar />

      {/* LOGO + POWITANIE */}
      <CopilotStep order={1} text={copilot("homeStep1")} name="hello">
        <CopilotView style={styles.headerBlock}>
          <Text style={styles.welcomeText}>
            {t("hello")} {user?.username} 👋
          </Text>
          <Text style={styles.subText}>{t("helloSub")}</Text>
        </CopilotView>
      </CopilotStep>

      {/* FRIDGE SUMMARY */}

      <View style={[styles.fridgeSummary, styles.shadow]}>
        <Text style={styles.sectionTitle}>{t("fridgeOverview")}</Text>
        <View style={styles.summaryRow}>
          <Feather name="box" size={24} color={GreenVar} />
          <Text style={[styles.summaryText, { color: GreenVar }]}>
            {userFood.length} {t("itemsStored")}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Feather name="alert-circle" size={24} color="orange" />
          <Text style={[styles.summaryText, { color: "orange" }]}>
            {
              userFood.filter(
                (food) =>
                  new Date(food.expDate ?? "").toDateString() == todayStr
              ).length
            }{" "}
            {t("expiringToday")}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Feather name="alert-circle" size={24} color="red" />
          <Text style={[styles.summaryText, { color: "red" }]}>
            {
              userFood.filter((food) => {
                const expDate = new Date(food.expDate ?? "");
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                return expDate < today;
              }).length
            }{" "}
            {t("expired")}
          </Text>
        </View>
      </View>

      {/* Nutrition Overview */}
      <View style={[styles.nutritionBlock, styles.shadow]}>
        <Text style={styles.sectionTitle}>{t("nutritionOverview")}</Text>

        {/* Wyśrodkowany wykres */}
        {userFood.length > 0 && pieData ? (
          <View style={styles.chartWrapper}>
            <PieChart
              data={pieData}
              width={screenWidth * 0.8}
              height={220}
              chartConfig={{
                backgroundColor: WhiteVar,
                backgroundGradientFrom: WhiteVar,
                backgroundGradientTo: WhiteVar,
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                labelColor: () => "#333",
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              hasLegend={true}
            />
          </View>
        ) : (
          <View>
            <Image
              source={require("@/assets/images/people/emptyFridge.png")}
              style={{
                alignSelf: "center",
                marginBottom: 10,
              }}
              height={160}
              width={160}
              resizeMode="cover"
            ></Image>
            <Text style={{ textAlign: "center" }}>
              {t("yourFridgeIsEmpty")}
            </Text>
          </View>
        )}
      </View>

      {/* RECENTLY ADDED */}
      {userFood.length > 0 && (
        <View style={[styles.recentBlock, styles.shadow]}>
          <Text style={styles.sectionTitle}>{t("recentlyAdded")}</Text>
          {userFood
            .slice(-3)
            .reverse()
            .map((item, index) => (
              <View key={index + 1} style={styles.recentItem}>
                <Text style={styles.recentName}>{item.name}</Text>
                <Text style={styles.recentMeta}>
                  {item.amount + (item.unit ?? "")} •{" "}
                  {item.expDate
                    ? new Date(item.expDate).toLocaleDateString()
                    : ""}{" "}
                </Text>
              </View>
            ))}
        </View>
      )}

      {/* SZYBKIE AKCJE */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/ScanScreen")}
        >
          <Feather name="plus-circle" size={20} color={WhiteVar} />
          <Text style={styles.actionText}>{t("scanReceipt")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Alert.alert("Recipes", "Coming soon!");
          }}
        >
          {/* TODO */}
          <Feather name="book-open" size={20} color={WhiteVar} />
          <Text style={styles.actionText}>{t("recipes")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/ProfileScreen")}
        >
          <Feather name="user" size={20} color={WhiteVar} />
          <Text style={styles.actionText}>{t("profile")}</Text>
        </TouchableOpacity>
      </View>

      {/* QUICK LINKS */}
      <View style={[styles.quickLinks, styles.shadow]}>
        <Text style={styles.sectionTitle}>{t("shortcuts")}</Text>
        <View style={styles.linkRow}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/(more)/SettingsScreen")}
          >
            <Feather name="settings" size={18} color={GreenVar} />
            <Text style={styles.linkText}>
              {translate("screens.settings.title")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/(more)/FeedbackScreen")}
          >
            <Feather name="message-square" size={18} color={GreenVar} />
            <Text style={styles.linkText}>
              {translate("cards.feedback.title")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/(more)/ReportBugScreen")}
          >
            <Feather name="alert-triangle" size={18} color={GreenVar} />
            <Text style={styles.linkText}>
              {translate("cards.reportABug.title")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default withCopilotProvider(HomeScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: WhiteVar,
    alignItems: "center",
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: WhiteVar,
    margin: 25,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
    color: GreenVar,
  },
  subText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  fridgeSummary: {
    width: "85%",
    backgroundColor: "snow",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    width: "100%",
    textAlign: "left",
    fontSize: 18,
    fontWeight: "600",
    color: GreenVar,
    marginBottom: 10,
    backgroundColor: "snow",
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "snow",
    gap: 10,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 18,
    color: "#333",
  },
  recentBlock: {
    backgroundColor: "snow",
    padding: 16,
    borderRadius: 12,
    width: "85%",
    marginBottom: 20,
  },
  recentItem: {
    backgroundColor: WhiteVar,
    padding: 10,
    borderRadius: 8,
    elevation: 1,
    marginBottom: 8,
  },
  recentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  recentMeta: {
    fontSize: 13,
    color: "#777",
  },
  quickActions: {
    backgroundColor: WhiteVar,
    flexDirection: "row",
    width: "85%",
    marginVertical: 20,
    gap: 7.5,
  },
  actionButton: {
    flex: 1,
    backgroundColor: GreenVar,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  actionText: {
    color: WhiteVar,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  quickLinks: {
    width: "85%",
    backgroundColor: "snow",
    marginTop: 10,
    borderRadius: 12,
    padding: 16,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "snow",
    marginTop: 10,
    borderRadius: 12,
  },
  linkButton: {
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    fontSize: 13,
    color: "#333",
  },
  nutritionBlock: {
    width: "85%",
    backgroundColor: "snow",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center", // 👈 wykres wyśrodkowany
  },

  chartWrapper: {
    backgroundColor: "snow",
    alignItems: "center", // 👈 dodatkowe wyśrodkowanie
    justifyContent: "center",
    width: "100%",
  },

  shadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
