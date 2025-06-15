import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { QrHistoryItem } from "../types/QrHistory";
import { addToHistory } from "../utils/history";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const QR_TYPES = [
  { label: "URL", value: "url" },
  { label: "Text", value: "text" },
  { label: "Wi-Fi", value: "wifi" },
  { label: "Contact", value: "vcard" },
  { label: "Image", value: "image" },
];

const COLOR_PRESETS = [
  "#000000",
  "#007bff",
  "#e83e8c",
  "#28a745",
  "#ffc107",
  "#ffffff",
];
const BG_COLOR_PRESETS = [
  "#ffffff",
  "#f8f9fa",
  "#343a40",
  "#ffeb3b",
  "#e0f7fa",
  "#ffcccb",
];

const GenerateScreen = () => {
  const { theme } = useTheme();
  const [qrType, setQrType] = useState("url");
  const [input, setInput] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiType, setWifiType] = useState("WPA");
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageRef, setImageRef] = useState<string>("");
  const [qrValue, setQrValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [processing, setProcessing] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  const getPlaceholder = () => {
    switch (qrType) {
      case "url":
        return "Enter URL (https://...)";
      case "text":
        return "Enter text";
      default:
        return "";
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets[0].uri) {
        setProcessing(true);
        const imageId = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          result.assets[0].uri + Date.now()
        );
        const imageDir = `${FileSystem.documentDirectory}images/`;
        await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true });
        const newPath = `${imageDir}${imageId}.jpg`;
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: newPath,
        });
        await AsyncStorage.setItem(imageId, newPath);
        setSelectedImage(newPath);
        setImageRef(imageId);
        setProcessing(false);
      }
    } catch (error) {
      setProcessing(false);
      Alert.alert("Error", "Failed to process image");
    }
  };

  const buildQRValue = () => {
    if (qrType === "url" || qrType === "text") return input;
    if (qrType === "wifi")
      return `WIFI:T:${wifiType};S:${wifiSSID};P:${wifiPassword};;`;
    if (qrType === "vcard") {
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${vcardName}`,
        ...(vcardPhone ? [`TEL:${vcardPhone}`] : []),
        ...(vcardEmail ? [`EMAIL:${vcardEmail}`] : []),
        "END:VCARD",
      ].join("\n");
    }
    if (qrType === "image") return `smartqr://image/${imageRef}`;
    return "";
  };

  const handleGenerate = async () => {
    try {
      if (qrType === "image" && !imageRef) {
        Alert.alert("Error", "Please select an image first");
        return;
      }
      const value = buildQRValue();
      if (!value) {
        Alert.alert("Error", "Please enter valid content");
        return;
      }
      setQrValue(value);
      const newItem: QrHistoryItem = {
        id: Date.now().toString(),
        type: qrType,
        value,
        color: qrColor,
        bgColor,
        date: Date.now(),
        favorite: false,
      };
      await addToHistory(newItem);
    } catch (error) {
      Alert.alert("Error", "Failed to generate QR code.");
      setQrValue("");
    }
  };

  const saveQrToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") throw new Error("Permission denied");
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error("Capture failed");
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "QR code saved to gallery!");
    } catch (error) {
      Alert.alert("Error", "Could not save QR code");
    }
  };

  const shareQrCode = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error("Capture failed");
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Could not share QR code");
    }
  };

  React.useEffect(() => {
    setInput("");
    setWifiSSID("");
    setWifiPassword("");
    setWifiType("WPA");
    setVcardName("");
    setVcardPhone("");
    setVcardEmail("");
    setSelectedImage("");
    setImageRef("");
    setQrValue("");
  }, [qrType]);

  const handleCustomizeToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowCustomize((prev) => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        {processing && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.text }]}>
                Processing Image...
              </Text>
            </View>
          </View>
        )}
        <Text style={[styles.title, { color: theme.primary }]}>
          Generate QR Code
        </Text>
        <View style={styles.typeSelector}>
          {QR_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeButton,
                qrType === type.value && { backgroundColor: theme.primary },
              ]}
              onPress={() => setQrType(type.value)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  qrType === type.value && { color: "#fff" },
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {(qrType === "url" || qrType === "text") && (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.primary + "33",
              },
            ]}
            placeholder={getPlaceholder()}
            placeholderTextColor={theme.text + "99"}
            value={input}
            onChangeText={setInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        {qrType === "wifi" && (
          <>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.primary + "33",
                },
              ]}
              placeholder="Wi-Fi SSID"
              placeholderTextColor={theme.text + "99"}
              value={wifiSSID}
              onChangeText={setWifiSSID}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.primary + "33",
                },
              ]}
              placeholder="Wi-Fi Password"
              placeholderTextColor={theme.text + "99"}
              value={wifiPassword}
              onChangeText={setWifiPassword}
            />
            <View style={styles.typeSelector}>
              {["WPA", "WEP", "nopass"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    wifiType === type && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setWifiType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      wifiType === type && { color: "#fff" },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        {qrType === "vcard" && (
          <>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.primary + "33",
                },
              ]}
              placeholder="Full Name"
              placeholderTextColor={theme.text + "99"}
              value={vcardName}
              onChangeText={setVcardName}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.primary + "33",
                },
              ]}
              placeholder="Phone"
              placeholderTextColor={theme.text + "99"}
              value={vcardPhone}
              onChangeText={setVcardPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.primary + "33",
                },
              ]}
              placeholder="Email"
              placeholderTextColor={theme.text + "99"}
              value={vcardEmail}
              onChangeText={setVcardEmail}
              keyboardType="email-address"
            />
          </>
        )}
        {qrType === "image" && (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={pickImage}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {selectedImage ? "Change Image" : "Pick Image"}
                </Text>
              )}
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            )}
          </>
        )}

        {/* Collapsible Customize Section */}
        <TouchableOpacity
          style={styles.collapseToggle}
          onPress={handleCustomizeToggle}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showCustomize ? "chevron-up" : "chevron-down"}
            size={22}
            color={theme.primary}
          />
          <Text style={[styles.collapseToggleText, { color: theme.primary }]}>
            Customize QR Colors
          </Text>
        </TouchableOpacity>
        {showCustomize && (
          <View
            style={[styles.customizePanel, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.sectionLabel, { color: theme.primary }]}>
              QR Code Color
            </Text>
            <View style={styles.colorRow}>
              {COLOR_PRESETS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    qrColor === color && styles.selectedSwatch,
                  ]}
                  onPress={() => setQrColor(color)}
                />
              ))}
            </View>
            <Text style={[styles.sectionLabel, { color: theme.primary }]}>
              Background Color
            </Text>
            <View style={styles.colorRow}>
              {BG_COLOR_PRESETS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    bgColor === color && styles.selectedSwatch,
                  ]}
                  onPress={() => setBgColor(color)}
                />
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleGenerate}
          disabled={
            (qrType === "url" && !input.trim()) ||
            (qrType === "text" && !input.trim()) ||
            (qrType === "wifi" && (!wifiSSID.trim() || !wifiPassword.trim())) ||
            (qrType === "vcard" && !vcardName.trim()) ||
            (qrType === "image" && !imageRef)
          }
        >
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1 }}
          style={styles.qrContainer}
        >
          <View style={[styles.qrWrapper, { backgroundColor: bgColor }]}>
            {qrValue ? (
              <QRCode
                value={qrValue}
                size={200}
                color={qrColor}
                backgroundColor={bgColor}
                onError={() => {
                  Alert.alert("Error", "Failed to generate QR code.");
                  setQrValue("");
                }}
              />
            ) : (
              <Text style={[styles.placeholder, { color: theme.text + "99" }]}>
                Your QR code will appear here
              </Text>
            )}
          </View>
        </ViewShot>
        {qrValue && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#28a745" }]}
              onPress={saveQrToGallery}
            >
              <Text style={styles.actionButtonText}>Save to Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#28a745" }]}
              onPress={shareQrCode}
            >
              <Text style={styles.actionButtonText}>Share QR Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 18,
    letterSpacing: 1,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginHorizontal: 4,
    marginVertical: 4,
    elevation: 1,
  },
  typeButtonActive: {
    backgroundColor: "#1976d2",
    elevation: 3,
  },
  typeButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 13,
    marginVertical: 8,
    fontSize: 16,
  },
  sectionLabel: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    alignSelf: "flex-start",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  colorRow: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "#eee",
    marginVertical: 3,
  },
  selectedSwatch: {
    borderColor: "#1976d2",
    borderWidth: 3,
  },
  button: {
    padding: 13,
    borderRadius: 10,
    marginVertical: 16,
    width: "100%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  imagePreview: {
    width: 160,
    height: 160,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  qrContainer: {
    marginTop: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  qrWrapper: {
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
    minWidth: 220,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  placeholder: {
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  collapseToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 18,
    marginBottom: 2,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  collapseToggleText: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  customizePanel: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    marginTop: 2,
    elevation: 1,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
});

export default GenerateScreen;
