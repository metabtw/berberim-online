export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export const lightTheme: ThemeColors = {
  primary: '#2F4553',
  secondary: '#C49A6C',
  accent: '#4AA3A2',
  background: '#F5F7F9',
  card: '#FFFFFF',
  text: '#1E232B',
  muted: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const darkTheme: ThemeColors = {
  primary: '#5DADE2',
  secondary: '#B88A57',
  accent: '#6CCFCB',
  background: '#121417',
  card: '#1B1F24',
  text: '#E6EAF0',
  muted: '#9AA3AF',
  border: '#2A2F36',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export type ThemeMode = 'light' | 'dark';

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
  return mode === 'light' ? lightTheme : darkTheme;
};