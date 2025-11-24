import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import ShoppingList from "@/components/ShoppingList";
import toastConfig from "@/components/ToastConfig";
import { withCopilotProvider } from "@/components/WithCopilotProvider";
import translate from "@/locales/i18n";
import { getItem, setItem } from "@/services/Storage";
import Food from "@/types/Food";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { showToast } from "../(auth)/LoginScreen";
const CopilotView = walkthroughable(View);
const CopilotText = walkthroughable(Text);

const SHOPPING_LIST_KEY = "shoppingLists";

function ShoppingListsScreen() {
  const { start, totalStepsNumber } = useCopilot();
  const hasStartedTutorial = useRef(false);
  const tURL = "cards.shoppingLists.";

  const t = (key: string) => translate(tURL + key);
  const copilot = (key: string) => translate("copilot." + key);

  const { food, fromScan } = useLocalSearchParams();
  const [list, setList] = useState<Food[]>(
    food ? JSON.parse(food as string) : []
  );
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      const checkTutorialFlag = async () => {
        try {
          const hasSeen = await AsyncStorage.getItem(
            "@hasSeenShoppingListTutorial"
          );
          if (!hasSeen && !hasStartedTutorial.current) {
            // Odpalamy tutorial z opóźnieniem
            const timer = setTimeout(() => {
              hasStartedTutorial.current = true;
              start();
              AsyncStorage.setItem("@hasSeenShoppingListTutorial", "true");
            }, 0);

            return () => clearTimeout(timer);
          }
        } catch (error) {
          console.error("Error checking tutorial flag.", error);
        }
      };

      // ma byc !dev jesli production ready
      if (!__DEV__) {
        checkTutorialFlag();
      }
    }, [start])
  );

  useEffect(() => {
    if (fromScan) return;

    getItem(SHOPPING_LIST_KEY).then((data) => {
      if (data) {
        try {
          setList(JSON.parse(data));
        } catch (e) {
          console.error("Błąd parsowania danych", e);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!fromScan) setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
  }, [list]);

  const handleAddFoodToList = (newFoodItem: Food) => {
    setList((prev) => [...prev, newFoodItem]);
  };

  const handleRemoveFoodFromList = (newFoodItem: Food) => {
    setList((prev) => prev.filter((f: Food) => f !== newFoodItem));
  };

  const handleUpdateFood = (newFood: Food, foodIndex: number) => {
    setList((prev) =>
      prev.map((food, index) => (index === foodIndex ? newFood : food))
    );
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
      {/* LIST */}
      <CopilotStep order={1} name="explain1" text={copilot("listStep1")}>
        <CopilotView>
          {/* HEADER */}
          <View style={styles.headerBlock}>
            <View style={styles.headerRow}>
              <Ionicons name="cart-outline" size={24} color={GreenVar} />
              <Text style={styles.screenTitle}>{t("title")}</Text>
            </View>
            <Text style={styles.screenSubtitle}>{t("desc")}</Text>
          </View>
        </CopilotView>
      </CopilotStep>
      <ShoppingList
        list={list}
        onAdd={handleAddFoodToList}
        onRemove={handleRemoveFoodFromList}
        onUpdate={handleUpdateFood}
        clearList={() => {
          setList([]);
          if (fromScan) {
            router.replace("/(tabs)/VirtualFridgeScreen");
          }
        }}
        showToast={(key: string) => showToast(key)}
      />
      <Toast config={toastConfig} />
    </View>
  );
}

export default withCopilotProvider(ShoppingListsScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WhiteVar,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBlock: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 8,
  },
  screenTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: GreenVar,
  },
  screenSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
});
