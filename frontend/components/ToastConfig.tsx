import { BaseToast, ErrorToast } from "react-native-toast-message";
import {GreenVar} from "@/assets/colors/colors";

const COLORS = {
  errorRed: "#d32f2f",
  infoBlue: "#0288D1",
  background: "#fff",
  textMain: "#333",
  textLight: "#666",
};

const baseStyle = {
  backgroundColor: COLORS.background,
  borderLeftWidth: 6,
  borderRadius: 12,
  height: 70,
  width: "90%",
  elevation: 6,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  marginTop: 10,
};

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        ...baseStyle,
        borderLeftColor: GreenVar
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: GreenVar,
      }}
      text2Style={{
        fontSize: 14,
        color: COLORS.textMain,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        ...baseStyle,
        borderLeftColor: COLORS.errorRed,
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.errorRed,
      }}
      text2Style={{
        fontSize: 14,
        color: COLORS.textMain,
        fontWeight: "400",
      }}
    />
  ),
  info: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        ...baseStyle,
        borderLeftColor: COLORS.infoBlue,
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.infoBlue,
      }}
      text2Style={{
        fontSize: 14,
        color: COLORS.textMain,
        fontWeight: "400",
      }}
    />
  ),
};

export default toastConfig;
