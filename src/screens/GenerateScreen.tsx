import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const GenerateScreen = () => {
  const [input, setInput] = useState("");
  const [qrValue, setQrValue] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate QR Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text, URL, etc."
        value={input}
        onChangeText={setInput}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setQrValue(input)}
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
