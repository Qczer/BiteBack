import t from "@/locales/i18n";
import { Stack } from "expo-router";
import React from "react";
import {WhiteVar} from "@/assets/colors/colors";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "left",
        headerTintColor: "black",
        headerStyle: { backgroundColor: WhiteVar }
      }}
    >
      <Stack.Screen
        name="MapsScreen"
        options={{
          title: t("screens.maps.findPoint")
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
        name="PublicProfileScreen"
        options={{
          title: "User profile",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="RecipesScreen"
        options={{
          title: "Recipe",
        }}
      />
      <Stack.Screen
        name="PointSentScreen"
        options={{
          title: "Point Sent",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
