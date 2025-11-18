// services/AuthService.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function saveItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS !== "web") {
    return await SecureStore.getItemAsync(key);
  }
  return null;
}

export async function removeItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export const getNotificationsCount = async (): Promise<number> => {
  const raw = await getItem("notificationsCount");
  return raw ? parseInt(raw, 10) : 0;
};
export const getCurrencyCount = async (): Promise<number> => {
  const raw = await getItem("currencyCount");
  return raw ? parseInt(raw, 10) : 0;
};
