import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import FormInput from "@/components/FormInput";
import RealButton from "@/components/RealButton";
import toastConfig from "@/components/ToastConfig";
import { setItem } from "@/services/AuthService";
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

export default function LoginScreen() {
  const [availableToLog, setAvailableToLog] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  // const [isPasswordPopoverVisible, setIsPasswordPopoverVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    validateForm();
  }, [email, password]);
  const [emailAlertText, setEmailAlertText] = useState("");
  const [passwordAlertText, setPasswordAlertText] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 7+ znakow, jeden specjalny, jedna wielka litera
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

  const validateForm = () => {
    if (email.length === 0 && password.length === 0) return;

    /*
      jakub u:
       - masz zrobiona walidacje niepustych pol i spelniajacych regexpy
       - zostala ci kwestia bazodanowa czyli niepowtorzone emaile
       - setEmailAlertText i setPasswordAlertText: tym zmieniasz te labele czerwone pod inputami
       - mozesz tez wywolac toast czyli takie pole u gory z komunikatem (te same co po nacisnieciu szarego log in)
       - showToast(komunikat)
    */
    let emailValid = emailRegex.test(email);
    let passwordValid = passwordRegex.test(password);

    setEmailAlertText(emailValid ? "" : "Enter a valid email address.");

    setPasswordAlertText(
      passwordValid ? "" : "Password doesn't meet our requirements."
    );

    setShowPasswordHelp(!passwordValid);
    setAvailableToLog(emailValid && passwordValid);
  };

  const handleLogin = () => {
    setItem("isLoggedIn", "true");
    router.replace("/(tabs)/HomeScreen");
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
              <Text style={styles.welcomeBackText}>Welcome back!</Text>
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

                <Text style={styles.secondaryText}>Forgot password?</Text>

                <Pressable
                  onPress={
                    availableToLog
                      ? () => handleLogin()
                      : () => {
                          showToast("Please fill in all fields correctly.");
                        }
                  }
                  style={[
                    styles.loginButton,
                    { backgroundColor: availableToLog ? GreenVar : "gray" },
                  ]}
                >
                  <Text style={styles.buttonText}>Sign in</Text>
                </Pressable>

                <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.line} />
                </View>
                <RealButton
                  text="Create account"
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
    flex: 2,
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
