import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TextInputChangeEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, ArrowUp } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useIUsuarioContext } from "../context/UserContext";
import { HomeNavigationProp } from "../utils/navigation";
import UserCard from "../components/Usuarios/UserCard";
import FavoritesList from "../components/Usuarios/FavoritesList";
import LoadingState from "../components/Usuarios/LoadingState";
import ErrorState from "../components/Usuarios/ErrorState";
import EmptyState from "../components/Usuarios/EmptyState";
import { useUsuariosListado } from "../services/usuario/useUsuariosListado";
import { IUsuario } from "../ts/IUsuario";

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();

  const [buscador, setBuscador] = useState<String>("");

  const {
    data,
    isLoading: loadingUsuarios,
    isError: errorUsuarios,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useUsuariosListado({ page: 1 });

  const {
    favorites,
    selectedIds,
    toggleFavorite,
    toggleSelectedOrdered,
    selectAll,
    clearSelection,
    addManyFavorites,
  } = useIUsuarioContext();

  const usuarios = useMemo(() => {
    const lista = data?.pages.flatMap((p) => p.results) ?? [];
    return [...lista].sort((a, b) => a.name.last.localeCompare(b.name.last));
  }, [data]);

  const usuariosFavortios = useMemo(
    () => usuarios.filter((u) => favorites[u.login.uuid]),
    [usuarios, favorites]
  );

  const usuariosFiltraods = useMemo(() => {
    if (buscador === "") return usuarios;
    return usuarios.filter((u) =>
      u.name.last.toLowerCase().includes(buscador.toLowerCase())
    );
  }, [buscador, usuarios]);

  const usuarioPuedeSelected = useCallback(
    (userId: string): boolean => {
      const index = usuariosFiltraods.findIndex((u) => u.login.uuid === userId);
      if (index === -1) return false;
      if (selectedIds.includes(userId)) return true;
      if (index === 0) return true;
      return selectedIds.includes(usuariosFiltraods[index - 1].login.uuid);
    },
    [usuariosFiltraods, selectedIds]
  );

  const handleSeleccionarTodo = useCallback(() => {
    if (selectedIds.length === usuariosFiltraods.length) {
      clearSelection();
    } else {
      selectAll(usuariosFiltraods);
    }
  }, [usuariosFiltraods, selectedIds, selectAll, clearSelection]);

  const handleAgregarSeleccionados = useCallback(() => {
    addManyFavorites(selectedIds);
    clearSelection();
  }, [selectedIds, addManyFavorites, clearSelection]);

  const handleDetalles = useCallback(
    (user: IUsuario) => navigation.navigate("Detail", { user }),
    [navigation]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allSelected =
    usuariosFiltraods.length > 0 &&
    selectedIds.length === usuariosFiltraods.length;

  const handleChangeBuscador = useCallback((event: TextInputChangeEvent) => {
    setBuscador(event.nativeEvent.text);
  }, []);

  const renderItem = useCallback(
    (item: IUsuario) => (
      <UserCard
        user={item}
        isFavorite={!!favorites[item.login.uuid]}
        isSelected={selectedIds.includes(item.login.uuid)}
        canSelect={usuarioPuedeSelected(item.login.uuid)}
        onPressDetail={() => handleDetalles(item)}
        onToggleFavorite={() => toggleFavorite(item.login.uuid)}
        onToggleSelect={() =>
          toggleSelectedOrdered(item.login.uuid, usuariosFiltraods)
        }
      />
    ),
    [
      favorites,
      selectedIds,
      usuarioPuedeSelected,
      handleDetalles,
      toggleFavorite,
      toggleSelectedOrdered,
      usuariosFiltraods,
    ]
  );

  if (loadingUsuarios) return <LoadingState />;
  if (errorUsuarios) return <ErrorState onRetry={refetch} />;
  // if (!loadingUsuarios && usuariosFiltraods.length === 0) return <EmptyState />;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Listado de usuarios</Text>
          <Text style={styles.headerSubtitle}>
            {usuariosFiltraods.length} usuarios cargados
          </Text>
        </View>
        {selectedIds.length > 0 && (
          <TouchableOpacity
            style={styles.addFavButton}
            onPress={handleAgregarSeleccionados}
          >
            <View style={styles.addFavButtonInner}>
              <Heart size={14} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.addFavButtonText}>
                {selectedIds.length} a favoritos
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={usuariosFiltraods}
        keyExtractor={(item) => item.login.uuid}
        renderItem={(item) => renderItem(item.item)}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !loadingUsuarios}
            onRefresh={refetch}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        ListHeaderComponent={
          <>
            <FavoritesList
              favorites={usuariosFavortios}
              onPressUser={handleDetalles}
            />
            <View style={styles.listHeader}>
              <TouchableOpacity
                style={styles.selectAllRow}
                onPress={handleSeleccionarTodo}
              >
                <View
                  style={[
                    styles.checkbox,
                    allSelected && styles.checkboxSelected,
                  ]}
                >
                  {allSelected && <View style={styles.checkmark} />}
                </View>
                <Text style={styles.selectAllText}>Seleccionar todos</Text>
                {selectedIds.length > 0 && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>
                      {selectedIds.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.sortChip}>
                <Text style={styles.orderLabel}>Apellido</Text>
                <ArrowUp size={13} color="#1E293B" />
              </View>
            </View>
            <View style={styles.inputSearch}>
              <TextInput
                placeholder="Buscar usuarios..."
                onChange={handleChangeBuscador}
              />
            </View>
          </>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.footerText}>Cargando más...</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#c0c0c0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#ececec",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 3,
    fontWeight: "400",
  },
  addFavButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 22,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  addFavButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addFavButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F0F4F8",
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#3B82F6",
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  selectAllText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  selectedBadge: {
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  selectedBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  orderLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  listContent: {
    backgroundColor: "#F0F4F8",
    paddingVertical: 8,
    paddingBottom: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  inputSearch: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 1,
    paddingHorizontal: 1,
    marginHorizontal: 10,
    fontSize: 12,
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },
});
