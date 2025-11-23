import { axiosClient } from "@/api/axiosClient";
import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import HeaderBar from "@/components/HeaderBar";
import translate from "@/locales/i18n";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScanScreen() {
  const tURL = "screens.scan.";
  const t = (key: string) => translate(tURL + key);

  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [snapshotUri, setSnapshotUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) return null;

  // 1️⃣ Brak zgody na kamerę
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: WhiteVar }}>
        <HeaderBar />
        <View style={styles.center}>
          <Image
            source={require("@/assets/images/people/cameraPerms.png")}
            style={{
              alignSelf: "center",
              marginBottom: 10,
            }}
            height={260}
            width={260}
            resizeMode="contain"
          ></Image>

          <Text style={styles.title}>{t("permissionTitle")}</Text>
          <Text style={styles.description}>{t("permissionDesc")}</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>{t("grantPermission")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2️⃣ Podgląd zdjęcia (jeśli zrobione)
  if (uri && !showCamera) {
    return (
      <View style={{ flex: 1, backgroundColor: WhiteVar }}>
        <HeaderBar />
        <View style={styles.center}>
          <Image source={{ uri }} style={styles.preview} />
          <Text style={styles.description}>Here is your photo</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setUri(null);
              setShowCamera(true);
            }}
          >
            <Text style={styles.buttonText}>Take another picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3️⃣ Kamera
  if (showCamera) {
    const takePicture = async () => {
      if (!ref.current) return;

      setLoading(true);
      const snapshot = await ref.current?.takePictureAsync({
        skipProcessing: true,
      });
      if (snapshot?.uri) setSnapshotUri(snapshot.uri);

      try {
        const photo = await ref.current?.takePictureAsync({ imageType: "png" });
        if (photo?.uri) {
          setUri(photo.uri);

          const form = new FormData();
          form.append("image", {
            uri: photo.uri,
            name: "image.png",
            type: "image/png",
          } as any);

          try {
            const result = await axiosClient.post("/ai/scan/", form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            router.replace({
              pathname: "/(more)/ShoppingListsScreen",
              params: { food: JSON.stringify(result.data), fromScan: "true" },
            });
          } catch (err) {
            console.error("Upload failed:", err);
          }
        }
      } catch (e) {
        console.error("Błąd zdjęcia", e);
      } finally {
        setLoading(false);
        setShowCamera(false);
        setSnapshotUri(null);
      }
    };

    return (
      <View style={styles.container}>
        {loading && (
          <ActivityIndicator
            size="large"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [
                { translateX: "-50%" },
                { translateY: "-50%" },
                { scale: 1.75 },
              ],
              zIndex: 100,
            }}
          />
        )}

        <CameraView
          style={styles.camera}
          ref={ref}
          facing="back"
          mode="picture"
          animateShutter={true}
          enableTorch={flashlightOn}
        />
        {snapshotUri && (
          <Image
            source={{ uri: snapshotUri }}
            style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
          />
        )}

        {/* Overlay grid */}
        <View style={styles.gridOverlay}>
          {[...Array(2)].map((_, i) => (
            <View
              key={i}
              style={[styles.gridLine, { top: `${(i + 1) * 33}%` }]}
            />
          ))}
          {[...Array(2)].map((_, i) => (
            <View
              key={i}
              style={[styles.gridLineVertical, { left: `${(i + 1) * 33}%` }]}
            />
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Ionicons name="camera" size={28} color={WhiteVar} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.flashlightButton,
              { opacity: flashlightOn ? 0.5 : 0.9 },
            ]}
            onPress={() => setFlashlightOn((prev) => !prev)}
          >
            <Ionicons name="flashlight" size={28} color={WhiteVar} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 4️⃣ Ekran startowy (przycisk otwarcia kamery)
  return (
    <View style={{ flex: 1, backgroundColor: WhiteVar }}>
      <HeaderBar />
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={64} color={GreenVar} />
        <Text style={styles.title}>{t("camera")}</Text>
        <Text style={styles.description}>{t("cameraDesc")}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCamera(true)}
        >
          <Text style={styles.buttonText}>{t("openCamera")}</Text>
        </TouchableOpacity>
        <View style={{ margin: 20 }}>
          <Text style={styles.warning}>{t("cameraWarning1")}</Text>
          <Text style={styles.warning}>{t("cameraWarning2")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: GreenVar,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 12,
  },
  button: {
    backgroundColor: GreenVar,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "600",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
  },
  captureButton: {
    position: "absolute",
    backgroundColor: GreenVar,
    padding: 16,
    borderRadius: 40,
    alignSelf: "center",
  },
  flashlightButton: {
    position: "absolute",
    backgroundColor: GreenVar,
    padding: 10,
    borderRadius: 40,
    right: 10,
  },
  preview: {
    width: "80%",
    height: "60%",
    borderRadius: 12,
    marginBottom: 20,
  },
  gridOverlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  warning: {
    alignSelf: "center",
    textAlign: "center",
    color: "red",
    fontSize: 16,
    fontWeight: "600",
    zIndex: 1,
  },
});
