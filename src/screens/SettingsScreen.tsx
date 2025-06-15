import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const SettingsScreen = () => {
  const { theme, mode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const openSupportEmail = () => {
    Linking.openURL(
      "mailto:kishlay141@gmail.com?subject=Support%20Request"
    ).catch(() => Alert.alert("Error", "Could not open mail client."));
  };

  const settings = [
    {
      icon: "color-palette-outline",
      label: "Theme",
      value: mode === "light" ? "Light" : "Dark",
      onPress: () => navigation.navigate("ThemeSettings"),
    },
    {
      icon: "information-circle-outline",
      label: "About",
      onPress: () => navigation.navigate("AboutScreen"),
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      onPress: openSupportEmail,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {settings.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.row,
                { backgroundColor: theme.card },
                idx === settings.length - 1 ? { borderBottomWidth: 0 } : {},
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={theme.primary}
              />
              <Text style={[styles.label, { color: theme.text }]}>
                {item.label}
              </Text>
              {item.value && (
                <Text style={[styles.value, { color: theme.primary }]}>
                  {item.value}
                </Text>
              )}
              <Ionicons
                name="chevron-forward"
                size={20}
                color={mode === "dark" ? "#666" : "#bbb"}
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.version, { color: theme.text + "99" }]}>
          Smart QR Companion v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 0,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: "500",
  },
  value: {
    marginLeft: "auto",
    fontSize: 15,
    fontWeight: "500",
  },
  version: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 30,
    letterSpacing: 1,
  },
});

export default SettingsScreen;
