import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { Barber } from '../types';
import { getBarberStatus } from '../services/availability';
import { requestWaitlist } from '../services/mock';
import RatingStars from './RatingStars';

interface BarberCardProps {
  barber: Barber;
  searchDate?: string;
  searchTime?: string;
  onPress?: () => void;
  style?: any;
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2; // 48 = padding + gap

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const BarberCard: React.FC<BarberCardProps> = ({
  barber,
  searchDate,
  searchTime,
  onPress,
  style,
}) => {
  const { theme } = useTheme();
  const [isInWaitlist, setIsInWaitlist] = useState(false);
  const [isWaitlistLoading, setIsWaitlistLoading] = useState(false);
  
  const scale = useSharedValue(1);
  
  // Calculate barber status
  const status = searchDate && searchTime 
    ? getBarberStatus(barber, searchDate, searchTime)
    : 'available';
  
  const isAvailable = status === 'available';
  const isFull = status === 'full';
  const isClosed = status === 'closed';
  
  const handlePress = () => {
    if (isClosed) return;
    
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    onPress?.();
  };
  
  const handleWaitlistPress = async () => {
    if (isWaitlistLoading) return;
    
    setIsWaitlistLoading(true);
    
    try {
      await requestWaitlist(
        barber.id,
        searchDate || '',
        searchTime || ''
      );
      
      setIsInWaitlist(!isInWaitlist);
      
      Alert.alert(
        'Başarılı',
        isInWaitlist 
          ? 'Bekleme listesinden çıkarıldınız.'
          : 'Bekleme listesine eklendiniz. Müsait olduğunda bildirim alacaksınız.'
      );
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsWaitlistLoading(false);
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }] as any,
    };
  });
  
  const getOverlayContent = () => {
    if (isClosed) {
      return (
        <View className="absolute inset-0 bg-black/60 rounded-2xl items-center justify-center">
          <Text className="text-white font-bold text-center px-4">
            Şu anda hizmet vermiyor
          </Text>
        </View>
      );
    }
    return null;
  };
  
  return (
    <AnimatedTouchableOpacity
      className="rounded-2xl overflow-hidden"
      style={[
        {
          width: cardWidth,
          aspectRatio: 0.95,
          minHeight: 220,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
          opacity: isFull && !isClosed ? 0.7 : 1,
        },
        animatedStyle,
        style,
      ]}
      onPress={handlePress}
      disabled={isClosed}
      activeOpacity={0.8}
    >
      {/* Image Container */}
      <View className="flex-1 relative">
        <Image
          source={{ uri: barber.imageUrl }}
          className="w-full h-full"
          style={{
            resizeMode: 'cover',
          } as any}
        />
        
        {/* Popular Badge */}
        {barber.isPopular && (
          <View
            className="absolute top-3 left-3 px-2 py-1 rounded-full"
            style={{ backgroundColor: theme.accent }}
          >
            <Text className="text-white text-xs font-bold">Popüler</Text>
          </View>
        )}
        
        {/* Overlay for closed/full states */}
        {getOverlayContent()}
      </View>
      
      {/* Content */}
      <View className="p-3">
        {/* Name and Rating */}
        <View className="mb-2">
          <Text
            className="font-bold text-base mb-1"
            style={{ color: theme.text }}
            numberOfLines={1}
          >
            {barber.name}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <RatingStars
              rating={barber.rating}
              size="small"
            />
            
            <Text
              className="text-xs"
              style={{ color: theme.muted }}
            >
              {barber.distanceKm} km
            </Text>
          </View>
        </View>
        
        {/* Action Button */}
        <View className="flex-row gap-2">
          {isFull && !isClosed ? (
            <TouchableOpacity
              className="flex-1 py-2 px-3 rounded-lg border"
              style={{
                backgroundColor: isInWaitlist ? theme.primary : 'transparent',
                borderColor: theme.primary,
              }}
              onPress={handleWaitlistPress}
              disabled={isWaitlistLoading}
            >
              <Text
                className="text-center text-xs font-medium"
                style={{
                  color: isInWaitlist ? 'white' : theme.primary,
                }}
              >
                {isWaitlistLoading 
                  ? 'Yükleniyor...' 
                  : isInWaitlist 
                    ? 'Listede' 
                    : 'Bildirim Al'
                }
              </Text>
            </TouchableOpacity>
          ) : null}
          
          <TouchableOpacity
            className={`py-2 px-3 rounded-lg ${isFull && !isClosed ? 'flex-1' : 'w-full'}`}
            style={{
              backgroundColor: isClosed ? theme.muted : theme.primary,
              minHeight: 32,
              justifyContent: 'center',
            }}
            onPress={handlePress}
            disabled={isClosed}
          >
            <Text
              className="text-center text-xs font-medium"
              style={{ color: 'white' }}
            >
              {isClosed ? 'Kapalı' : 'Detay'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default BarberCard;