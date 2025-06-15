import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AboutScreen = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Ionicons
      name="information-circle-outline"
      size={60}
      color="#007bff"
      style={{ marginBottom: 20, alignSelf: "center" }}
    />
    <Text style={styles.title}>About App</Text>
    <Text style={styles.text}>
      <Text style={styles.bold}>Smart QR Companion</Text> v1.0.0{"\n"}A modern
      tool to generate, scan, and manage QR codes for text, links, contacts,
      Wi-Fi, and images.{"\n\n"}
      Built with React Native & Expo, focusing on fast performance, smooth UI,
      and cross-platform support.
    </Text>

    <Text style={styles.title}>About Developer</Text>
    <View style={styles.devSection}>
      <Ionicons
        name="person-circle-outline"
        size={48}
        color="#28a745"
        style={{ marginBottom: 8 }}
      />
      <Text style={styles.devName}>Kishlay Kumar</Text>
      <Text style={styles.devRole}>Full Stack Developer</Text>
      <Text style={styles.devBio}>
        Experienced in web, and backend development. Passionate about building
        scalable, user-friendly applications with a focus on UI/UX and modern
        technologies.
      </Text>
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() =>
            Linking.openURL("https://www.linkedin.com/in/kishlaykumar1")
          }
        >
          <Ionicons name="logo-linkedin" size={22} color="#0a66c2" />
          <Text style={styles.socialText}>LinkedIn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => Linking.openURL("https://instagram.com/kishlay_012")}
        >
          <Ionicons name="logo-instagram" size={22} color="#e1306c" />
          <Text style={styles.socialText}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => Linking.openURL("https://twitter.com/kishlay_012")}
        >
          <Ionicons name="logo-twitter" size={22} color="#1da1f2" />
          <Text style={styles.socialText}>Twitter</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { padding: 24, alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
    marginTop: 18,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
    color: "#444",
    marginBottom: 18,
    lineHeight: 22,
    alignSelf: "flex-start",
  },
  bold: { fontWeight: "bold", color: "#222" },
  devSection: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  devName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  devRole: {
    fontSize: 15,
    color: "#28a745",
    marginBottom: 8,
    fontWeight: "600",
  },
  devBio: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 20,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  socialText: {
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
});

export default AboutScreen;
