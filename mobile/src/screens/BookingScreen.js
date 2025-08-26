import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../styles/globalStyles';

const BookingScreen = ({ route, navigation }) => {
  const { barber } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [successVisible, setSuccessVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const dates = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 14; i += 1) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      list.push({
        key: d.toISOString(),
        label: d.toLocaleDateString('tr-TR', { weekday: 'short', day: '2-digit', month: 'short' }),
        value: d,
      });
    }
    return list;
  }, []);

  const services = [
    { id: 'hair', name: 'Saç Kesimi', price: 120 },
    { id: 'beard', name: 'Sakal Kesimi', price: 90 },
    { id: 'hair-beard', name: 'Saç + Sakal', price: 180 },
    { id: 'wash', name: 'Saç Yıkama', price: 40 },
  ];

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, id) => {
      const s = services.find(x => x.id === id);
      return sum + (s ? s.price : 0);
    }, 0);
  }, [selectedServices]);

  const confirmBooking = () => {
    if (!selectedDate || selectedServices.length === 0 || !selectedSlot) {
      Alert.alert('Eksik Bilgi', 'Lütfen tarih, saat ve en az bir hizmet seçin.');
      return;
    }
    setSuccessVisible(true);
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  const closeSuccess = () => {
    setSuccessVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu Al</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Barber Info */}
        <View style={styles.barberCard}>
          <Text style={styles.barberName}>{barber?.name || 'Seçilen Kuaför'}</Text>
          <View style={styles.barberMetaRow}>
            <Ionicons name="location" size={16} color={colors.secondary} />
            <Text style={styles.barberMetaText}>{barber?.distance || '—'}</Text>
            <Ionicons name="star" size={16} color={colors.accent} style={{ marginLeft: spacing.sm }} />
            <Text style={styles.barberMetaText}>{barber?.rating ?? '4.5'}</Text>
          </View>
          <Text style={styles.barberInfoText}>Açık saatler: 09:00 - 21:00 • Tahmini bekleme: 10-15 dk</Text>
        </View>

        {/* Date Selection */
        }
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarih Seçimi</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
            {dates.map((d) => (
              <TouchableOpacity
                key={d.key}
                onPress={() => setSelectedDate(d)}
                style={[styles.datePill, selectedDate?.key === d.key && styles.datePillActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.datePillText, selectedDate?.key === d.key && styles.datePillTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saat Seçimi</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
            {Array.from({ length: 12 }).map((_, idx) => {
              const hour = 9 + idx; // 09:00 - 20:00 start times for 1 saat blok
              const label = `${hour.toString().padStart(2,'0')}:00 - ${(hour+1).toString().padStart(2,'0')}:00`;
              const key = `${selectedDate?.key || 'no-date'}-${hour}`;
              const isActive = selectedSlot === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setSelectedSlot(key)}
                  style={[styles.timePill, isActive && styles.timePillActive, !selectedDate && styles.timePillDisabled]}
                  activeOpacity={selectedDate ? 0.8 : 1}
                  disabled={!selectedDate}
                >
                  <Text style={[styles.timePillText, isActive && styles.timePillTextActive, !selectedDate && styles.timePillTextDisabled]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {!selectedDate && (
            <Text style={styles.helperText}>Önce tarih seçin.</Text>
          )}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hizmetler</Text>
          <View style={styles.servicesList}>
            {services.map((s) => {
              const isActive = selectedServices.includes(s.id);
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => toggleService(s.id)}
                  activeOpacity={0.85}
                  style={[styles.serviceItem, isActive && styles.serviceItemActive]}
                >
                  <View style={styles.serviceLeft}>
                    <Text style={styles.serviceName}>{s.name}</Text>
                    <Text style={styles.servicePrice}>{`₺${s.price}`}</Text>
                  </View>
                  {isActive ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
                  ) : (
                    <Ionicons name="ellipse-outline" size={20} color={colors.lightGray} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity onPress={confirmBooking} activeOpacity={0.85} style={styles.submitContainer}>
          <LinearGradient colors={[colors.secondary, colors.accent]} style={styles.submitButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="calendar" size={18} color={colors.white} />
            <Text style={styles.submitText}>{`Randevu Oluştur${selectedServices.length ? ` • ${selectedServices.length} hizmet • ₺${totalPrice}` : ''}`}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Ionicons name="checkmark-circle" size={48} color={colors.secondary} />
            <Text style={styles.modalTitle}>Randevunuz başarıyla oluşturuldu</Text>
            <TouchableOpacity onPress={closeSuccess} style={styles.modalButton} activeOpacity={0.85}>
              <Text style={styles.modalButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { ...typography.h2, color: colors.textPrimary },
  content: { paddingBottom: spacing.xl },
  barberCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 16,
    padding: spacing.md,
    ...shadows.small,
  },
  barberName: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  barberMetaRow: { flexDirection: 'row', alignItems: 'center' },
  barberMetaText: { ...typography.caption, color: colors.textSecondary, marginLeft: spacing.xs },
  barberInfoText: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  section: { marginHorizontal: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  dateRow: { paddingRight: spacing.md },
  datePill: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  datePillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  datePillText: { ...typography.caption, color: colors.textSecondary },
  datePillTextActive: { color: colors.white, fontWeight: '600' },
  timePill: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  timePillActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  timePillDisabled: { opacity: 0.5 },
  timePillText: { ...typography.caption, color: colors.textSecondary },
  timePillTextActive: { color: colors.white, fontWeight: '600' },
  timePillTextDisabled: { color: colors.textPlaceholder },
  helperText: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  servicesList: { },
  serviceItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.small,
  },
  serviceItemActive: { borderColor: colors.primary },
  serviceLeft: { },
  serviceName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  servicePrice: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  submitContainer: { marginHorizontal: spacing.md, marginBottom: spacing.lg },
  submitButton: { borderRadius: 24, paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', ...shadows.medium },
  submitText: { ...typography.button, color: colors.white, marginLeft: spacing.xs, fontWeight: 'bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: colors.white, padding: spacing.lg, marginHorizontal: spacing.lg, borderRadius: 16, alignItems: 'center', ...shadows.large },
  modalTitle: { ...typography.body, color: colors.textPrimary, marginTop: spacing.sm, textAlign: 'center' },
  modalButton: { marginTop: spacing.md, backgroundColor: colors.primary, borderRadius: 20, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  modalButtonText: { ...typography.button, color: colors.white, fontWeight: 'bold' },
});

export default BookingScreen;


