import SplashScreen from "@/components/SplashScreen";
import { useUser } from "@/contexts/UserContext";
import { getItem } from "@/services/Storage";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";

export default function AuthLayout() {
  const { userId } = useUser();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      const hasSeen = await getItem("hasSeenWelcomeScreen");
      if (userId) {
        router.replace("/(tabs)/HomeScreen");
        return;
      }

      if (hasSeen === "true") setInitialRoute("LoginScreen");
      else setInitialRoute("WelcomeScreen");
    };
    loadState();
  }, []);

  if (!initialRoute)
    // TODO:
    return <SplashScreen />; // Splash/Loader

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="WelcomeScreen" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
    </Stack>
  );
}
