import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 22, fontWeight: "bold" },
});

export default SettingsScreen;
