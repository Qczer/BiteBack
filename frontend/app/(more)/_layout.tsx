import t from "@/locales/i18n";
import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="MapsScreen"
        options={{
          title: t("cards.maps.headerTitle"),
        }}
      />
      <Stack.Screen
        name="AddPointScreen"
        options={{
          title: t("cards.addPoint.headerTitle"),
        }}
      />
      <Stack.Screen
        name="ShoppingListsScreen"
        options={{
          title: t("cards.shoppingLists.headerTitle"),
        }}
      />
      <Stack.Screen
        name="FeedbackScreen"
        options={{
          title: t("cards.feedback.headerTitle"),
        }}
      />
      <Stack.Screen
        name="ReportBugScreen"
        options={{
          title: t("cards.reportABug.headerTitle"),
        }}
      />
      <Stack.Screen
        name="SettingsScreen"
        options={{
          title: t("cards.settings.headerTitle"),
        }}
      />
      <Stack.Screen
        name="FriendsScreen"
        options={{
          title: "Social hub",
        }}
      />
    </Stack>
  );
}
