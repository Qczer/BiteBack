import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import t from "@/locales/i18n";
import { GreenVar } from "@/assets/colors/colors";

const COLORS = {
  primary: "#547067",
  active: GreenVar,
  inactive: "#999999",
  background: "#ffffff",
};

const TabIcon = ({ focused, name, size }: { focused: boolean; name: any; size?: number; }) => (
  <View style={{ alignItems: "center", justifyContent: "center", top: Platform.OS === "ios" ? 5 : 0 }}>
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={size ?? 28}
      color={focused ? COLORS.active : COLORS.inactive}
    />
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowLabel: false,
        tabBarStyle: {
          elevation: 5,
          backgroundColor: COLORS.background,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          borderWidth: 0,
          // Cień na iOS:
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          paddingTop: 10,
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: t("screens.home.title"),
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              name="home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="VirtualFridgeScreen"
        options={{
          title: t("screens.fridge.title"),
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              name="snow"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ScanScreen"
        options={{
          title: t("screens.scan.title"),
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: Platform.OS === "ios" ? -15 : -20,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: focused ? COLORS.active : COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
                elevation: 10,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
              }}
            >
              <Ionicons name="scan" size={30} color="#fff" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: t("screens.profile.title"),
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              name="person"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MoreScreen"
        options={{
          title: t("screens.more.title"),
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              name="settings"
            />
          ),
        }}
      />
    </Tabs>
  );
}