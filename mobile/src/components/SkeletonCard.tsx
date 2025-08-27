import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface SkeletonCardProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = '100%',
  height = 220,
  borderRadius = 16,
  style,
}) => {
  const { theme } = useTheme();
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerValue.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3]
    );
    
    return {
      opacity,
    };
  });

  const SkeletonLine: React.FC<{ width?: string | number; height?: number; marginBottom?: number }> = ({
    width = '100%',
    height = 12,
    marginBottom = 8,
  }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.muted + '40',
          borderRadius: 6,
          marginBottom,
        } as any,
        shimmerStyle,
      ]}
    />
  );

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: theme.card,
          borderRadius,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {/* Image placeholder */}
      <Animated.View
        style={[
          {
            width: '100%',
            height: height * 0.6,
            backgroundColor: theme.muted + '40',
            borderRadius: borderRadius - 4,
            marginBottom: 12,
          },
          shimmerStyle,
        ]}
      />
      
      {/* Text lines */}
      <SkeletonLine width="80%" height={16} marginBottom={8} />
      <SkeletonLine width="60%" height={12} marginBottom={12} />
      
      {/* Button placeholder */}
      <Animated.View
        style={[
          {
            width: '100%',
            height: 36,
            backgroundColor: theme.muted + '40',
            borderRadius: 8,
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
};

export default SkeletonCard;