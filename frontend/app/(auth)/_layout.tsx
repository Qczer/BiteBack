import { getItem } from "@/services/AuthService";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";

export default function AuthLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      const token = await getItem("isLoggedIn");
      const hasSeen = await getItem("hasSeenWelcomeScreen");

      if (token === "true") {
        // zamiast kierować na pojedynczy ekran, kierujesz na cały stack (tabs)
        router.replace("/(tabs)/HomeScreen");
      } else if (hasSeen === "true") {
        setInitialRoute("LoginScreen");
      } else {
        setInitialRoute("WelcomeScreen");
      }
    };
    loadState();
  }, []);

  if (!initialRoute) {
    return null; // Splash/Loader
  }

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="WelcomeScreen" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="CreateNicknameScreen" />
    </Stack>
  );
}
