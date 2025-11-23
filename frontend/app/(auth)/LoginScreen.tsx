import { login } from "@/api/endpoints/user";
import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import FormInput from "@/components/FormInput";
import RealButton from "@/components/RealButton";
import toastConfig from "@/components/ToastConfig";
import { useUser } from "@/contexts/UserContext";
import translate from "@/locales/i18n";
import { setToken as saveTokenToStorage } from "@/services/Storage";
import { Courgette_400Regular } from "@expo-google-fonts/courgette";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export const showToast = (message: string) => {
  Toast.show({
    type: "error",
    text1: message,
    position: "top",
    swipeable: true,
  });
};

export default function LoginScreen() {
  const { setToken } = useUser()

  const tURL = "screens.login.";
  const t = (key: string) => translate(tURL + key);

  const [fontsLoaded] = useFonts({
    Courgette_400Regular,
  });

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [allFilled, setAllFilled] = useState(false);

  const [emailAlertText, setEmailAlertText] = useState("");
  const [passwordAlertText, setPasswordAlertText] = useState("");

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    if (email.length === 0 && password.length === 0) return;

    const isEmailValid = emailRegex.test(email);
    setEmailAlertText(isEmailValid ? "" : "Email is not valid");

    const isPasswordValid = password.length > 0;
    setPasswordAlertText(isPasswordValid ? "" : "Password is not valid");

    setAllFilled(isEmailValid && isPasswordValid);
  };

  const handleLogin = async () => {
    if (!allFilled) {
      showToast("Please fill in all fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {

        await saveTokenToStorage(res.data);
        setToken(res.data);
        router.replace("/(tabs)/HomeScreen");
      }
      else
        showToast(`Error ${res.status}: ${res.message}`);
    } catch (error) {
      showToast("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerBlock}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: 100, height: 100, marginRight: 10 }}
              />
              <Text style={styles.headerText}>BiteBack</Text>
              <Text style={styles.welcomeBackText}>{t("welcomeBack")}</Text>
            </View>

            {/* FORM */}
            <View style={styles.formBlock}>
              <View style={styles.formBox}>
                <FormInput
                  placeholder={t("emailPlaceholder")}
                  leftIcon="mail-outline"
                  label={t("emailLabel")}
                  alertText={emailAlertText}
                  setVal={setEmail}
                />

                <FormInput
                  placeholder={t("passwordPlaceholder")}
                  leftIcon="lock-closed-outline"
                  rightIcon="eye-outline"
                  secure={true}
                  label={t("passwordLabel")}
                  alertText={passwordAlertText}
                  // showHelp={showPasswordHelp}
                  setVal={setPassword}
                />

                <Text style={styles.secondaryText}>{t("forgotPassword")}</Text>

                <Pressable
                  onPress={handleLogin}
                  disabled={loading}
                  style={[
                    styles.loginButton,
                    {
                      backgroundColor:
                        allFilled && !loading ? GreenVar : "gray",
                    },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color={WhiteVar} />
                  ) : (
                    <Text style={styles.buttonText}>{t("signIn")}</Text>
                  )}
                </Pressable>

                <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>
                    {translate("common.or").toUpperCase()}
                  </Text>
                  <View style={styles.line} />
                </View>
                <RealButton
                  text={t("createAccount")}
                  onPress={() => router.replace("/(auth)/RegisterScreen")}
                />
              </View>
            </View>

            {/* FOOTER */}
            <View style={styles.otherBlock}></View>
          </View>
        </ScrollView>
        <Toast config={toastConfig} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  headerBlock: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "snow",
    paddingVertical: 20,
  },
  formBlock: {
    flex: 5,
    width: "100%",
    backgroundColor: "snow",
    justifyContent: "center",
    paddingVertical: 20,
  },
  formBox: {
    width: width * 0.85,
    backgroundColor: WhiteVar,
    alignSelf: "center",
    justifyContent: "space-around",
    borderRadius: 20,
    padding: "5%",
    // cross-platform shadow
    elevation: 5, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  otherBlock: {
    height: "52%",
    position: "absolute",
    bottom: 0,
    zIndex: 0,
    backgroundColor: GreenVar,
    width: "100%",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  headerText: {
    fontFamily: "Courgette_400Regular",
    color: GreenVar,
    fontSize: 36,
  },
  welcomeBackText: {
    color: GreenVar,
    fontSize: 18,
    marginTop: 20,
  },
  secondaryText: {
    marginTop: 10,
    color: GreenVar,
    fontSize: 14,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    // shadow
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "bold",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: GreenVar,
    fontSize: 14,
    fontWeight: "500",
  },
});
