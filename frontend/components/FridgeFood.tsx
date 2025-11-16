import { GreenVar } from "@/assets/colors/colors";
import Food from "@/classes/Food";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface FridgeFoodProps {
  food: Food
}

export default function FridgeFood({ food }: FridgeFoodProps) {
  return (
    <View style={{ width: '17.5%', backgroundColor: 'transparent'}}>
      {food.iconSrc ?
        (
          <Image source={food.iconSrc} style={{ maxWidth: 100, maxHeight: 100 }} />
        ) : (
          <Text style={{fontSize: 28}}>{food.name}</Text>
        )
      }
      <Text style={styles.amount}>{food.amount}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  amount: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: GreenVar,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    color: '#fff'
  }
})