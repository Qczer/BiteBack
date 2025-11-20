import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import FormInput from "@/components/FormInput";
import toastConfig from "@/components/ToastConfig";
import { getItem, setItem } from "@/services/AuthService";
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

export default function CreateNicknameScreen() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadEmail = async () => {
      const email = await getItem("userEmail");
      setUserEmail(email);
    };
    loadEmail();
  }, []);

  const [availableToLog, setAvailableToLog] = useState(false);
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    validateForm();
  }, [nickname]);
  const [nicknameAlertText, setNicknameAlertText] = useState("");

  const handleCreateNickname = () => {
    setItem("userNickname", nickname);
    router.replace("/(tabs)/HomeScreen");
  };

  const validateForm = () => {
    if (nickname.length > 0) setAvailableToLog(true);
    else setAvailableToLog(false);
    // ponizsza linijke tez odkomentuj a powyzsze 2 zakomentuj
    // if (nickname.length === 0) return;
    // zrob walidacje nicku na obecnosc w bazie danych
    // setNicknameAlertText("This username is already taken.");
    // setAvailableToLog(true);
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
              <Text style={styles.welcomeBackText}>One more step!</Text>
            </View>

            {/* FORM */}
            <View style={styles.formBlock}>
              <View style={styles.formBox}>
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  <Text
                    style={{
                      color: GreenVar,
                      fontSize: 23,
                      fontWeight: "bold",
                      margin: 5,
                    }}
                  >
                    Create your username
                  </Text>
                  <Text style={{}}>
                    Your nickname will be visible to other users.
                  </Text>
                  <Text style={{ color: "gray", padding: 5 }}>{userEmail}</Text>
                </View>
                <FormInput
                  placeholder="Your username"
                  leftIcon="person-outline"
                  label="Nickname"
                  alertText={nicknameAlertText}
                  setVal={setNickname}
                  // onValueChange={validateForm}
                />

                {/* <FormInput
                  placeholder="Your password"
                  leftIcon="lock-closed-outline"
                  rightIcon="eye-outline"
                  secure={true}
                  label="Password"
                  alertText={passwordAlertText}
                  showHelp={showPasswordHelp}
                  // onValueChange={validateForm}
                  setVal={setPassword}
                /> */}

                {/* <Text style={styles.secondaryText}>Forgot password?</Text> */}

                <Pressable
                  onPress={
                    availableToLog
                      ? () => handleCreateNickname()
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

                {/* <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.line} />
                </View>
                <RealButton
                  text="Create account"
                  onPress={() => router.push("/(auth)/RegisterScreen")}
                /> */}
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
    paddingTop: "25%",
    flex: 5,
    width: "100%",
    backgroundColor: "snow",
    justifyContent: "flex-start",
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
    zIndex: 2,
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
