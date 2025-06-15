import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const ThemeSettingsScreen = () => {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Ionicons
        name="color-palette-outline"
        size={60}
        color={theme.primary}
        style={{ marginBottom: 20 }}
      />
      <Text style={[styles.title, { color: theme.text }]}>Theme Settings</Text>
      <Text style={[styles.text, { color: theme.text }]}>
        Current: {mode === "light" ? "Light" : "Dark"} Mode
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.card }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.buttonText, { color: theme.primary }]}>
          Switch to {mode === "light" ? "Dark" : "Light"} Mode
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 30, textAlign: "center" },
  button: { padding: 14, borderRadius: 10 },
  buttonText: { fontWeight: "bold" },
});

export default ThemeSettingsScreen;
