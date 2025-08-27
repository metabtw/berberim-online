import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { getBarberById } from '../services/mock';
import { Barber, Service } from '../types';
import { RootStackParamList } from '../../app/_layout';
import RatingStars from '../components/RatingStars';
import Chip from '../components/Chip';

type BarberDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BarberDetail'>;
type BarberDetailScreenRouteProp = RouteProp<RootStackParamList, 'BarberDetail'>;

const BarberDetailScreen: React.FC = () => {
  const navigation = useNavigation<BarberDetailScreenNavigationProp>();
  const route = useRoute<BarberDetailScreenRouteProp>();
  const { theme, isDark } = useTheme();
  const { barberId } = route.params;
  
  const [barber, setBarber] = useState<Barber | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    loadBarberDetails();
  }, [barberId]);

  const loadBarberDetails = async () => {
    try {
      const barberData = await getBarberById(barberId);
      setBarber(barberData);
    } catch (error) {
      Alert.alert('Hata', 'Berber bilgileri yüklenemedi');
      navigation.goBack();
    }
  };

  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration, 0);
  };

  const handleBooking = () => {
    if (selectedServices.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir hizmet seçin');
      return;
    }
    setShowBookingModal(true);
  };

  const showSuccessMessage = () => {
    setShowSuccessPopup(true);
    Animated.sequence([
      Animated.timing(popupAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(popupAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccessPopup(false);
      navigation.goBack();
    });
  };

  const confirmBooking = () => {
    setShowBookingModal(false);
    // Kısa bir gecikme ile popup'ı göster
    setTimeout(() => {
      showSuccessMessage();
    }, 300);
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  if (!barber) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View className="flex-1 justify-center items-center">
          <Text style={{ color: theme.text }}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-3 border-b"
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4 p-2"
        >
          <Text style={{ color: theme.text, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text
          className="text-lg font-bold flex-1"
          style={{ color: theme.text }}
        >
          {barber.name}
        </Text>
        <TouchableOpacity className="p-2">
          <Text style={{ color: theme.text, fontSize: 18 }}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Image Gallery */}
        <View className="h-64 relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
              setCurrentImageIndex(index);
            }}
          >
            {barber.images?.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                className="w-full h-64"
                style={{ width: Platform.OS === 'web' ? 400 : undefined }}
                resizeMode="cover"
              />
            )) || (
              <View
                className="w-full h-64 justify-center items-center"
                style={{ backgroundColor: theme.muted + '20' }}
              >
                <Text style={{ color: theme.muted }}>Fotoğraf Yok</Text>
              </View>
            )}
          </ScrollView>
          
          {/* Image Indicators */}
          {barber.images && barber.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {barber.images.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Barber Info */}
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text
              className="text-2xl font-bold"
              style={{ color: theme.text }}
            >
              {barber.name}
            </Text>
            <View className="flex-row items-center">
              <RatingStars rating={barber.rating} size="small" />
              <Text
                className="ml-2 text-sm"
                style={{ color: theme.muted }}
              >
                ({barber.reviewCount})
              </Text>
            </View>
          </View>
          
          <Text
            className="text-base mb-2"
            style={{ color: theme.muted }}
          >
            📍 {barber.address}
          </Text>
          
          <Text
            className="text-base mb-4"
            style={{ color: theme.muted }}
          >
            📞 {barber.phone}
          </Text>
          
          {barber.description && (
            <Text
              className="text-base leading-6"
              style={{ color: theme.text }}
            >
              {barber.description}
            </Text>
          )}
        </View>

        {/* Services */}
        <View className="px-4 pb-4">
          <Text
            className="text-xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            Hizmetler
          </Text>
          
          {barber.services.map((service) => {
            const isSelected = selectedServices.find(s => s.id === service.id);
            return (
              <TouchableOpacity
                key={service.id}
                className={`p-4 rounded-xl mb-3 border ${
                  isSelected ? 'border-2' : 'border'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.primary + '10' : theme.card,
                  borderColor: isSelected ? theme.primary : theme.border,
                }}
                onPress={() => toggleService(service)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text
                      className="text-lg font-semibold mb-1"
                      style={{ color: theme.text }}
                    >
                      {service.name}
                    </Text>
                    <Text
                      className="text-sm mb-2"
                      style={{ color: theme.muted }}
                    >
                      {service.description}
                    </Text>
                    <View className="flex-row items-center">
                      <Text
                        className="text-base font-bold mr-4"
                        style={{ color: theme.primary }}
                      >
                        ₺{service.price}
                      </Text>
                      <Text
                        className="text-sm"
                        style={{ color: theme.muted }}
                      >
                        ⏱ {service.duration} dk
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected ? 'bg-primary' : ''
                    }`}
                    style={{
                      borderColor: isSelected ? theme.primary : theme.border,
                      backgroundColor: isSelected ? theme.primary : 'transparent',
                    }}
                  >
                    {isSelected && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Working Hours */}
        <View className="px-4 pb-4">
          <Text
            className="text-xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            Çalışma Saatleri
          </Text>
          
          <View
            className="p-4 rounded-xl"
            style={{ backgroundColor: theme.card }}
          >
            {Object.entries(barber.workingHours).map(([day, hours]) => (
              <View key={day} className="flex-row justify-between py-2">
                <Text
                  className="text-base"
                  style={{ color: theme.text }}
                >
                  {day}
                </Text>
                <Text
                  className="text-base"
                  style={{ color: theme.muted }}
                >
                  {hours}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Section */}
      {selectedServices.length > 0 && (
        <View
          className="p-4 border-t"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text
                className="text-lg font-bold"
                style={{ color: theme.text }}
              >
                ₺{getTotalPrice()}
              </Text>
              <Text
                className="text-sm"
                style={{ color: theme.muted }}
              >
                {getTotalDuration()} dakika • {selectedServices.length} hizmet
              </Text>
            </View>
            <TouchableOpacity
              className="px-6 py-3 rounded-xl"
              style={{ backgroundColor: theme.primary }}
              onPress={handleBooking}
            >
              <Text className="text-white font-semibold text-base">
                Randevu Al
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: theme.card, maxHeight: '80%' }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-xl font-bold"
                style={{ color: theme.text }}
              >
                Randevu Al
              </Text>
              <TouchableOpacity
                onPress={() => setShowBookingModal(false)}
                className="p-2"
              >
                <Text style={{ color: theme.muted, fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Selected Services */}
              <View className="mb-6">
                <Text
                  className="text-lg font-semibold mb-3"
                  style={{ color: theme.text }}
                >
                  Seçilen Hizmetler
                </Text>
                {selectedServices.map((service) => (
                  <View
                    key={service.id}
                    className="flex-row justify-between items-center py-2"
                  >
                    <Text style={{ color: theme.text }}>{service.name}</Text>
                    <Text style={{ color: theme.primary }}>₺{service.price}</Text>
                  </View>
                ))}
                <View className="border-t pt-2 mt-2" style={{ borderColor: theme.border }}>
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="font-bold"
                      style={{ color: theme.text }}
                    >
                      Toplam
                    </Text>
                    <Text
                      className="font-bold text-lg"
                      style={{ color: theme.primary }}
                    >
                      ₺{getTotalPrice()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Date Selection */}
              <View className="mb-6">
                <Text
                  className="text-lg font-semibold mb-3"
                  style={{ color: theme.text }}
                >
                  Tarih Seçin
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const dateStr = date.toISOString().split('T')[0];
                      const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
                      const dayNum = date.getDate();
                      
                      return (
                        <TouchableOpacity
                          key={i}
                          className={`p-3 rounded-xl items-center min-w-16 ${
                            selectedDate === dateStr ? 'bg-primary' : ''
                          }`}
                          style={{
                            backgroundColor: selectedDate === dateStr ? theme.primary : theme.background,
                            borderWidth: 1,
                            borderColor: theme.border,
                          }}
                          onPress={() => setSelectedDate(dateStr)}
                        >
                          <Text
                            className="text-xs mb-1"
                            style={{
                              color: selectedDate === dateStr ? 'white' : theme.muted
                            }}
                          >
                            {dayName}
                          </Text>
                          <Text
                            className="text-lg font-bold"
                            style={{
                              color: selectedDate === dateStr ? 'white' : theme.text
                            }}
                          >
                            {dayNum}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              {/* Time Selection */}
              {selectedDate && (
                <View className="mb-6">
                  <Text
                    className="text-lg font-semibold mb-3"
                    style={{ color: theme.text }}
                  >
                    Saat Seçin
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {timeSlots.map((time) => (
                      <Chip
                        key={time}
                        label={time}
                        selected={selectedTime === time}
                        onPress={() => setSelectedTime(time)}
                        size="small"
                      />
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Confirm Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl items-center mt-4 ${
                selectedDate && selectedTime ? '' : 'opacity-50'
              }`}
              style={{ backgroundColor: theme.primary }}
              onPress={confirmBooking}
              disabled={!selectedDate || !selectedTime}
            >
              <Text className="text-white font-bold text-lg">
                Randevuyu Onayla
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Modal
          visible={showSuccessPopup}
          transparent
          animationType="none"
        >
          <View className="flex-1 justify-center items-center px-8" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
              <Animated.View
                className="w-full max-w-sm px-10 py-12 items-center"
               style={{
                 backgroundColor: theme.card,
                 borderRadius: 24,
                 shadowColor: '#000',
                 shadowOffset: {
                   width: 0,
                   height: 10,
                 },
                 shadowOpacity: 0.25,
                 shadowRadius: 20,
                 elevation: 10,
                 transform: [
                   {
                     scale: popupAnimation.interpolate({
                       inputRange: [0, 1],
                       outputRange: [0.8, 1],
                     }),
                   },
                   {
                     translateY: popupAnimation.interpolate({
                       inputRange: [0, 1],
                       outputRange: [50, 0],
                     }),
                   },
                 ],
                 opacity: popupAnimation,
               }}
             >
              <View
                 className="w-20 h-20 rounded-full items-center justify-center mb-6"
                 style={{ 
                   backgroundColor: '#10B981',
                   shadowColor: '#10B981',
                   shadowOffset: {
                     width: 0,
                     height: 4,
                   },
                   shadowOpacity: 0.3,
                   shadowRadius: 8,
                   elevation: 6,
                 }}
               >
                 <Text className="text-white text-3xl font-bold">✓</Text>
               </View>
               
               <Text
                 className="text-2xl font-bold mb-3 text-center"
                 style={{ color: theme.text }}
               >
                 🎉 Randevunuz Oluşturuldu!
               </Text>
               
               <View
                  className="bg-opacity-10 px-6 py-4 rounded-xl mb-6 w-full"
                  style={{ backgroundColor: theme.primary + '15' }}
                >
                 <Text
                   className="text-lg font-semibold text-center mb-1"
                   style={{ color: theme.primary }}
                 >
                   {selectedDate && selectedTime && (
                     `${new Date(selectedDate).toLocaleDateString('tr-TR', {
                       day: 'numeric',
                       month: 'long',
                       year: 'numeric'
                     })}`
                   )}
                 </Text>
                 <Text
                   className="text-xl font-bold text-center"
                   style={{ color: theme.primary }}
                 >
                   {selectedTime}
                 </Text>
               </View>
               
               <Text
                  className="text-base text-center leading-6 px-2"
                  style={{ color: theme.muted }}
                >
                  <Text style={{ color: theme.text, fontWeight: '600' }}>{barber?.name}</Text> ile randevunuz başarıyla oluşturuldu. Randevu saatinizden 15 dakika önce hazır olmanızı rica ederiz.
                </Text>
            </Animated.View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default BarberDetailScreen;