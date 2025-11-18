import { ScrollView, StyleSheet, View } from "react-native";
import FilterButton from "./FilterButton";
import { Dispatch, SetStateAction, useState } from "react";
import FoodFilter from "@/classes/FoodFilter";
import { FoodType } from "@/classes/Food";
import { useLanguage } from "@/contexts/LanguageContext";

interface FiltersListProps {
  filters: FoodFilter[];
  setFilters: Dispatch<SetStateAction<FoodFilter[]>>;
}

export default function FoodFiltersList({ filters, setFilters }: FiltersListProps) {
  const [allFilters, setAllFilters] = useState<boolean>(true);
  const { t } = useLanguage();

  const toggleFilter = (type: FoodType) => {
    setFilters((prev) => {
      const updated = prev.map((f) =>
        f.foodType === type ? { ...f, active: !f.active } : f
      );

      const anyActive = updated.some((f) => f.active);
      setAllFilters(!anyActive);

      return updated;
    });
  };

  const toggleAll = () => {
    setAllFilters(true);
    if (!allFilters)
      setFilters((prev) => prev.map((f) => ({ ...f, active: false })));
  };

  return (
    <View style={styles.viewStyle}>
      <ScrollView 
        contentContainerStyle={styles.filters}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 50 }}
      >
        <FilterButton
          text={t("filters.all").toUpperCase()}
          active={allFilters}
          disabled={allFilters}
          onPress={toggleAll}
        />
        {filters.map(({ foodType, active }) => {
          return (
            <FilterButton
              key={foodType}
              text={t("filters." + FoodType[foodType].toString())}
              active={active}
              onPress={() => toggleFilter(foodType)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    margin: 0,
    padding: 0,
  },
  filters: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    gap: 7.5,
    backgroundColor: "transparent",
    padding: 2,
    alignItems: 'center',
  },
});
