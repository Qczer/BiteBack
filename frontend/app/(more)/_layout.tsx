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
          title: "Food Points Map",
        }}
      />
      <Stack.Screen
        name="AddPointScreen"
        options={{
          title: "Add Your Point",
        }}
      />
      <Stack.Screen
        name="ShoppingListScreen"
        options={{
          title: "Shopping list",
        }}
      />
      <Stack.Screen
        name="FeedbackScreen"
        options={{
          title: "Feedback",
        }}
      />
      <Stack.Screen
        name="ReportBugScreen"
        options={{
          title: "Report a bug",
        }}
      />
    </Stack>
  );
}
