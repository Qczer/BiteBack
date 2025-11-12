import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import { Courgette_400Regular, useFonts } from "@expo-google-fonts/courgette";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  const [pressed, setPressed] = useState(false);

  const [fontsLoaded] = useFonts({
    Courgette_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.innerContainer}>
        {/* Header 40% */}
        <View style={styles.header}>
          <Text style={styles.sloganText}>
            Fight Waste,{" "}
            <Text style={styles.brand}>BiteBack</Text>.
          </Text>
        </View>

        {/* Button 30% */}
        <View style={styles.buttonContainer}>
          <View style={[styles.buttonShadow, pressed && styles.pressedButtonShadow]}>
            <Pressable
              onPress={() => {
                router.push("./(auth)/LoginScreen");
              }}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              style={[ styles.button, pressed && styles.pressedButton ]}
              >
              <Text style={{ fontWeight: "bold", color: GreenVar }}>
                GET STARTED
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Footer 30% */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            HELP BUILD A WORLD WITH LESS WASTE.{"\n"}EVERY MEAL MATTERS.
          </Text>
        </View>
      </View>
    </View>
  );
}

const LightGreen = "#2da77e";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteVar,
  },
  backgroundImage: {
    height: "55%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  innerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: WhiteVar,
    zIndex: 2,
    flexDirection: "column",
  },
  header: {
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonShadow: {
    paddingBottom: 4,
    backgroundColor: GreenVar,
    borderRadius: 20,
  },
  pressedButtonShadow: {
    marginTop: 2,
    paddingBottom: 2
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderColor: GreenVar,
    borderWidth: 3,
    backgroundColor: WhiteVar,
    alignItems: "center",
    marginRight: 2,
  },
  pressedButton: {
    backgroundColor: "#c5c1bb",
  },
  footer: {
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  sloganText: {
    fontSize: 30,
    fontFamily: "Courgette_400Regular",
    textAlign: "center",
    color: "#333",
  },
  brand: {
    fontFamily: "Courgette_400Regular",
    color: LightGreen,
  },
  footerText: {
    // fontFamily: "Courgette_400Regular",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    color: LightGreen,
  },
});
