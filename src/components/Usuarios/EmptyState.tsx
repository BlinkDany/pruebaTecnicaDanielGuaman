import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>👥</Text>
      <Text style={styles.title}>Sin usuarios</Text>
      <Text style={styles.subtitle}>No hay usuarios disponibles en este momento.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
