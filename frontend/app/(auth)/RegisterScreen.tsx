import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import FormInput from "@/components/FormInput";
import RealButton from "@/components/RealButton";
import toastConfig from "@/components/ToastConfig";
import { saveItem } from "@/services/AuthService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
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

const showToast = (message: string) => {
  Toast.show({
    type: "error",
    text1: message,
    position: "top",
    swipeable: true,
  });
};

export default function RegisterScreen() {
  const [availableToLog, setAvailableToLog] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  // const [isPasswordPopoverVisible, setIsPasswordPopoverVisible] = useState(false);
  // const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  useEffect(() => {
    validateForm();
  }, [email, password, repeatedPassword]);
  const [emailAlertText, setEmailAlertText] = useState("");
  const [passwordAlertText, setPasswordAlertText] = useState("");
  const [repeatedPasswordAlertText, setRepeatedPasswordAlertText] =
    useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 7+ znakow, jeden specjalny, jedna wielka litera
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

  const handleRegister = () => {
    saveItem("userEmail", email);
    router.replace("/(auth)/CreateNicknameScreen");
    // saveItem("userPassword", password);
  };

  const validateForm = () => {
    if (email.length === 0 && password.length === 0) return;
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
    setAvailableToLog(
      emailValid && passwordValid && repeatedPassword === password
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerBlock}>
              <Image
                source={require("@/assets/images/adaptive-icon.png")}
                style={{ width: 50, height: 50, marginRight: 10 }}
              />
              <Text style={styles.headerText}>BiteBack</Text>
              <Text style={styles.welcomeBackText}>Good to see you!</Text>
            </View>

            {/* FORM */}
            <View style={styles.formBlock}>
              <View style={styles.formBox}>
                <FormInput
                  placeholder="johndoe@mail.com"
                  leftIcon="mail-outline"
                  label="Email address"
                  alertText={emailAlertText}
                  setVal={setEmail}
                  // onValueChange={validateForm}
                />

                <FormInput
                  placeholder="Your password"
                  leftIcon="lock-closed-outline"
                  rightIcon="eye-outline"
                  secure={true}
                  label="Password"
                  alertText={passwordAlertText}
                  showHelp={showPasswordHelp}
                  // onValueChange={validateForm}
                  setVal={setPassword}
                />
                <FormInput
                  placeholder="Your password"
                  leftIcon="lock-closed-outline"
                  rightIcon="eye-outline"
                  secure={true}
                  label="Confirm password"
                  alertText={repeatedPasswordAlertText}
                  showHelp={showPasswordHelp}
                  // onValueChange={validateForm}
                  setVal={setRepeatedPassword}
                />
                <Pressable
                  onPress={
                    availableToLog
                      ? () => handleRegister()
                      : () => {
                          showToast("Please fill in all fields correctly.");
                        }
                  }
                  style={[
                    styles.loginButton,
                    { backgroundColor: availableToLog ? GreenVar : "gray" },
                  ]}
                >
                  <Text style={styles.buttonText}>Create account</Text>
                </Pressable>

                <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.line} />
                </View>
                <RealButton
                  text="Sign in"
                  onPress={() => router.push("/(auth)/LoginScreen")}
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
    height: "25%",
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
