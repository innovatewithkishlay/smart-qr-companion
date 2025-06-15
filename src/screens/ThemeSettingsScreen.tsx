import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ThemeSettingsScreen = () => (
  <View style={styles.container}>
    <Ionicons
      name="color-palette-outline"
      size={60}
      color="#007bff"
      style={{ marginBottom: 20 }}
    />
    <Text style={styles.title}>Theme Settings</Text>
    <Text style={styles.text}>Theme switching coming soon!</Text>
    <TouchableOpacity style={styles.button} disabled>
      <Text style={styles.buttonText}>Switch to Dark Mode (soon)</Text>
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
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10, color: "#222" },
  text: { fontSize: 16, color: "#666", marginBottom: 30, textAlign: "center" },
  button: { backgroundColor: "#e9ecef", padding: 14, borderRadius: 10 },
  buttonText: { color: "#aaa", fontWeight: "bold" },
});

export default ThemeSettingsScreen;
