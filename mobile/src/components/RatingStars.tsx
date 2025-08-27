import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  showNumber?: boolean;
  color?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'medium',
  showNumber = true,
  color,
}) => {
  const { theme } = useTheme();
  
  const starColor = color || '#FFD700'; // Gold color for stars
  const emptyStarColor = theme.border;
  
  const sizeMap = {
    small: 12,
    medium: 16,
    large: 20,
  };
  
  const starSize = sizeMap[size];
  
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text
          key={`full-${i}`}
          style={{
            fontSize: starSize,
            color: starColor,
            lineHeight: starSize + 2,
          }}
        >
          ★
        </Text>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <View key="half" style={{ position: 'relative' }}>
          <Text
            style={{
              fontSize: starSize,
              color: emptyStarColor,
              lineHeight: starSize + 2,
            }}
          >
            ★
          </Text>
          <Text
            style={{
              fontSize: starSize,
              color: starColor,
              lineHeight: starSize + 2,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              overflow: 'hidden',
            }}
          >
            ★
          </Text>
        </View>
      );
    }
    
    // Empty stars
    const emptyStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text
          key={`empty-${i}`}
          style={{
            fontSize: starSize,
            color: emptyStarColor,
            lineHeight: starSize + 2,
          }}
        >
          ★
        </Text>
      );
    }
    
    return stars;
  };
  
  return (
    <View className="flex-row items-center">
      <View className="flex-row items-center">
        {renderStars()}
      </View>
      {showNumber && (
        <Text
          className={`ml-1 ${
            size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'
          }`}
          style={{ color: theme.muted }}
        >
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

export default RatingStars;