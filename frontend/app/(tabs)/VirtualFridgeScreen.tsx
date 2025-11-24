import { Dimensions, StyleSheet, Text, View } from "react-native";

import { WhiteVar } from "@/assets/colors/colors";
import { useCallback, useEffect, useRef, useState } from "react";

import { getFridge } from "@/api/endpoints/fridge";
import ExpandButton from "@/components/ExpandButton";
import FoodFiltersList from "@/components/FoodFiltersList";
import FoodList from "@/components/FoodList";
import Fridge from "@/components/Fridge";
import HeaderBar from "@/components/HeaderBar";
import SearchInput from "@/components/SearchInput";
import { withCopilotProvider } from "@/components/WithCopilotProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import translate from "@/locales/i18n";
import { FoodCategory } from "@/types/Food";
import FoodFilter from "@/types/FoodFilter";
import { useFocusEffect } from "expo-router";
import React from "react";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CopilotView = walkthroughable(View);
const CopilotText = walkthroughable(Text);

const allFoodCategorys = Object.keys(FoodCategory).filter((key) =>
  isNaN(Number(key))
) as (keyof typeof FoodCategory)[];

function VirtualFridgeScreen() {
  const insets = useSafeAreaInsets();
  const copilot = (key: string) => translate("copilot." + key);

  const { userID, userFood, setUserFood } = useUser();
  const [refresh, setRefresh] = useState(false);
  const { start, totalStepsNumber } = useCopilot();
  const hasStartedTutorial = useRef(false);

  const [foodFilters, setFoodFilters] = useState<FoodFilter[]>(
    allFoodCategorys.map((typeName) => ({
      FoodCategory: FoodCategory[typeName],
      active: false,
    }))
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const checkTutorialFlag = async () => {
  //       try {
  //         const hasSeen = await AsyncStorage.getItem("@hasSeenHomeTutorial");
  //         if (!hasSeen && !hasStartedTutorial.current) {
  //           // Odpalamy tutorial z opóźnieniem
  //           const timer = setTimeout(() => {
  //             hasStartedTutorial.current = true;
  //             start();
  //             AsyncStorage.setItem("@hasSeenHomeTutorial", "true");
  //           }, 0);

  //           return () => clearTimeout(timer);
  //         }
  //       } catch (error) {
  //         console.error("Error checking tutorial flag.", error);
  //       }
  //     };

  //     // ma byc !dev jesli production ready
  //     if (__DEV__) {
  //       checkTutorialFlag();
  //     }
  //   }, [start])
  // );
  useFocusEffect(
    React.useCallback(() => {
      if (!hasStartedTutorial.current) {
        const timer = setTimeout(() => {
          hasStartedTutorial.current = true;
          console.log("Starting copilot with", totalStepsNumber, "steps.");
          start();
        }, 250);

        return () => clearTimeout(timer);
      }
    }, [start])
  );

  useFocusEffect(
    useCallback(() => {
      // Ten kod wykonuje sie gdy wejdziesz na ekran
      const fetchData = async () => {
        const res = await getFridge(userID);
        if (res?.data) setUserFood(res.data.fridge);
      };

      fetchData();
    }, [userID, setUserFood])
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await getFridge(userID);
      if (res?.data) setUserFood(res.data.fridge);
    };

    fetchData();
    setRefresh(false);
  }, [refresh]);

  const { t } = useLanguage();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [nameFilter, setNameFilter] = useState<string>("");

  const filteredFoodList = userFood
    .filter((elem) =>
      elem.name.toUpperCase().includes(nameFilter.toUpperCase())
    )
    .filter(
      (food) =>
        foodFilters.some((f) => f.active && f.FoodCategory === food.category) ||
        !foodFilters.some((f) => f.active)
    );

  return (
    <View style={[styles.container, { paddingBottom: 60 + insets.bottom }]}>
      <HeaderBar />
      {/* MODAL */}
      <Modal
        isVisible={expanded}
        onBackdropPress={() => setExpanded((curr) => !curr)}
        statusBarTranslucent={false}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        animationInTiming={200}
        animationOutTiming={200}
        hasBackdrop={false}
        style={styles.modal}
      >
        <ExpandButton direction="up" onPressIn={() => setExpanded(false)} />
        <SearchInput addStyle={{ width: "90%" }} onInput={setNameFilter} />
        <FoodFiltersList filters={foodFilters} setFilters={setFoodFilters} />
        <FoodList foodList={filteredFoodList} />
      </Modal>

      {/* REST */}
      <View style={styles.mainContainer}>
        <View style={styles.topBar}>
          <CopilotStep order={3} name="thanks3" text={copilot("fridgeStep3")}>
            <CopilotText style={styles.title}>
              {t("screens.fridge.headerTitle")}
            </CopilotText>
          </CopilotStep>
          {/* <Text >}</Text> */}
          <CopilotStep order={2} name="thanks" text={copilot("fridgeStep2")}>
            <CopilotView>
              <ExpandButton
                onPressIn={() => setExpanded(true)}
                absolutePositioning={false}
                size={28}
              />
            </CopilotView>
          </CopilotStep>
        </View>
        <SearchInput />
        <FoodFiltersList filters={foodFilters} setFilters={setFoodFilters} />
        <CopilotStep order={1} name="thanks2" text={copilot("fridgeStep1")}>
          <CopilotView>
            <Fridge
              food={userFood}
              addStyles={{ height: height * 0.55 }}
              filters={foodFilters}
              refresh={() => setRefresh(true)}
            />
          </CopilotView>
        </CopilotStep>
      </View>
    </View>
  );
}

export default withCopilotProvider(VirtualFridgeScreen);

const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: WhiteVar,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    backgroundColor: "transparent",
    alignItems: "center",
    padding: 20,
  },
  topBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0F3624",
    alignSelf: "flex-start",
  },

  modal: {
    margin: 0,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    backgroundColor: WhiteVar,
  },
});
