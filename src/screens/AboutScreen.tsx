import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AboutScreen = () => (
  <View style={styles.container}>
    <Ionicons
      name="information-circle-outline"
      size={60}
      color="#007bff"
      style={{ marginBottom: 20 }}
    />
    <Text style={styles.title}>About Smart QR Companion</Text>
    <Text style={styles.text}>
      Version 1.0.0{"\n"}
      Developed with ❤️ using React Native & Expo.
    </Text>
    <Text style={styles.text}>
      This app lets you generate, scan, and manage QR codes for text, links,
      contacts, Wi-Fi, and images.
    </Text>
    <TouchableOpacity
      style={styles.linkButton}
      onPress={() => Linking.openURL("https://yourwebsite.com")}
    >
      <Text style={styles.linkText}>Visit our website</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#222" },
  text: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  linkButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 8 },
  linkText: { color: "#fff", fontWeight: "bold" },
});

export default AboutScreen;
