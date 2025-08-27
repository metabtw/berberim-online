import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  style?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '🔍',
  actionText,
  onAction,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 justify-center items-center px-8"
      style={[{ backgroundColor: theme.background }, style]}
    >
      {/* Icon */}
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: theme.muted + '20' }}
      >
        <Text className="text-4xl">{icon}</Text>
      </View>

      {/* Title */}
      <Text
        className="text-xl font-bold text-center mb-3"
        style={{ color: theme.text }}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          className="text-base text-center mb-8 leading-6"
          style={{ color: theme.muted }}
        >
          {description}
        </Text>
      )}

      {/* Action Button */}
      {actionText && onAction && (
        <TouchableOpacity
          className="px-6 py-3 rounded-xl"
          style={{ backgroundColor: theme.primary }}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;