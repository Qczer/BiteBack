import React, { useEffect, useRef } from "react";
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import type { TooltipProps } from "react-native-copilot";
import { useCopilot } from "react-native-copilot";
import CustomStepNumber from "./CustomStepNumber";

const imageMap: Record<string, number> = {
  thanks: require("@/assets/images/people/thanks.png"),
};

export const Tooltip = ({ labels }: TooltipProps) => {
  const { goToNext, goToPrev, stop, currentStep, isFirstStep, isLastStep } =
    useCopilot();

  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.fadeIn(800);
    }
  }, [currentStep?.name]);

  const imageSource =
    (currentStep?.name && imageMap[currentStep.name]) ||
    require("@/assets/images/people/thanks.png");

  return (
    <Animatable.View ref={animationRef} useNativeDriver style={styles.wrapper}>
      <View style={styles.tooltipContainer}>
        <CustomStepNumber />
        <View style={styles.row}>
          <Image source={imageSource} style={styles.image} />
          <Text testID="stepDescription" style={styles.tooltipText}>
            {currentStep?.text ?? "⏳ Ładowanie kroku..."}
          </Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        {!isLastStep && <TooltipButton onPress={stop} label={labels.skip!} />}
        {!isFirstStep && (
          <TooltipButton onPress={goToPrev} label={labels.previous!} />
        )}
        {!isLastStep ? (
          <TooltipButton onPress={goToNext} label={labels.next!} />
        ) : (
          <TooltipButton onPress={stop} label={labels.finish!} />
        )}
      </View>
    </Animatable.View>
  );
};

const TooltipButton = ({
  onPress,
  label,
}: {
  onPress: (event: GestureResponderEvent) => void;
  label: string;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

export default Tooltip;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbbb93",
    maxWidth: "100%",
    maxHeight: 280,
    alignSelf: "center",
  },
  tooltipContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "35%",
    height: 120,
    resizeMode: "contain",
    marginRight: 10,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "500",
    flexShrink: 1,
    width: "65%",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  button: {
    backgroundColor: "#333",
    borderColor: "#cbbb93",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#cbbb93",
    fontWeight: "bold",
    fontSize: 13,
  },
});
