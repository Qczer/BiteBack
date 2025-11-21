// services/AuthService.ts
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function setItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS !== "web")
    return await SecureStore.getItemAsync(key);
  
  return null;
}

export async function removeItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export async function getToken(): Promise<string | null> {
  return await getItem("token");
}

export async function setToken(token: string) {
  await setItem("token", token);
}

export const getNotificationsCount = async (): Promise<number> => {
  const raw = await getItem("notificationsCount");
  return raw ? parseInt(raw, 10) : 0;
};
export const getCurrencyCount = async (): Promise<number> => {
  const raw = await getItem("currencyCount");
  return raw ? parseInt(raw, 10) : 0;
};

export const handleLogout = async () => {
  try {
    removeItem("userEmail");
    removeItem("userNickname");

    // router.canGoBack(false);
    // router.dismissAll();
    router.replace("/(auth)/LoginScreen");
  } catch (error) {
    console.error("Error clearing SecureStore:", error);
  }
};
