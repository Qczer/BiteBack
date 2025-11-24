import React from "react";
import { StyleSheet, View } from "react-native";
import { useCopilot } from "react-native-copilot";

const TourOverlay = () => {
  const { currentStep } = useCopilot();

  // Overlay pojawia się tylko gdy jest aktywny krok
  if (!currentStep) return null;

  return <View style={styles.overlay} pointerEvents="auto" />;
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent", // możesz dać np. 'rgba(0,0,0,0.2)' dla efektu maski
    zIndex: 9999, // musi być wyżej niż UI pod spodem
  },
});

export default TourOverlay;
