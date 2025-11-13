import Food from "@/classes/Food";
import { StyleSheet, Text, View } from "react-native";

interface FoodComponentProps {
    food: Food;
}

export default function FoodComponent({ food }: Readonly<FoodComponentProps>) {
    return (
        <View style={styles.foodComponent}>
            <Text style={styles.name}>{food.name}</Text>
            <Text style={styles.amount}>{food.amount} {food.unit}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    foodComponent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    name: {
        fontSize: 20
    },
    amount: {
        fontSize: 16
    },
})