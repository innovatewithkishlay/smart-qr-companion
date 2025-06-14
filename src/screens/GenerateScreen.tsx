import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const QR_TYPES = [
  { label: "URL", value: "url" },
  { label: "Text", value: "text" },
  // Add more types here
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
  const [qrType, setQrType] = useState("url");
  const [input, setInput] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const getPlaceholder = () => {
    switch (qrType) {
      case "url":
        return "Enter URL (https://...)";
      case "text":
        return "Enter text";
      default:
        return "Enter value";
    }
  };

  const buildQRValue = () => input;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generate QR Code</Text>
      <View style={styles.typeSelector}>
        {QR_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.typeButton,
              qrType === type.value && styles.typeButtonActive,
            ]}
            onPress={() => {
              setQrType(type.value);
              setInput("");
              setQrValue("");
            }}
          >
            <Text
              style={[
                styles.typeButtonText,
                qrType === type.value && styles.typeButtonTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder={getPlaceholder()}
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.sectionLabel}>QR Code Color</Text>
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
      <Text style={styles.sectionLabel}>Background Color</Text>
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => setQrValue(buildQRValue())}
        disabled={!input.trim()}
      >
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
      <View style={styles.qrContainer}>
        {qrValue ? (
          <QRCode
            value={qrValue}
            size={200}
            color={qrColor}
            backgroundColor={bgColor}
          />
        ) : (
          <Text style={styles.placeholder}>Your QR code will appear here</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 16 },
  typeSelector: { flexDirection: "row", marginBottom: 12 },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: "#007bff",
  },
  typeButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  sectionLabel: { fontWeight: "bold", marginTop: 16, marginBottom: 4 },
  colorRow: { flexDirection: "row", marginBottom: 8 },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "#eee",
  },
  selectedSwatch: {
    borderColor: "#007bff",
    borderWidth: 3,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  qrContainer: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
    height: 220,
  },
  placeholder: { color: "#aaa", fontSize: 16 },
});

export default GenerateScreen;
