import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import { IUsuario } from "../../ts/IUsuario";

interface Props {
  user: IUsuario;
  isFavorite?: boolean;
  isSelected?: boolean;
  canSelect?: boolean;
  onPressDetail?: () => void;
  onToggleFavorite?: () => void;
  onToggleSelect?: () => void;
}

export default function UserCard({
  user,
  isFavorite,
  isSelected,
  canSelect,
  onPressDetail,
  onToggleFavorite,
  onToggleSelect,
}: Props) {
  return (
    <View style={[styles.card, isSelected && styles.cardSelected]}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          isSelected && styles.checkboxSelected,
          !canSelect && !isSelected && styles.checkboxDisabled,
        ]}
        onPress={onToggleSelect}
        disabled={!canSelect && !isSelected}
        activeOpacity={0.7}
      >
        {isSelected && <View style={styles.checkmark} />}
      </TouchableOpacity>

      <View style={[styles.avatarRing, isSelected && styles.avatarRingSelected]}>
        <Image source={{ uri: user.picture.large }} style={styles.avatar} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {user.name.last}, {user.name.first}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
        <Text style={styles.location}>
          {user.location.city} · {user.location.country}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={onPressDetail}
          activeOpacity={0.8}
        >
          <Text style={styles.detailButtonText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
          ]}
          onPress={onToggleFavorite}
          activeOpacity={0.8}
        >
          <Heart
            size={16}
            color={isFavorite ? "#EF4444" : "#94A3B8"}
            fill={isFavorite ? "#EF4444" : "none"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  cardSelected: {
    backgroundColor: "#EFF6FF",
    borderLeftColor: "#3B82F6",
    shadowOpacity: 0.14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#3B82F6",
  },
  checkboxDisabled: {
    opacity: 0.35,
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  avatarRing: {
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    padding: 1,
  },
  avatarRingSelected: {
    borderColor: "#93C5FD",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E2E8F0",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  email: {
    fontSize: 11,
    color: "#64748B",
  },
  location: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailButton: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: "#3B82F6",
  },
  detailButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  favoriteButtonActive: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
});
