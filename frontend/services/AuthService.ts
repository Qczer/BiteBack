// services/AuthService.ts
import * as SecureStore from "expo-secure-store";

export async function saveItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

export async function removeItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export const getNotificationsCount = async (): Promise<number> => {
  const raw = await getItem("notificationsCount");
  return raw ? parseInt(raw, 10) : 3;
};
