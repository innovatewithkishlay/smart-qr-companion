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

const SettingsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const openPrivacyPolicy = () => {
    Linking.openURL("https://yourwebsite.com/privacy").catch(() =>
      Alert.alert("Error", "Could not open Privacy Policy.")
    );
  };

  const openSupportEmail = () => {
    Linking.openURL(
      "mailto:support@yourapp.com?subject=Support%20Request"
    ).catch(() => Alert.alert("Error", "Could not open mail client."));
  };

  const settings = [
    {
      icon: "color-palette-outline",
      label: "Theme",
      value: "Light",
      onPress: () => navigation.navigate("ThemeSettings"),
    },
    {
      icon: "lock-closed-outline",
      label: "Privacy Policy",
      onPress: openPrivacyPolicy,
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        {settings.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.row,
              idx === settings.length - 1 ? { borderBottomWidth: 0 } : {},
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon as any} size={22} color="#007bff" />
            <Text style={styles.label}>{item.label}</Text>
            {item.value && <Text style={styles.value}>{item.value}</Text>}
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#bbb"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.version}>Smart QR Companion v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    color: "#222",
    marginLeft: 16,
    fontWeight: "500",
  },
  value: {
    marginLeft: "auto",
    fontSize: 15,
    color: "#007bff",
    fontWeight: "500",
  },
  version: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 14,
    marginTop: 30,
    letterSpacing: 1,
  },
});

export default SettingsScreen;
