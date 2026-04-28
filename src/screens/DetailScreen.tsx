import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Check } from 'lucide-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DetailRouteProp, DetailNavigationProp } from '../utils/navigation';
import { useIUsuarioContext } from '../context/UserContext';

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavigationProp>();
  const { user } = route.params;

  const { favorites, localPhones, toggleFavorite, updateLocalPhone } = useIUsuarioContext();

  const isFavorite = !!favorites[user.login.uuid];
  const savedPhone = localPhones[user.login.uuid] ?? '';

  const [phoneInput, setPhoneInput] = useState(savedPhone);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSaved, setPhoneSaved] = useState(false);

  const validateAndSave = () => {
    const trimmed = phoneInput.trim();
    if (!trimmed) {
      setPhoneError('El teléfono no puede estar vacío.');
      return;
    }
    if (trimmed.length < 7) {
      setPhoneError('Mínimo 7 caracteres.');
      return;
    }
    setPhoneError('');
    updateLocalPhone(user.login.uuid, trimmed);
    setPhoneSaved(true);
    setTimeout(() => setPhoneSaved(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={() => toggleFavorite(user.login.uuid)}
        >
          <Heart
            size={20}
            color={isFavorite ? '#EF4444' : '#94A3B8'}
            fill={isFavorite ? '#EF4444' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image source={{ uri: user.picture.large }} style={styles.avatar} />
          <Text style={styles.fullName}>{user.name.first} {user.name.last}</Text>
          <Text style={styles.lastName}>{user.name.title}</Text>
          <View style={styles.ageBadge}>
            <Text style={styles.ageBadgeText}>{user.dob.age} años</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información de contacto</Text>
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Teléfono original" value={user.phone} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <InfoRow label="Ciudad" value={user.location.city} />
          <InfoRow label="País" value={user.location.country} />
          <InfoRow label="Dirección" value={`${user.location.street.name} ${user.location.street.number}`} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Teléfono local</Text>
          {savedPhone ? (
            <View style={styles.savedPhoneRow}>
              <Text style={styles.savedPhoneLabel}>Guardado:</Text>
              <Text style={styles.savedPhoneValue}>{savedPhone}</Text>
            </View>
          ) : null}
          <TextInput
            style={[styles.input, phoneError ? styles.inputError : null]}
            placeholder="Ej: +593 99 999 9999"
            placeholderTextColor="#94A3B8"
            value={phoneInput}
            onChangeText={(t) => { setPhoneInput(t); setPhoneError(''); }}
            keyboardType="phone-pad"
            maxLength={20}
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
          {phoneSaved ? (
            <View style={styles.successRow}>
              <Check size={14} color="#16A34A" />
              <Text style={styles.successText}>Teléfono guardado</Text>
            </View>
          ) : null}
          <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
            <Text style={styles.saveButtonText}>
              {savedPhone ? 'Actualizar teléfono' : 'Guardar teléfono'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  favButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  favButtonActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  fullName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  lastName: {
    fontSize: 15,
    color: '#64748B',
  },
  ageBadge: {
    marginTop: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  ageBadgeText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  savedPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 8,
  },
  savedPhoneLabel: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  savedPhoneValue: {
    fontSize: 13,
    color: '#15803D',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  successText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
