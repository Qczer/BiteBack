import React from "react";
import { useCopilot } from "react-native-copilot";

const EmptyStepNumber: React.FC = () => {
  const { currentStepNumber } = useCopilot();

  return <></>;
};

export default EmptyStepNumber;
