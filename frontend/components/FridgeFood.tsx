import { GreenVar } from "@/assets/colors/colors";
import Food from "@/classes/Food";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface FridgeFoodProps {
  food: Food
}

export default function FridgeFood({ food }: FridgeFoodProps) {
  const isLocalImage = typeof food.icon === 'number'; // require return a number
  const isRemoteImage = typeof food.icon === 'string' && food.icon.startsWith('http');

  const isImage = isLocalImage || isRemoteImage;

  return (
    <View style={{ width: '17.5%', backgroundColor: 'transparent'}}>
      {isImage ?
        (
          <Image source={isLocalImage ? food.icon : { uri: food.icon }} style={{ width: 100, height: 100, resizeMode: 'contain' }} />
        ) : (
          <Text style={{fontSize: 28}}>{food.icon}</Text>
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