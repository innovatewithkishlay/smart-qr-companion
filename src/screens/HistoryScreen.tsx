import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getHistory, toggleFavorite } from "../utils/history";
import { QrHistoryItem } from "../types/QrHistory";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";

const HistoryScreen = () => {
  const [history, setHistory] = useState<QrHistoryItem[]>([]);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFavorite = async (id: string) => {
    await toggleFavorite(id);
    loadHistory();
  };

  const renderItem = ({ item }: { item: QrHistoryItem }) => (
    <View style={styles.item}>
      <QRCode
        value={item.value}
        size={60}
        color={item.color}
        backgroundColor={item.bgColor}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text numberOfLines={1} style={{ fontWeight: "bold" }}>
          {item.type.toUpperCase()}
        </Text>
        <Text numberOfLines={1}>{item.value}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      </View>
      <TouchableOpacity onPress={() => handleFavorite(item.id)}>
        <Ionicons
          name={item.favorite ? "star" : "star-outline"}
          size={28}
          color="#ffc107"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Recent QR Codes
      </Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            No history yet.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});

export default HistoryScreen;
