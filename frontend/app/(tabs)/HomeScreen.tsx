import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import HeaderBar from "@/components/HeaderBar";
import { Text, View } from "@/components/Themed";
import { useUser } from "@/contexts/UserContext";
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

interface Category {
  name: string;
  population: number;
  color: string,
  legendFontColor: string,
  legendFontSize: number,
}

const screenWidth = Dimensions.get("window").width;
export default function HomeScreen() {
  const [nickname, setNickname] = useState<string | null>(null);
  const { userFood } = useUser();
  const [pieData, setPieData] = useState<Category[]>();

  const categoryColors: Record<string, string> = {
    meat: "#b22222",
    dairy: "#87ceeb",
    fruit: "#228b22",
    vegetable: "#228b22",
    snacks: "#ffd700",
    fastfood: "#ff8c00",
    other: "#808080",
  };
  
  const fridgeToPieData = () => {
    let categories: Record<string, number> = {};

    userFood.forEach(food => {
      if(food.category)
        categories[food.category] = (categories[food.category] || 0) + 1;
    })

    const pieData = Object.keys(categories).map(key => {
      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        population: categories[key],
        color: categoryColors[key] || "#ccc",
        legendFontColor: "#333",
        legendFontSize: 11,
      };
    });

    setPieData(pieData);
  }

  useEffect(() => {
    const loadNickname = async () => {
      const nickname = await getItem("userNickname");
      setNickname(nickname);
    };
    loadNickname();

    fridgeToPieData()
  }, []);

  const todayStr = new Date().toDateString();

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
          <Text style={styles.summaryText}>{userFood.length} items stored</Text>
        </View>
        <View style={styles.summaryRow}>
          <Feather name="alert-circle" size={20} color="orange" />
          <Text style={styles.summaryText}>{userFood.filter(food => new Date(food.expDate ?? '').toDateString() == todayStr).length} expiring today</Text>
        </View>
      </View>

      {/* Nutrition Overview */}
      <View style={[styles.nutritionBlock, styles.shadow]}>
        <Text style={styles.sectionTitle}>Nutrition Overview</Text>

        {/* Wyśrodkowany wykres */}
        <View style={styles.chartWrapper}>
          <PieChart
            data={pieData ?? []}
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
        {
          userFood.slice(-3).reverse().map((item, index) => (
            <View key={index+1} style={styles.recentItem}>
              <Text style={styles.recentName}>{item.name}</Text>
              <Text style={styles.recentMeta}>{item.amount + (item.unit ?? '')} • {item.expDate ? new Date(item.expDate).toLocaleDateString() : ''} </Text>
            </View>
          ))
        }
      </View>

      {/* SZYBKIE AKCJE */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/ScanScreen")}
        >
          <Feather name="plus-circle" size={20} color={WhiteVar} />
          <Text style={styles.actionText}>Scan Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {}}
        >
          {/* TODO */}
          <Feather
            name="book-open"
            size={20}
            color={WhiteVar}
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
    width: "85%",
    marginVertical: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: GreenVar,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6
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
