import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(
  props: Readonly<{
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
  }>
) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="WelcomeScreen"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LoginScreen"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        options={{
          title: "Register",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
