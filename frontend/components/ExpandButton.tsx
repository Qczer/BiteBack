import { GreenVar } from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface ExpandButtonProps {
  direction: 'up' | 'down';
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export default function ExpandButton({ direction, onPress, onPressIn, onPressOut }: ExpandButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.floatingButton}
    >
      <Ionicons name={`chevron-${direction}`} size={24} color={GreenVar} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10
  },
})