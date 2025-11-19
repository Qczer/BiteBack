import { ScrollView, StyleSheet, View } from "react-native";
import FilterButton from "./FilterButton";
import { Dispatch, SetStateAction, useState } from "react";
import FoodFilter from "@/classes/FoodFilter";
import { FoodCategory } from "@/classes/Food";
import { useLanguage } from "@/contexts/LanguageContext";

interface FiltersListProps {
  filters: FoodFilter[];
  setFilters: Dispatch<SetStateAction<FoodFilter[]>>;
}

export default function FoodFiltersList({ filters, setFilters }: FiltersListProps) {
  const [allFilters, setAllFilters] = useState<boolean>(true);
  const { t } = useLanguage();

  const toggleFilter = (type: FoodCategory) => {
    setFilters((prev) => {
      const updated = prev.map((f) =>
        f.FoodCategory === type ? { ...f, active: !f.active } : f
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

  function getFoodCategoryKey(value: FoodCategory): keyof typeof FoodCategory {
    return Object.keys(FoodCategory).find(
      (key) => FoodCategory[key as keyof typeof FoodCategory] === value
    )! as keyof typeof FoodCategory;
  }

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
        {filters.map(({ FoodCategory: category, active }) => {
          return (
            <FilterButton
              key={category}
              text={t("filters." + FoodCategory[getFoodCategoryKey(category)].toString())}
              active={active}
              onPress={() => toggleFilter(category)}
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
