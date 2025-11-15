import { StyleSheet, View } from "react-native";
import FilterButton from "./FilterButton";
import { Dispatch, SetStateAction, useState } from "react";
import Filter from "@/classes/Filter";

interface FiltersListProps {
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
}

export default function FiltersList({ filters, setFilters }: FiltersListProps) {
  const [allFilters, setAllFilters] = useState<boolean>(true);

  const toggleFilter = (name: string) => {
    setFilters((prev) => {
      const updated = prev.map((f) =>
        f.name === name ? { ...f, active: !f.active } : f
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
    <View style={styles.filters}>
      <FilterButton
        text="ALL"
        active={allFilters}
        disabled={allFilters}
        onPress={toggleAll}
      />
      {filters.map(({ name, active }) => {
        return (
          <FilterButton
            key={name}
            text={name.toUpperCase()}
            active={active}
            onPress={() => toggleFilter(name)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    gap: 10,
    backgroundColor: "transparent",
    padding: 2,
  },
});
