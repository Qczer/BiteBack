import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

// import { useColorScheme } from "@/components/useColorScheme";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(
  props: Readonly<{
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
  }>
) {
  return (
    <FontAwesome
      size={28}
      style={{ marginBottom: -3, alignSelf: "center" }}
      {...props}
    />
  );
}

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#547067ff",
        tabBarStyle: {
          backgroundColor: "#eeece8",
        },
        tabBarShowLabel: true,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color}></Ionicons>
          ),
        }}
      />
      <Tabs.Screen
        name="VirtualFridgeScreen"
        options={{
          title: "Fridge",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="snowflake-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ScanScreen"
        options={{
          title: "Scan",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="scan" size={28} color={color}></Ionicons>
          ),
        }}
      />
      <Tabs.Screen
        name="MapsScreen"
        options={{
          title: "Maps",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="map-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
