import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import FormInput from "@/components/FormInput";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const [secure, setSecure] = useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <View
          style={{
            // width: "100%",
            flexDirection: "column",
            alignItems: "center",
            // justifyContent: "space-around",
          }}
        >
          <Image
            source={require("../../assets/images/adaptive-icon.png")}
            style={{ width: 50, height: 50, marginRight: 10 }}
          ></Image>
          <Text style={styles.headerText}>BiteBack</Text>
          <Text style={styles.welcomeBackText}>Welcome back!</Text>
        </View>
      </View>
      <View style={styles.formBlock}>
        <View>
          <Text>Email address</Text>
          <FormInput placeholder="johndoe@mail.com" leftIcon="mail-outline" />
        </View>
        <View>
          <Text>Password</Text>
          <FormInput
            placeholder="Your password"
            leftIcon="lock-closed-outline"
            rightIcon="eye-outline"
            secure={true}
          />
          <Pressable
            onPress={() => router.replace("/(tabs)/HomeScreen")}
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 12,
              borderRadius: 25,
              backgroundColor: GreenVar,
            }}
          >
            <Text>log in</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.otherBlock}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WhiteVar,
  },
  headerBlock: {
    width: "100%",
    height: "25%",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: WhiteVar,
  },
  formBlock: {
    height: "60%",
    width: "100%",
    backgroundColor: WhiteVar,
    padding: "15%",
    justifyContent: "space-around",
  },
  otherBlock: {
    height: "15%",
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
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    width: "100%", // szerokość całego bloku
    alignSelf: "center",
  },
  leftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1, // zajmuje ~80% szerokości
    paddingVertical: 8,
    fontSize: 16,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
