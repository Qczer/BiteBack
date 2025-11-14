import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface RealButtonProps {
  text: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export default function RealButton({
  text,
  onPress,
  onPressIn,
  onPressOut,
}: Readonly<RealButtonProps>) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.buttonContainer}>
      <View
        style={[styles.buttonShadow, pressed && styles.pressedButtonShadow]}
      >
        <Pressable
          onPress={() => onPress?.()}
          onPressIn={() => {
            setPressed(true);
            onPressIn?.();
          }}
          onPressOut={() => {
            setPressed(false);
            onPressOut?.();
          }}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressedButton,
          ]}
        >
          <Text
            style={{ fontWeight: "bold", color: GreenVar, textAlign: "center" }}
          >
            {text}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "80%",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderColor: GreenVar,
    borderWidth: 3,
    backgroundColor: WhiteVar,
    alignItems: "center",
    marginRight: 2,
  },
  pressedButton: {
    backgroundColor: "#c5c1bb",
  },
  buttonContainer: {
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonShadow: {
    paddingBottom: 4,
    backgroundColor: GreenVar,
    borderRadius: 20,
  },
  pressedButtonShadow: {
    marginTop: 2,
    paddingBottom: 2,
  },
});
