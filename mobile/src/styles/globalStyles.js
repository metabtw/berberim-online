import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isVerySmallScreen = height < 600;

export const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  accentDark: '#f5576c',
  white: '#ffffff',
  black: '#000000',
  gray: '#8e8e93',
  lightGray: '#f2f2f7',
  darkGray: '#48484a',
  background: '#f8f9fa',
  error: '#ff3b30',
  success: '#34c759',
  warning: '#ff9500',
};

export const gradients = {
  primary: ['#667eea', '#764ba2'],
  accent: ['#f093fb', '#f5576c'],
  background: ['#667eea', '#764ba2'],
  button: ['#667eea', '#764ba2'],
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
    color: colors.black,
  },
  h2: {
    fontSize: isVerySmallScreen ? 18 : isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: colors.black,
  },
  h3: {
    fontSize: isVerySmallScreen ? 16 : isSmallScreen ? 18 : 20,
    fontWeight: '600',
    color: colors.black,
  },
  body: {
    fontSize: isVerySmallScreen ? 14 : 16,
    fontWeight: '400',
    color: colors.black,
  },
  caption: {
    fontSize: isVerySmallScreen ? 12 : 14,
    fontWeight: '400',
    color: colors.gray,
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