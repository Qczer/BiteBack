import { Dimensions, StyleSheet } from "react-native";

import { WhiteVar } from "@/assets/colors/colors";
import { Text, View } from "@/components/Themed";
import { useCallback, useState } from "react";

import { getFridge } from "@/api/endpoints/fridge";
import ExpandButton from "@/components/ExpandButton";
import FoodFiltersList from "@/components/FoodFiltersList";
import FoodList from "@/components/FoodList";
import Fridge from "@/components/Fridge";
import HeaderBar from "@/components/HeaderBar";
import SearchInput from "@/components/SearchInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import Food, { FoodCategory } from "@/types/Food";
import FoodFilter from "@/types/FoodFilter";
import { useFocusEffect } from "expo-router";
import Modal from "react-native-modal";

const allFoodCategorys = Object.keys(FoodCategory).filter((key) =>
  isNaN(Number(key))
) as (keyof typeof FoodCategory)[];

export default function VirtualFridgeScreen() {
  const { userId } = useUser();
  const [userFood, setUserFood] = useState<Food[]>([]);

  const [foodFilters, setFoodFilters] = useState<FoodFilter[]>(
    allFoodCategorys.map((typeName) => ({
      FoodCategory: FoodCategory[typeName],
      active: false,
    }))
  );

  useFocusEffect(
    useCallback(() => {
      // Ten kod wykonuje sie gdy wejdziesz na ekran
      const fetchData = async () => {
        const res = await getFridge(userId);
        if (res?.data) 
          setUserFood(res.data.fridge);
      };

      fetchData();

      return () => {
        // Opcjonalnie: gdy WYJDZIESZ z ekranu (stracisz focus)
      };
    }, [])
  );

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
    <View style={styles.container}>
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
          <Text style={styles.title}>{t("screens.fridge.headerTitle")}</Text>
          <ExpandButton
            onPressIn={() => setExpanded(true)}
            absolutePositioning={false}
            size={28}
          />
        </View>
        <SearchInput />
        <FoodFiltersList filters={foodFilters} setFilters={setFoodFilters} />
        <Fridge
          food={userFood}
          addStyles={{ height: height * 0.55 }}
          filters={foodFilters}
        />
      </View>
    </View>
  );
}

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
