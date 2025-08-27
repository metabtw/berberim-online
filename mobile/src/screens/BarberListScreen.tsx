import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/_layout';
import { useTheme } from '../theme/ThemeContext';
import { Barber } from '../types';
import { getBarbers } from '../services/mock';
import { sortBarbersByAvailability } from '../services/availability';
import BarberCard from '../components/BarberCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import Chip from '../components/Chip';

type BarberListScreenRouteProp = RouteProp<RootStackParamList, 'BarberList'>;
type BarberListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BarberList'>;

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2;

const BarberListScreen: React.FC = () => {
  const route = useRoute<BarberListScreenRouteProp>();
  const navigation = useNavigation<BarberListScreenNavigationProp>();
  const { theme } = useTheme();
  
  const { location, date, time } = route.params;
  
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const filters = [
    { key: 'all', label: 'Tümü' },
    { key: 'available', label: 'Müsait' },
    { key: 'popular', label: 'Popüler' },
    { key: 'nearby', label: 'Yakın' },
  ];
  
  const loadBarbers = async () => {
    try {
      const data = await getBarbers();
      
      // Filter by location if provided
      let filteredData = data;
      if (location) {
        filteredData = data.filter(barber => 
          barber.name.toLowerCase().includes(location.toLowerCase()) ||
          location.toLowerCase().includes('kadıköy') // Mock location filtering
        );
      }
      
      // Sort by availability if date and time provided
      if (date && time) {
        filteredData = sortBarbersByAvailability(filteredData, date, time);
      }
      
      setBarbers(filteredData);
    } catch (error) {
      console.error('Error loading barbers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadBarbers();
  }, [location, date, time]);
  
  const onRefresh = () => {
    setRefreshing(true);
    loadBarbers();
  };
  
  const filteredBarbers = useMemo(() => {
    let filtered = barbers;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(barber =>
        barber.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    switch (selectedFilter) {
      case 'available':
        // This would need availability check with date/time
        filtered = filtered.filter(barber => {
          if (!date || !time) return true;
          // Mock availability check
          return Math.random() > 0.3; // 70% available
        });
        break;
      case 'popular':
        filtered = filtered.filter(barber => barber.isPopular);
        break;
      case 'nearby':
        filtered = filtered.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [barbers, searchQuery, selectedFilter, date, time]);
  
  const handleBarberPress = (barber: Barber) => {
    navigation.navigate('BarberDetail', { barberId: barber.id });
  };
  
  const renderBarberCard = ({ item, index }: { item: Barber; index: number }) => (
    <BarberCard
      barber={item}
      searchDate={date}
      searchTime={time}
      onPress={() => handleBarberPress(item)}
      style={{
        marginBottom: 16,
        marginRight: index % 2 === 0 ? 8 : 0,
        marginLeft: index % 2 === 1 ? 8 : 0,
      }}
    />
  );
  
  const renderSkeletonCard = ({ index }: { index: number }) => (
    <SkeletonCard
      width={cardWidth}
      height={220}
      style={{
        marginBottom: 16,
        marginRight: index % 2 === 0 ? 8 : 0,
        marginLeft: index % 2 === 1 ? 8 : 0,
      }}
    />
  );
  
  const getItemLayout = (_: any, index: number) => ({
    length: 236, // 220 height + 16 margin
    offset: 236 * Math.floor(index / 2),
    index,
  });
  
  const keyExtractor = (item: Barber) => item.id;
  
  const renderHeader = () => (
    <View className="px-4 pb-4">
      {/* Search Results Info */}
      {(location || date || time) && (
        <View
          className="p-4 rounded-xl mb-4"
          style={{ backgroundColor: theme.card }}
        >
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: theme.muted }}
          >
            Arama Sonuçları
          </Text>
          
          <View className="flex-row flex-wrap gap-2">
            {location && (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: theme.primary + '20' }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: theme.primary }}
                >
                  📍 {location}
                </Text>
              </View>
            )}
            
            {date && (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: theme.primary + '20' }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: theme.primary }}
                >
                  📅 {new Date(date).toLocaleDateString('tr-TR')}
                </Text>
              </View>
            )}
            
            {time && (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: theme.primary + '20' }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: theme.primary }}
                >
                  🕐 {time}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Berber ara..."
      />
      
      {/* Filters */}
      <View className="mt-4">
        <Text
          className="text-sm font-medium mb-2"
          style={{ color: theme.muted }}
        >
          Filtrele
        </Text>
        
        <View className="flex-row gap-2">
          {filters.map((filter) => (
            <Chip
              key={filter.key}
              label={filter.label}
              selected={selectedFilter === filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              size="small"
            />
          ))}
        </View>
      </View>
      
      {/* Results Count */}
      <Text
        className="text-sm mt-4 mb-2"
        style={{ color: theme.muted }}
      >
        {filteredBarbers.length} berber bulundu
      </Text>
    </View>
  );
  
  if (loading) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: theme.background }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b" style={{ borderColor: theme.border }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3 p-1"
          >
            <Text style={{ color: theme.primary, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          
          <Text
            className="text-lg font-bold"
            style={{ color: theme.text }}
          >
            Berberler
          </Text>
        </View>
        
        {renderHeader()}
        
        {/* Loading Skeletons */}
        <FlatList
          data={Array.from({ length: 6 }, (_, i) => ({ id: i.toString() }))}
          renderItem={renderSkeletonCard}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderColor: theme.border }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3 p-1"
        >
          <Text style={{ color: theme.primary, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        
        <Text
          className="text-lg font-bold"
          style={{ color: theme.text }}
        >
          Berberler
        </Text>
      </View>
      
      {filteredBarbers.length === 0 ? (
        <View className="flex-1">
          {renderHeader()}
          <EmptyState
            title="Berber bulunamadı"
            description="Arama kriterlerinizi değiştirerek tekrar deneyin."
            icon="💇‍♂️"
            actionText="Filtreleri Temizle"
            onAction={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
          />
        </View>
      ) : (
        <FlatList
          data={filteredBarbers}
          renderItem={renderBarberCard}
          keyExtractor={keyExtractor}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 20 }}
          columnWrapperStyle={{
            paddingHorizontal: 16,
            justifyContent: 'space-between',
          }}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default BarberListScreen;