import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/_layout';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { useTheme } from '../theme/ThemeContext';
import SearchBar from '../components/SearchBar';
import Chip from '../components/Chip';

// Conditionally import BottomSheet only for native platforms
let BottomSheet: any = null;
let BottomSheetView: any = null;
if (Platform.OS !== 'web') {
  const bottomSheetModule = require('@gorhom/bottom-sheet');
  BottomSheet = bottomSheetModule.default;
  BottomSheetView = bottomSheetModule.BottomSheetView;
}

dayjs.locale('tr');

interface SearchParams {
  location: string;
  date: string;
  time: string;
}

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { theme, toggleTheme, isDark } = useTheme();
  const bottomSheetRef = useRef<typeof BottomSheet>(null);
  
  // Search state
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['25%', '70%'], []);
  
  // Time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];
  
  // Popular locations
  const popularLocations = [
    'Kadıköy', 'Beşiktaş', 'Şişli', 'Bakırköy', 'Ataşehir', 'Üsküdar'
  ];

  const handleDatePress = useCallback(() => {
    if (Platform.OS === 'web') {
      setShowCalendarModal(true);
    } else {
      bottomSheetRef.current?.expand();
    }
  }, []);

  const handleDateSelect = useCallback((date: dayjs.Dayjs) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    if (Platform.OS === 'web') {
      setShowCalendarModal(false);
    } else {
      bottomSheetRef.current?.close();
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (!location || !selectedDate || !selectedTime) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    
    const searchParams: SearchParams = {
      location,
      date: selectedDate,
      time: selectedTime,
    };
    
    navigation.navigate('BarberList', searchParams);
  }, [location, selectedDate, selectedTime, navigation]);

  const isSearchEnabled = location && selectedDate && selectedTime;

  // Calendar rendering
  const renderCalendar = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');
    
    const days = [];
    let day = startDate;
    
    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }
    
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return (
      <View className="p-4">
        {/* Calendar Header */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            onPress={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
            className="p-2"
          >
            <Text style={{ color: theme.primary, fontSize: 18 }}>‹</Text>
          </TouchableOpacity>
          
          <Text
            className="text-lg font-bold"
            style={{ color: theme.text }}
          >
            {currentMonth.format('MMMM YYYY')}
          </Text>
          
          <TouchableOpacity
            onPress={() => setCurrentMonth(currentMonth.add(1, 'month'))}
            className="p-2"
          >
            <Text style={{ color: theme.primary, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        </View>
        
        {/* Day headers */}
        <View className="flex-row mb-2">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((dayName) => (
            <View key={dayName} className="flex-1 items-center py-2">
              <Text
                className="text-sm font-medium"
                style={{ color: theme.muted }}
              >
                {dayName}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row">
            {week.map((day) => {
              const isToday = day.isSame(dayjs(), 'day');
              const isSelected = selectedDate === day.format('YYYY-MM-DD');
              const isCurrentMonth = day.isSame(currentMonth, 'month');
              const isPast = day.isBefore(dayjs(), 'day');
              
              return (
                <TouchableOpacity
                  key={day.format('YYYY-MM-DD')}
                  className="flex-1 items-center py-3"
                  onPress={() => !isPast && handleDateSelect(day)}
                  disabled={isPast}
                >
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      isSelected ? 'bg-primary' : isToday ? 'border border-primary' : ''
                    }`}
                    style={{
                      backgroundColor: isSelected ? theme.primary : 'transparent',
                      borderColor: isToday && !isSelected ? theme.primary : 'transparent',
                      borderWidth: isToday && !isSelected ? 1 : 0,
                    }}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected ? 'text-white font-bold' : 
                        isToday ? 'font-bold' : 
                        isPast ? 'opacity-30' : ''
                      }`}
                      style={{
                        color: isSelected ? 'white' : 
                               isToday ? theme.primary : 
                               !isCurrentMonth ? theme.muted : 
                               theme.text
                      }}
                    >
                      {day.format('D')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text
          className="text-2xl font-bold"
          style={{ color: theme.text }}
        >
          Randevu Ara
        </Text>
        
        <TouchableOpacity
          onPress={toggleTheme}
          className="p-2 rounded-full"
          style={{ backgroundColor: theme.card }}
        >
          <Text className="text-lg">{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 px-4">
        {/* Main Search Card */}
        <View
          className="rounded-2xl p-6 mb-6 shadow-sm"
          style={{
            backgroundColor: theme.card,
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {/* Location */}
          <View className="mb-4">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: theme.muted }}
            >
              Konum
            </Text>
            <SearchBar
              value={location}
              onChangeText={setLocation}
              placeholder="Şehir veya semt seçin"
              leftIcon={<Text style={{ color: theme.muted }}>📍</Text>}
            />
          </View>
          
          {/* Popular Locations */}
          {!location && (
            <View className="mb-4">
              <Text
                className="text-sm font-medium mb-2"
                style={{ color: theme.muted }}
              >
                Popüler Konumlar
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {popularLocations.map((loc) => (
                  <Chip
                    key={loc}
                    label={loc}
                    onPress={() => setLocation(loc)}
                    variant="outline"
                    size="small"
                  />
                ))}
              </View>
            </View>
          )}
          
          {/* Date */}
          <View className="mb-4">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: theme.muted }}
            >
              Tarih
            </Text>
            <SearchBar
              value={selectedDate ? dayjs(selectedDate).format('DD MMMM YYYY') : ''}
              onChangeText={() => {}}
              placeholder="Tarih seçin"
              onPress={handleDatePress}
              editable={false}
              leftIcon={<Text style={{ color: theme.muted }}>📅</Text>}
              rightIcon={<Text style={{ color: theme.muted }}>▼</Text>}
            />
          </View>
          
          {/* Time */}
          <View className="mb-6">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: theme.muted }}
            >
              Saat
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              <View className="flex-row gap-2 pr-4">
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
            </ScrollView>
          </View>
          
          {/* Search Button */}
          <TouchableOpacity
            className={`py-4 rounded-xl items-center ${
              isSearchEnabled ? '' : 'opacity-50'
            }`}
            style={{
              backgroundColor: theme.primary,
            }}
            onPress={handleSearch}
            disabled={!isSearchEnabled}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">
              RANDEVU ARA
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <View className="mb-6">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: theme.text }}
          >
            Hızlı İşlemler
          </Text>
          
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 p-4 rounded-xl items-center"
              style={{ backgroundColor: theme.card }}
            >
              <Text className="text-2xl mb-2">⭐</Text>
              <Text
                className="text-sm font-medium text-center"
                style={{ color: theme.text }}
              >
                Favorilerim
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 p-4 rounded-xl items-center"
              style={{ backgroundColor: theme.card }}
            >
              <Text className="text-2xl mb-2">📅</Text>
              <Text
                className="text-sm font-medium text-center"
                style={{ color: theme.text }}
              >
                Randevularım
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 p-4 rounded-xl items-center"
              style={{ backgroundColor: theme.card }}
            >
              <Text className="text-2xl mb-2">🔔</Text>
              <Text
                className="text-sm font-medium text-center"
                style={{ color: theme.text }}
              >
                Bildirimler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Calendar Bottom Sheet / Modal */}
      {Platform.OS === 'web' ? (
        <Modal
          visible={showCalendarModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
              className="rounded-t-3xl"
              style={{ backgroundColor: theme.card, maxHeight: '70%' }}
            >
              <View className="px-4 py-4 border-b" style={{ borderColor: theme.border }}>
                <View className="flex-row justify-between items-center">
                  <Text
                    className="text-lg font-bold"
                    style={{ color: theme.text }}
                  >
                    Tarih Seçin
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCalendarModal(false)}
                    className="p-2"
                  >
                    <Text style={{ color: theme.muted, fontSize: 18 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
                {renderCalendar()}
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : (
        BottomSheet && (
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: theme.card }}
            handleIndicatorStyle={{ backgroundColor: theme.muted }}
          >
            <BottomSheetView>
              <View className="px-4 py-2 border-b" style={{ borderColor: theme.border }}>
                <Text
                  className="text-lg font-bold text-center"
                  style={{ color: theme.text }}
                >
                  Tarih Seçin
                </Text>
              </View>
              {renderCalendar()}
            </BottomSheetView>
          </BottomSheet>
        )
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;