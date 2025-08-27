import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPress?: () => void;
  editable?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Ara...',
  onPress,
  editable = true,
  rightIcon,
  leftIcon,
}) => {
  const { theme } = useTheme();

  const SearchIcon = () => (
    <Text style={{ color: theme.muted, fontSize: 16 }}>🔍</Text>
  );

  const content = (
    <View
      className="flex-row items-center px-4 py-3 rounded-xl border"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
    >
      {leftIcon || <SearchIcon />}
      
      <TextInput
        className="flex-1 ml-3 text-base"
        style={{ color: theme.text }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        editable={editable && !onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
      />
      
      {rightIcon && (
        <View className="ml-2">
          {rightIcon}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default SearchBar;