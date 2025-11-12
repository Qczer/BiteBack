import { Courgette_400Regular, useFonts } from "@expo-google-fonts/courgette";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
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
            Turn leftovers into possibilities with{" "}
            <Text style={styles.brand}>BiteBack</Text>!
          </Text>
        </View>

        {/* Button 30% */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/LoginScreen");
            }}
            style={styles.button}
          >
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
              GET STARTED
            </Text>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeece8",
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
    backgroundColor: "#eeece8",
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
    color: "#2da77eff",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 3,
    backgroundColor: "#2da77eff",
    alignItems: "center",

    // cień iOS
    shadowColor: "black",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 6,

    // cień Android
    elevation: 8,
  },

  footerText: {
    // fontFamily: "Courgette_400Regular",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2da77eff",
  },
});
