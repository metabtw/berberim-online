import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';
import { signIn } from '../../services/mock';
import { RootStackParamList } from '../../../app/_layout';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email gerekli')
    .email('Geçerli bir email adresi girin'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalı'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Animasyon değerleri (sadece form için)
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);

  // Form kontrolü
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'test@example.com', // Demo için
      password: 'password', // Demo için
    },
  });

  useEffect(() => {
    // Sadece form animasyonu
    formOpacity.value = withTiming(1, { duration: 600 });
    formTranslateY.value = withTiming(0, { duration: 600 });
  }, []);

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login button pressed with data:', data);
    setIsLoading(true);
    try {
      const response = await signIn(data.email, data.password);
      console.log('Login response:', response);
      
      if (response.success && response.token) {
        // Store token and user data
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        // Verify storage
        const storedToken = await AsyncStorage.getItem('userToken');
        
        if (storedToken) {
          // Show success message and navigate
          Alert.alert(
            'Başarılı', 
            'Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz.',
            [
              {
                text: 'Tamam',
                onPress: () => {
                  // Force app to re-check auth status
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Search' }],
                  });
                }
              }
            ]
          );
        } else {
          Alert.alert('Hata', 'Token kaydedilemedi');
        }
      } else {
        Alert.alert('Hata', response.message || 'Giriş başarısız');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Logo Section */}
          <View className="items-center mb-12">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: theme.primary }}
            >
              <Text className="text-white text-3xl font-bold">B</Text>
            </View>
            <Text
              className="text-3xl font-bold text-center"
              style={{ color: theme.text }}
            >
              Berberim
            </Text>
            <Text
              className="text-base text-center mt-2"
              style={{ color: theme.muted }}
            >
              Randevunuz bir tık uzağınızda
            </Text>
          </View>

          {/* Form Section */}
          <Animated.View style={[formAnimatedStyle]}>
            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text
                  className="text-sm font-medium mb-2"
                  style={{ color: theme.text }}
                >
                  Email
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="px-4 py-3 rounded-xl text-base"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: errors.email ? theme.error : theme.border,
                        borderWidth: 1,
                        color: theme.text,
                      }}
                      placeholder="email@example.com"
                      placeholderTextColor={theme.muted}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-sm mt-1" style={{ color: theme.error }}>
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View>
                <Text
                  className="text-sm font-medium mb-2"
                  style={{ color: theme.text }}
                >
                  Şifre
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="px-4 py-3 rounded-xl text-base"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: errors.password ? theme.error : theme.border,
                        borderWidth: 1,
                        color: theme.text,
                      }}
                      placeholder="Şifrenizi girin"
                      placeholderTextColor={theme.muted}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                    />
                  )}
                />
                {errors.password && (
                  <Text className="text-sm mt-1" style={{ color: theme.error }}>
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className="py-4 rounded-xl items-center mt-6"
                style={{
                  backgroundColor: theme.primary,
                  opacity: isLoading ? 0.7 : 1,
                }}
                onPress={() => {
                  console.log('Button pressed!');
                  handleSubmit(onSubmit)();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-semibold">
                    Giriş Yap
                  </Text>
                )}
              </TouchableOpacity>

              {/* Register Link */}
              <View className="flex-row justify-center items-center mt-6">
                <Text style={{ color: theme.muted }}>Hesabınız yok mu? </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text
                    className="font-semibold"
                    style={{ color: theme.primary }}
                  >
                    Kayıt Ol
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Demo Info */}
              <View
                className="p-4 rounded-xl mt-6"
                style={{ backgroundColor: theme.accent + '20' }}
              >
                <Text
                  className="text-sm text-center"
                  style={{ color: theme.text }}
                >
                  Demo: test@example.com / password
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;