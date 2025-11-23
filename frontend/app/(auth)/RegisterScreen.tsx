import { register } from "@/api/endpoints/user";
import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import FormInput from "@/components/FormInput";
import RealButton from "@/components/RealButton";
import toastConfig from "@/components/ToastConfig";
import translate from "@/locales/i18n";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const showToast = (message: string) => {
  Toast.show({
    type: "error",
    text1: message,
    position: "top",
    swipeable: true,
  });
};

export default function RegisterScreen() {
  const tURL = "screens.register.";
  const t = (key: string) => translate(tURL + key);

  const [allFilled, setAllFilled] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const [emailAlertText, setEmailAlertText] = useState("");
  const [usernameAlertText, setUsernameAlertText] = useState("");
  const [passwordAlertText, setPasswordAlertText] = useState("");
  const [repeatedPasswordAlertText, setRepeatedPasswordAlertText] =
    useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

  useEffect(() => {
    validateForm();
  }, [email, password, repeatedPassword]);

  const handleRegister = async () => {
    if (!allFilled) {
      showToast(t("pleaseFillAllFields"));
      return;
    }

    setLoading(true);
    try {
      const res = await register(email, username, password);
      if (res.success) router.replace("/LoginScreen");
      else {
        showToast(`Error ${res.status}: ${res.message}`);
      }
    } catch (error) {
      showToast("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (email.length === 0 || username.length === 0 || password.length === 0)
      return;

    let emailValid = emailRegex.test(email);
    let passwordValid = passwordRegex.test(password);

    setEmailAlertText(emailValid ? "" : "Enter a valid email address.");
    setPasswordAlertText(
      passwordValid ? "" : "Password doesn't meet our requirements."
    );

    if (passwordValid) {
      setRepeatedPasswordAlertText(
        repeatedPassword === password ? "" : "Passwords do not match."
      );
    }

    setShowPasswordHelp(!passwordValid);
    setAllFilled(emailValid && passwordValid && repeatedPassword === password);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={120}
        keyboardOpeningTime={0}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.headerBlock}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 100, height: 100, marginRight: 10 }}
            />
            <Text style={styles.headerText}>BiteBack</Text>
            <Text style={styles.welcomeBackText}>{t("goodToSeeYou")}</Text>
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
                placeholder={t("usernamePlaceholder")}
                leftIcon="person-outline"
                label={t("usernameLabel")}
                alertText={usernameAlertText}
                setVal={setUsername}
              />
              <FormInput
                placeholder={t("passwordPlaceholder")}
                leftIcon="lock-closed-outline"
                rightIcon="eye-outline"
                secure={true}
                label={t("passwordLabel")}
                alertText={passwordAlertText}
                showHelp={showPasswordHelp}
                setVal={setPassword}
              />
              <FormInput
                placeholder={t("passwordPlaceholder")}
                leftIcon="lock-closed-outline"
                rightIcon="eye-outline"
                secure={true}
                label={t("confirmPasswordLabel")}
                alertText={repeatedPasswordAlertText}
                showHelp={showPasswordHelp}
                setVal={setRepeatedPassword}
              />
              <Pressable
                onPress={handleRegister}
                disabled={loading}
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: allFilled && !loading ? GreenVar : "gray",
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={WhiteVar} />
                ) : (
                  <Text style={styles.buttonText}>{t("createAccount")}</Text>
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
                text={t("signIn")}
                onPress={() => router.push("/(auth)/LoginScreen")}
              />
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.otherBlock}></View>
        </View>
        <Toast config={toastConfig} />
      </KeyboardAwareScrollView>
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
    flex: 6,
    width: "100%",
    backgroundColor: "snow",
    justifyContent: "center",
    paddingVertical: 20,
  },
  formBox: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: width * 0.85,
    backgroundColor: WhiteVar,
    alignSelf: "center",
    borderRadius: 20,
    padding: "5%",
    elevation: 5,
    shadowColor: "#000",
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
