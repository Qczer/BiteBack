import { getPoints, TomTomApiKey } from "@/api/endpoints/dotationpoints";
import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import toastConfig from "@/components/ToastConfig";
import { withCopilotProvider } from "@/components/WithCopilotProvider";
import { default as translate } from "@/locales/i18n";
import DotationPoint from "@/types/DotationPoint";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import Toast from "react-native-toast-message";
import { WebView, WebViewMessageEvent } from "react-native-webview";

// Dodajemy style do CopilotView, aby wypełnił ekran
const CopilotView = walkthroughable(View);
const CopilotText = walkthroughable(Text);

const showToast = (message: string) => {
  Toast.show({
    type: "error",
    text1: message,
    position: "top",
    swipeable: true,
  });
};
const showSuccessfulToast = (message: string) => {
  Toast.show({
    type: "success",
    text1: message,
    position: "top",
    swipeable: true,
  });
};

function MapsScreen() {
  const copilot = (key: string) => translate("copilot." + key);
  const t = (key: string) => translate("screens.feedback." + key);

  const webviewRef = useRef<WebView>(null);
  const [searchText, setSearchText] = useState("");
  const [distance, setDistance] = useState("5000");
  const [position, setPosition] = useState<[number, number]>([
    21.0122, 52.2297,
  ]);

  // Nowa flaga: czy silnik mapy (TomTom) jest gotowy?
  const [isTomTomReady, setIsTomTomReady] = useState(false);

  const { start, totalStepsNumber } = useCopilot();
  const hasStartedTutorial = useRef(false);

  const createMarkers = async () => {
    const res = await getPoints(searchText, position, parseInt(distance));

    // Wyczyść markery
    webviewRef.current?.injectJavaScript(`window.clearMarkers(); true;`);

    if (res && res.length > 0) {
      showSuccessfulToast(`Ilość znalezionych punktów dotacji: ${res.length}`);
      const markersData = res.map((p: DotationPoint) => ({
        coords: p.location,
        name: p.name,
        description: p.description || "",
        city: p.city,
        code: p.postalCode,
        street: p.street,
        number: p.number,
        first: res.indexOf(p) == 0,
      }));

      const jsCode = `
        (function() {
          const data = ${JSON.stringify(markersData)};
          data.forEach(p => window.addMarker(p.coords, p.name, p.description, p.city, p.code, p.street, p.number, p.first));
        })();
        true;
      `;

      webviewRef.current?.injectJavaScript(jsCode);
    } else {
      showToast(`Znaleziono 0 punktów dotacji`);
    }
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      // Parsujemy wiadomość JSON od mapy
      const rawData = event.nativeEvent.data;
      // Czasami przychodzą logi tekstowe, więc próbujemy parsować
      if (!rawData.startsWith("{")) return;

      const data: { lng?: number; lat?: number; type: string } =
        JSON.parse(rawData);

      // KLUCZOWE: Odbieramy sygnał, że mapa jest gotowa
      if (data.type === "map-ready") {
        console.log("TomTom Map is fully rendered!");
        setIsTomTomReady(true);
      } else if (data.type === "map-center" && data.lng && data.lat) {
        setPosition([data.lng, data.lat]);
      }
    } catch (e) {
      console.log("Non-JSON message:", event.nativeEvent.data);
    }
  };

  // Logika startowania tutoriala
  useFocusEffect(
    useCallback(() => {
      // Startujemy TYLKO gdy isTomTomReady == true
      if (!hasStartedTutorial.current && isTomTomReady) {
        console.log("Map ready inside effect. Starting copilot...");

        const checkTutorialFlag = async () => {
          try {
            const hasSeen = await AsyncStorage.getItem("@hasSeenMapsTutorial");
            if (!hasSeen) {
              // Odpalamy tutorial z małym opóźnieniem
              const timer = setTimeout(() => {
                hasStartedTutorial.current = true;
                start();
                AsyncStorage.setItem("@hasSeenMapsTutorial", "true");
              }, 500);

              return () => clearTimeout(timer);
            }
          } catch (error) {
            console.error("Error checking tutorial flag.", error);
          }
        };

        checkTutorialFlag();
      }
    }, [isTomTomReady, start])
  );

  const html =
    `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.14.0/maps/maps.css" />
    <style>
        html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
        #map { background: #eee; pointer-events: auto; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.14.0/maps/maps-web.min.js"></script>
    <script>
        let map;
        let markers = []
        window.onload = function () {
            map = tt.map({
                key: '` +
    TomTomApiKey +
    `',
                container: "map",
                center: [21.0122, 52.2297],
                zoom: 5 // Zmieniłem zoom na większy, żeby nie było widać tylko oceanu na start
            });

            // 1. Dodajemy event listener 'load'. To odpali się dopiero jak kafelki mapy się załadują.
            map.on('load', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: "map-ready" }));
            });

            map.addControl(new tt.NavigationControl());

            map.on("dragend", () => {
                const c = map.getCenter();
                window.ReactNativeWebView.postMessage(
                    JSON.stringify({ type: "map-center", lng: c.lng, lat: c.lat })
                );
            });
        };

        window.addMarker = function(cords, name, description, city, code, street, number, first) {
          const popup = new tt.Popup({ offset: 35 })
              .setHTML(\`<h3>\${name}</h3><p>\${description}</p><h5> \${city} \${code}, \${street} \${number}</h5>\`);

          const marker = new tt.Marker({color: '#16533f'})
              .setLngLat(cords)
              .setPopup(popup)
              .addTo(map);

          markers.push(marker);
          if (first) {
            map.flyTo({
              center: cords,
              zoom: 12
            });
          }
        };

    </script>
</body>
</html>`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <CopilotStep name="hello" order={1} text={copilot("mapStep1")}>
        <CopilotView style={styles.header}>
          <Text style={styles.headerTitle}>{t("findPoint")}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)/MoreScreen")}
          >
            <Ionicons name="chevron-back" size={23} />
          </TouchableOpacity>
        </CopilotView>
      </CopilotStep>

      {/* Pasek wyszukiwania */}
      <View style={styles.searchBar}>
        <CopilotStep name="explain1" order={2} text={copilot("mapStep2")}>
          <CopilotView style={styles.pickerContainer}>
            <Picker
              selectedValue={distance}
              onValueChange={(itemValue) => setDistance(itemValue)}
              mode="dropdown"
              style={styles.picker}
              dropdownIconColor="#000000"
            >
              <Picker.Item label="+5km" value="5000" />
              <Picker.Item label="+10km" value="10000" />
              <Picker.Item label="+15km" value="15000" />
              <Picker.Item label="+20km" value="20000" />
              <Picker.Item label="+100km" value="100000" />
            </Picker>
          </CopilotView>
        </CopilotStep>

        <CopilotStep name="explain2" order={3} text={copilot("mapStep3")}>
          <CopilotView style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="Wyszukaj punkt dotacji"
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
          </CopilotView>
        </CopilotStep>

        <TouchableOpacity style={styles.searchButton} onPress={createMarkers}>
          <Ionicons name="search" size={30} color={GreenVar} />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        ref={webviewRef}
        style={styles.webview}
        originWhitelist={["*"]}
        source={{ html: html }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
      />
      <Toast config={toastConfig}></Toast>
    </View>
  );
}

// Fix dla Androida (pasek stanu)
export default withCopilotProvider(MapsScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: WhiteVar,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    color: "#000",
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "visible",
    height: 40,
    display: "flex",
    justifyContent: "center",
  },
  picker: {
    height: 55,
    width: 125,
  },
  searchButton: {
    padding: 8,
    borderRadius: 4,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  webviewWrapper: {
    flex: 1,
    width: "100%",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: GreenVar,
  },
  header: {
    height: "12%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    backgroundColor: WhiteVar,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
});
