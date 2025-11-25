import { getPoints, TomTomApiKey } from "@/api/endpoints/dotationpoints";
import toastConfig from "@/components/ToastConfig";
import DotationPoint from "@/types/DotationPoint";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location"; // jeśli Expo
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import { WebView, WebViewMessageEvent } from "react-native-webview";

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


export default function MapsScreen() {
  const webviewRef = useRef<WebView>(null);
  const [searchText, setSearchText] = useState("");
  const [distance, setDistance] = useState("5000");
  const [position, setPosition] = useState<[number, number]>([21.0122, 52.2297]);
  useEffect(() => {
    const initLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords: [number, number] = [loc.coords.longitude, loc.coords.latitude];

      setPosition(coords); 

      webviewRef.current?.injectJavaScript(`
        window.setUserLocationMarker([${coords[0]}, ${coords[1]}], true);
        true;
      `);
    };

    initLocation();
  }, []);
  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,    
          distanceInterval: 1,    
        },
        (loc) => {
          const coords: [number, number] = [loc.coords.longitude, loc.coords.latitude];

          setPosition(coords);

          webviewRef.current?.injectJavaScript(`
            window.setUserLocationMarker([${coords[0]}, ${coords[1]}], false);
            true;
          `);
        }
      );
    };

    startWatching();

    return () => subscriber?.remove();
  }, []);

  const createMarkers = async () => {
    const res = await getPoints(searchText, position, parseInt(distance));

    // Wyczyść markery
    webviewRef.current?.injectJavaScript(`window.clearMarkers(); true;`);

    if (res && res.length > 0) {
      showSuccessfulToast(`Ilość znalezionych punktów dotacji: ${res.length}`)
      const markersData = res.map((p: DotationPoint) => ({
        coords: p.location,
        name: p.name,
        description: p.description || '',
        city: p.city,
        code: p.postalCode,
        street: p.street,
        number: p.number,
        first: res.indexOf(p) == 0
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
      showToast(`Znaleziono 0 punktów dotacji`)
    }
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data: { lng: number, lat: number, type: string } = JSON.parse(event.nativeEvent.data);

      if (data.type === "map-center") {
        setPosition([data.lng, data.lat]);
        console.log("Nowe centrum mapy:", data);
      }
    }
    catch {
      console.log("Wiadomość:", event.nativeEvent.data);
    }
  };

  const html = `<!DOCTYPE html>
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
                key: '`+ TomTomApiKey +`',
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

        let userMarker = null;

        window.setUserLocationMarker = function(coords, flyTo = false) {
          if (userMarker) userMarker.remove();

          const marker = new tt.Marker({ color: "blue" })
              .setLngLat(coords)
              .addTo(map);

          userMarker = marker;

          if (flyTo) {
            map.flyTo({
              center: coords,
              zoom: 14
            });
          }
        };

        window.clearMarkers = function () {
            markers.forEach(m => m.remove())
            markers = []
        }
    </script>
</body>

</html>`



  return (
    <View style={styles.container}>
      {/* Pasek wyszukiwania */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Filtruj według nazwy"
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
      <WebView
        ref={webviewRef}
        style={styles.webview}
        originWhitelist={["*"]}
        source={{ html: html}} // Twój html z mapą
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
      />
      <Toast config={toastConfig}></Toast>
    </View>
  );
}

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
    display: 'flex',
    justifyContent: 'center'
  },
  picker: {
    height: 55,
    width: 125
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