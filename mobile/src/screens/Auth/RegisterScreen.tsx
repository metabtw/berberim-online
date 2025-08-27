import React, { useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';
import { signUp } from '../../services/mock';
import { RootStackParamList } from '../../../app/_layout';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

// Zod validation schema
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Ad en az 2 karakter olmalı')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  email: z
    .string()
    .min(1, 'Email gerekli')
    .email('Geçerli bir email adresi girin'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalı')
    .max(100, 'Şifre en fazla 100 karakter olabilir'),
  confirmPassword: z
    .string()
    .min(1, 'Şifre tekrarı gerekli'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Form kontrolü
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await signUp(data.name, data.email, data.password);
      
      if (response.success && response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        Alert.alert(
          'Başarılı',
          'Hesabınız başarıyla oluşturuldu!',
          [
            {
              text: 'Tamam',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Search' }],
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Hata', response.message || 'Kayıt başarısız');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.goBack();
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
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: theme.text }}
            >
              Hesap Oluştur
            </Text>
            <Text
              className="text-base"
              style={{ color: theme.muted }}
            >
              Berberim'e hoş geldiniz! Hemen hesabınızı oluşturun.
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text
                className="text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Ad Soyad
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="px-4 py-3 rounded-xl text-base"
                    style={{
                      backgroundColor: theme.card,
                      borderColor: errors.name ? theme.error : theme.border,
                      borderWidth: 1,
                      color: theme.text,
                    }}
                    placeholder="Adınızı ve soyadınızı girin"
                    placeholderTextColor={theme.muted}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.name && (
                <Text className="text-sm mt-1" style={{ color: theme.error }}>
                  {errors.name.message}
                </Text>
              )}
            </View>

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
                    placeholder="En az 6 karakter"
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

            {/* Confirm Password Input */}
            <View>
              <Text
                className="text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Şifre Tekrar
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="px-4 py-3 rounded-xl text-base"
                    style={{
                      backgroundColor: theme.card,
                      borderColor: errors.confirmPassword ? theme.error : theme.border,
                      borderWidth: 1,
                      color: theme.text,
                    }}
                    placeholder="Şifrenizi tekrar girin"
                    placeholderTextColor={theme.muted}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-sm mt-1" style={{ color: theme.error }}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className="py-4 rounded-xl items-center mt-6"
              style={{
                backgroundColor: theme.primary,
                opacity: isLoading ? 0.7 : 1,
              }}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-semibold">
                  Hesap Oluştur
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-6">
              <Text style={{ color: theme.muted }}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text
                  className="font-semibold"
                  style={{ color: theme.primary }}
                >
                  Giriş Yap
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <View className="mt-6">
              <Text
                className="text-xs text-center leading-4"
                style={{ color: theme.muted }}
              >
                Hesap oluşturarak{' '}
                <Text style={{ color: theme.primary }}>Kullanım Şartları</Text>
                {' '}ve{' '}
                <Text style={{ color: theme.primary }}>Gizlilik Politikası</Text>
                'nı kabul etmiş olursunuz.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;