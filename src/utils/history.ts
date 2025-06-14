import AsyncStorage from "@react-native-async-storage/async-storage";
import { QrHistoryItem } from "../types/QrHistory";

const HISTORY_KEY = "qr_history";

export const getHistory = async (): Promise<QrHistoryItem[]> => {
  const json = await AsyncStorage.getItem(HISTORY_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveHistory = async (history: QrHistoryItem[]) => {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const addToHistory = async (item: QrHistoryItem) => {
  let history = await getHistory();
  history = [item, ...history.filter((h) => h.id !== item.id)];
  if (history.length > 10) history = history.slice(0, 10);
  await saveHistory(history);
};

export const toggleFavorite = async (id: string) => {
  let history = await getHistory();
  history = history.map((item) =>
    item.id === id ? { ...item, favorite: !item.favorite } : item
  );
  await saveHistory(history);
};
