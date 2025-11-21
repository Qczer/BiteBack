import { auth } from "@/api/endpoints/users";
import { getItem, getToken } from "@/services/Storage";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";

export default function AuthLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      const token = await getToken();
      const hasSeen = await getItem("hasSeenWelcomeScreen");
      const res = await auth(token ?? "");

      if (res.success)
        router.replace("/(tabs)/HomeScreen");
      else if (hasSeen === "true")
        setInitialRoute("LoginScreen");
      else
        setInitialRoute("WelcomeScreen");
    };
    loadState();
  }, []);

  if (!initialRoute)
    return null; // Splash/Loader

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
