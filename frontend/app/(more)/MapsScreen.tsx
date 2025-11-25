import { getPoints, TomTomApiKey } from "@/api/endpoints/dotationpoints";
import { withCopilotProvider } from "@/components/WithCopilotProvider";
import translate from "@/locales/i18n";
import DotationPoint from "@/types/DotationPoint";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import { WebView, WebViewMessageEvent } from "react-native-webview";

const CopilotView = walkthroughable(View);
const CopilotText = walkthroughable(Text);
function MapsScreen() {
  const copilot = (key: string) => translate("copilot." + key);

  const webviewRef = useRef<WebView>(null);
  const [searchText, setSearchText] = useState("");
  const [distance, setDistance] = useState("5000");
  const [position, setPosition] = useState<[number, number]>([
    21.0122, 52.2297,
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { start, totalStepsNumber } = useCopilot();
  const hasStartedTutorial = useRef(false);

  const createMarkers = async () => {
    const res = await getPoints(searchText, position, parseInt(distance));

    // Wyczyść markery
    webviewRef.current?.injectJavaScript(`window.clearMarkers(); true;`);

    if (res && res.length > 0) {
      // Tworzymy tablicę obiektów bezpiecznych dla JS
      const markersData = res.map((p: DotationPoint) => ({
        coords: p.location,
        name: p.name.replace(/'/g, "\\'").replace(/"/g, '\\"'),
        description: (p.description || "")
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"'),
      }));

      const jsCode = `
      (function() {
        const data = ${JSON.stringify(markersData)};
        data.forEach(p => window.addMarker(p.coords, p.name, p.description));
        })();
        true;
        `;

      webviewRef.current?.injectJavaScript(jsCode);
    }
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      setIsLoaded(true);
      const data: { lng: number; lat: number; type: string } = JSON.parse(
        event.nativeEvent.data
      );

      if (data.type === "map-center") {
        setPosition([data.lng, data.lat]);
        console.log("Nowe centrum mapy:", data);
      }
    } catch {
      console.log("Wiadomość:", event.nativeEvent.data);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const checkTutorialFlag = async () => {
  //       try {
  //         const hasSeen =await AsyncStorage.getItem("@hasSeenHomeTutorial");
  //         if (!hasSeen && !hasStartedTutorial.current) {
  //           // Odpalamy tutorial z opóźnieniem
  //           const timer = setTimeout(() => {
  //             hasStartedTutorial.current = true;
  //             start();
  //             AsyncStorage.setItem("@hasSeenHomeTutorial", "true");
  //           }, 0);

  //           return () => clearTimeout(timer);
  //         }
  //       } catch (error) {
  //         console.error("Error checking tutorial flag.", error);
  //       }
  //     };

  //     // ma byc !dev jesli production ready
  //     if (__DEV__) {
  //       checkTutorialFlag();
  //     }
  //   }, [start])
  // );
  useFocusEffect(
    React.useCallback(() => {
      if (!hasStartedTutorial.current && isLoaded) {
        console.log("Starting copilot tutorial...");
        const timer = setTimeout(() => {
          hasStartedTutorial.current = true;
          console.log("Starting copilot with", totalStepsNumber, "steps.");
          if (isMapLoaded) start();
        }, 250);

        return () => clearTimeout(timer);
      }
    }, [isLoaded, start, isMapLoaded])
  );

  const html =
    `<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.14.0/maps/maps.css" />

    <style>
        html,
        body,
        #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        #map {
            background: #eee;
            pointer-events: auto;
        }
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
                zoom: 1
            });
            window.ReactNativeWebView.postMessage("co tam2")
            map.addControl(new tt.NavigationControl());

            map.on("dragend", () => {
                const c = map.getCenter(); // {lng: ..., lat: ...}

                window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                        type: "map-center",
                        lng: c.lng,
                        lat: c.lat
                    })
                );
            });
        };

        window.addMarker = function(cords, name, description) {
          const popup = new tt.Popup({ offset: 35 })
              .setHTML(\`<h3>\${name}</h3><p>\${description}</p>\`);

          const marker = new tt.Marker()
              .setLngLat(cords)
              .setPopup(popup)
              .addTo(map);

          markers.push(marker);
        };
        window.clearMarkers = function () {
            markers.forEach(m => m.remove())
            markers = []
        }
    </script>
</body>

</html>`;

  return (
    <View style={styles.container}>
      {/* Pasek wyszukiwania */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Wyszukaj punkt dotacji"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={styles.pickerContainer}>
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
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={createMarkers}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* WebView */}

      <CopilotStep name="hello" order={1} text={copilot("mapStep1")}>
        <CopilotView>
          <WebView
            ref={webviewRef}
            style={styles.webview}
            originWhitelist={["*"]}
            source={{ html: html }} // Twój html z mapą
            javaScriptEnabled
            domStorageEnabled
            onLoadEnd={() => {
              createMarkers();
              setIsMapLoaded(true);
            }}
            onMessage={onMessage}
          />
        </CopilotView>
      </CopilotStep>
    </View>
  );
}

export default withCopilotProvider(MapsScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
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
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  webview: {
    flex: 1,
  },
});
