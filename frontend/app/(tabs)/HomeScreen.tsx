import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import HeaderBar from "@/components/HeaderBar";
import { Text, View } from "@/components/Themed";
import { getItem } from "@/services/Storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
export default function HomeScreen() {
  const [nickname, setNickname] = useState<string | null>(null);

  const pieData = [
    {
      name: "Meat",
      population: 5,
      color: "#b22222",
      legendFontColor: "#333",
      legendFontSize: 11,
    },
    {
      name: "Dairy",
      population: 3,
      color: "#87ceeb",
      legendFontColor: "#333",
      legendFontSize: 11,
    },
    {
      name: "Fruit",
      population: 7,
      color: GreenVar,
      legendFontColor: "#333",
      legendFontSize: 11,
    },
    {
      name: "Vegetable",
      population: 6,
      color: "#228b22",
      legendFontColor: "#333",
      legendFontSize: 11,
    },
    {
      name: "Snacks",
      population: 4,
      color: "#ffd700",
      legendFontColor: "#333",
      legendFontSize: 11,
    },
    {
      name: "Fastfood",
      population: 2,
      color: "#ff8c00",
      legendFontColor: "#333",
      legendFontSize: 11,
    },
    {
      name: "Other",
      population: 3,
      color: "#808080",
      legendFontColor: "#333",
      legendFontSize: 11,
    },
  ];

  useEffect(() => {
    const loadNickname = async () => {
      const nickname = await getItem("userNickname");
      setNickname(nickname);
    };
    loadNickname();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderBar />

      {/* LOGO + POWITANIE */}
      <View style={styles.headerBlock}>
        <Text style={styles.welcomeText}>Hello {nickname} 👋</Text>
        <Text style={styles.subText}>Ready to manage your fridge?</Text>
      </View>

      {/* FRIDGE SUMMARY */}
      <View style={[styles.fridgeSummary, styles.shadow]}>
        <Text style={styles.sectionTitle}>Fridge Overview</Text>
        <View style={styles.summaryRow}>
          <Feather name="box" size={20} color={GreenVar} />
          <Text style={styles.summaryText}>12 items stored</Text>
        </View>
        <View style={styles.summaryRow}>
          <Feather name="alert-circle" size={20} color="orange" />
          <Text style={styles.summaryText}>2 expiring today</Text>
        </View>
      </View>

      {/* Nutrition Overview */}
      <View style={[styles.nutritionBlock, styles.shadow]}>
        <Text style={styles.sectionTitle}>Nutrition Overview</Text>

        {/* Wyśrodkowany wykres */}
        <View style={styles.chartWrapper}>
          <PieChart
            data={pieData}
            width={screenWidth * 0.8} // 👈 trochę mniejszy, żeby legenda miała miejsce
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

        {/* Własna legenda pod wykresem
        <View style={styles.legendContainer}>
          {pieData.map((item, index) => (
            <View key={index} style={styles.legendRow}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>
                {item.name} - {item.population}
              </Text>
            </View>
          ))}
        </View> */}
      </View>

      {/* RECENTLY ADDED */}
      <View style={[styles.recentBlock, styles.shadow]}>
        <Text style={styles.sectionTitle}>Recently Added</Text>
        <View style={styles.recentItem}>
          <Text style={styles.recentName}>Milk</Text>
          <Text style={styles.recentMeta}>1L • 2025-11-24</Text>
        </View>
        <View style={styles.recentItem}>
          <Text style={styles.recentName}>Tomatoes</Text>
          <Text style={styles.recentMeta}>500g • 2025-11-26</Text>
        </View>
        <View style={styles.recentItem}>
          <Text style={styles.recentName}>Yogurt</Text>
          <Text style={styles.recentMeta}>2x • 2025-11-28</Text>
        </View>
      </View>

      {/* SZYBKIE AKCJE */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="plus-circle" size={20} color={WhiteVar} />
          <Text style={styles.actionText}>Scan Food</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          {/* TODO */}
          <Feather
            name="book-open"
            size={20}
            color={WhiteVar}
            onPress={() => router.push("/(more)/SettingsScreen")}
          />
          <Text style={styles.actionText}>Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/ProfileScreen")}
        >
          <Feather name="user" size={20} color={WhiteVar} />
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* QUICK LINKS */}
      <View style={[styles.quickLinks, styles.shadow]}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <View style={styles.linkRow}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/(more)/SettingsScreen")}
          >
            <Feather name="settings" size={18} color={GreenVar} />
            <Text style={styles.linkText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/(more)/FeedbackScreen")}
          >
            <Feather name="message-square" size={18} color={GreenVar} />
            <Text style={styles.linkText}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/(more)/ReportBugScreen")}
          >
            <Feather name="alert-triangle" size={18} color={GreenVar} />
            <Text style={styles.linkText}>Report Bug</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WhiteVar,
    alignItems: "center",
    paddingBottom: 40,
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
    fontSize: 15,
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
    justifyContent: "space-around",
    width: "90%",
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: GreenVar,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: WhiteVar,
    fontSize: 14,
    fontWeight: "500",
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
