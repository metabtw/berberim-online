import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

export const colors = {
  primary: '#38B6FF',
  secondary: '#FF7B54',
  accent: '#FFD93D',
  white: '#ffffff',
  black: '#000000',
  gray: '#4B5563',
  lightGray: '#F3F4F6',
  darkGray: '#1F2937',
  background: '#F9FAFB',
  backgroundLight: '#F9FAFB',
  backgroundDark: '#111827',
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  textPlaceholder: '#9CA3AF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

export const gradients = {
  primary: ['#38B6FF', '#FF7B54'],
  accent: ['#FFD93D', '#FF7B54'],
  background: ['#38B6FF', '#FF7B54'],
  button: ['#38B6FF', '#FF7B54'],
};

export const spacing = {
  xs: isVerySmallScreen ? 2 : 4,
  sm: isVerySmallScreen ? 4 : isSmallScreen ? 6 : 8,
  md: isVerySmallScreen ? 8 : isSmallScreen ? 12 : 16,
  lg: isVerySmallScreen ? 12 : isSmallScreen ? 18 : 24,
  xl: isVerySmallScreen ? 16 : isSmallScreen ? 24 : 32,
  xxl: isVerySmallScreen ? 24 : isSmallScreen ? 36 : 48,
};

export const typography = {
  h1: {
    fontSize: isVerySmallScreen ? 24 : isSmallScreen ? 28 : 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  h2: {
    fontSize: isVerySmallScreen ? 18 : isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  h3: {
    fontSize: isVerySmallScreen ? 16 : isSmallScreen ? 18 : 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontSize: isVerySmallScreen ? 14 : 16,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  caption: {
    fontSize: isVerySmallScreen ? 12 : 14,
    fontWeight: '400',
    color: colors.textPlaceholder,
  },
  button: {
    fontSize: isVerySmallScreen ? 14 : 16,
    fontWeight: '600',
    color: colors.white,
  },
};

export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 10,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.medium,
  },
  button: {
    borderRadius: 25,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...shadows.small,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    minHeight: 48,
    ...shadows.small,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
});

export const screenDimensions = {
  width,
  height,
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 414,
  isLargeDevice: width >= 414,
};