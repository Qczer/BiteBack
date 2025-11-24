import translate from "@/locales/i18n";
import React from "react";
import { CopilotProvider } from "react-native-copilot";
import Tooltip from "../components/CustomCopilotTooltip";
import EmptyStepNumber from "../components/EmptyStepNumber";

export function withCopilotProvider<P>(WrappedComponent: any): React.FC<P> {
  const copilot = (key: string): string => translate("copilot." + key);

  return function WithCopilot(props: P) {
    return (
      <CopilotProvider
        tooltipComponent={Tooltip}
        arrowColor="transparent"
        stepNumberComponent={EmptyStepNumber}
        overlay="view"
        tooltipStyle={{ backgroundColor: "transparent" }}
        backdropColor="rgba(23, 23, 23, 0.85)"
        labels={{
          previous: copilot("previous"),
          next: copilot("next"),
          skip: copilot("skip"),
          finish: copilot("finish"),
        }}
      >
        <WrappedComponent {...props} />
      </CopilotProvider>
    );
  };
}
