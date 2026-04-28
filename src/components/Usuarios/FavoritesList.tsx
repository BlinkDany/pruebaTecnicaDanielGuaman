import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import FavoriteCard from "./FavoriteCard";
import { IUsuario } from "../../ts/IUsuario";

interface Props {
  favorites: IUsuario[];
  onPressUser: (user: IUsuario) => void;
}

export default function FavoritesList({ favorites, onPressUser }: Props) {
  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aún no tienes favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Favoritos</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{favorites.length}</Text>
        </View>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.login.uuid}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <FavoriteCard user={item} onPress={() => onPressUser(item)} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  countBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },
  list: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#94A3B8",
    fontStyle: "italic",
  },
});
