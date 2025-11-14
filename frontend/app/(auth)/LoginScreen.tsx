import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import FormInput from "@/components/FormInput";
import RealButton from "@/components/RealButton";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [secure, setSecure] = useState(true);
  const [emailAlertText, setEmailAlertText] = useState(
    "Account with this email does not exist."
  );
  const [passwordAlertText, setPasswordAlertText] = useState(
    "This password is incorrect."
  );

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerBlock}>
              <Image
                source={require("../../assets/images/adaptive-icon.png")}
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
                />

                <FormInput
                  placeholder="Your password"
                  leftIcon="lock-closed-outline"
                  rightIcon="eye-outline"
                  secure={true}
                  label="Password"
                  alertText={passwordAlertText}
                />

                <Text style={styles.secondaryText}>Forgot password?</Text>

                <Pressable
                  onPress={() => router.replace("/(tabs)/HomeScreen")}
                  style={styles.loginButton}
                >
                  <Text style={styles.buttonText}>Log in</Text>
                </Pressable>

                <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.line} />
                </View>
                <RealButton text="Create account" />
              </View>
            </View>

            {/* FOOTER */}
            <View style={styles.otherBlock}></View>
          </View>
        </ScrollView>
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
    backgroundColor: WhiteVar,
    paddingVertical: 20,
  },
  formBlock: {
    flex: 5,
    width: "100%",
    backgroundColor: WhiteVar,
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
  },
  otherBlock: {
    flex: 1,
    backgroundColor: WhiteVar,
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
    backgroundColor: GreenVar,
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
