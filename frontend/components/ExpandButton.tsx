import { GreenVar } from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface ListButtonProps {
  direction?: 'up' | 'down';
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  absolutePositioning?: boolean;
}

export default function ListButton({ direction, onPress, onPressIn, onPressOut, absolutePositioning = true }: ListButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={absolutePositioning && styles.listButton}
    >
      <Ionicons name={direction ? `chevron-${direction}` : 'list'} size={24} color={GreenVar} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  listButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10
  },
})