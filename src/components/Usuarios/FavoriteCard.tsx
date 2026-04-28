import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { IUsuario } from "../../ts/IUsuario";

interface Props {
  user: IUsuario;
  onPress: () => void;
}

export default function FavoriteCard({ user, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: user.picture.large }} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {user.name.first}
      </Text>
      <Text style={styles.lastName} numberOfLines={1}>
        {user.name.last}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 80,
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
    backgroundColor: "#CBD5E1",
  },
  name: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  lastName: {
    fontSize: 10,
    color: "#64748B",
    textAlign: "center",
  },
});
