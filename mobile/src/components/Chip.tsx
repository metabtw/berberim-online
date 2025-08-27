import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  disabled = false,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (disabled || !onPress) return;
    
    // Basma animasyonu
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getBackgroundColor = () => {
    if (disabled) {
      return theme.muted + '30';
    }
    
    switch (variant) {
      case 'filled':
        return selected ? theme.primary : theme.card;
      case 'outline':
        return selected ? theme.primary + '20' : 'transparent';
      default:
        return selected ? theme.primary : theme.card;
    }
  };

  const getBorderColor = () => {
    if (disabled) {
      return theme.border;
    }
    
    switch (variant) {
      case 'outline':
        return selected ? theme.primary : theme.border;
      default:
        return selected ? theme.primary : theme.border;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return theme.muted;
    }
    
    switch (variant) {
      case 'filled':
        return selected ? 'white' : theme.text;
      case 'outline':
        return selected ? theme.primary : theme.text;
      default:
        return selected ? 'white' : theme.text;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5';
      case 'large':
        return 'px-6 py-3';
      default:
        return 'px-4 py-2';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <AnimatedTouchableOpacity
      className={`rounded-full ${getPadding()} border`}
      style={[
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: disabled ? 0.6 : 1,
        },
        animatedStyle,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        className={`${getTextSize()} font-medium text-center`}
        style={{ color: getTextColor() }}
      >
        {label}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

export default Chip;