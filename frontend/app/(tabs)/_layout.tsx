import FontAwesome from "@expo/vector-icons/FontAwesome";
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
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="VirtualFridgeScreen"
        options={{
          title: "Fridge",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="refresh" color={color} />
        }}
      />
    </Tabs>
  );
}
