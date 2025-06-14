import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const QR_TYPES = [
  { label: "URL", value: "url" },
  { label: "Text", value: "text" },
];

const GenerateScreen = () => {
  const [qrType, setQrType] = useState("url");
  const [input, setInput] = useState("");
  const [qrValue, setQrValue] = useState("");

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

  const buildQRValue = () => {
    return input;
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => setQrValue(buildQRValue())}
        disabled={!input.trim()}
      >
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
      <View style={styles.qrContainer}>
        {qrValue ? (
          <QRCode value={qrValue} size={200} />
        ) : (
          <Text style={styles.placeholder}>Your QR code will appear here</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
