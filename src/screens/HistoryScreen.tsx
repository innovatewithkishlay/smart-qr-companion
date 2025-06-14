import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getHistory, toggleFavorite } from "../utils/history";
import { QrHistoryItem } from "../types/QrHistory";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";

const HistoryScreen = () => {
  const [history, setHistory] = useState<QrHistoryItem[]>([]);
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "HistoryMain">>();

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadHistory);
    return unsubscribe;
  }, [navigation]);

  const handleFavorite = async (id: string) => {
    await toggleFavorite(id);
    loadHistory();
  };

  const renderItem = ({ item }: { item: QrHistoryItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("QrDetail", item)}
    >
      {item.type === "image" ? (
        <Image
          source={{ uri: item.value }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <QRCode
          value={item.value}
          size={60}
          color={item.color}
          backgroundColor={item.bgColor}
        />
      )}
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.typeText}>
          {item.type.toUpperCase()}
        </Text>
        <Text numberOfLines={1} style={styles.valueText}>
          {item.type === "image" ? "Image QR Code" : item.value}
        </Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleFavorite(item.id)}
        style={styles.favoriteButton}
      >
        <Ionicons
          name={item.favorite ? "star" : "star-outline"}
          size={28}
          color="#ffc107"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent QR Codes</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No history yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1a1a1a",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  typeText: {
    fontWeight: "600",
    color: "#2c3e50",
    fontSize: 14,
  },
  valueText: {
    color: "#7f8c8d",
    fontSize: 14,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyText: {
    color: "#bdc3c7",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});

export default HistoryScreen;
