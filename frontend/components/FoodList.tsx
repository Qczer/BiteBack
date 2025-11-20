import Food from "@/types/Food";
import { ScrollView, StyleSheet } from "react-native";
import FoodComponent from "./FoodComponent";
import { WhiteVar } from "@/assets/colors/colors";

interface FoodListProps {
  foodList: Food[];
}

export default function FoodList({ foodList }: FoodListProps) {
  return (
    <ScrollView contentContainerStyle={styles.modalItemsList}>
      {foodList.map((food, i) => {
        return <FoodComponent key={i+1} food={food} />
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  modalItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: WhiteVar
  }
})