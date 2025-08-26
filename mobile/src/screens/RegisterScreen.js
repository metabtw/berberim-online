import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, spacing, typography, shadows, screenDimensions } from '../styles/globalStyles';
import Logo from '../components/Logo';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const logoSize = Math.min(screenWidth * 0.25, screenHeight * 0.12);
  const isSmallScreen = screenHeight < 700;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin.');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Hata', 'Lütfen soyadınızı girin.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return false;
    }
    return true;
  };
  
  const handleRegister = () => {
    if (validateForm()) {
      // Register logic will be implemented when backend is ready
      console.log('Register attempt:', { firstName, lastName, email, password });
      Alert.alert('Başarılı', 'Hesabınız oluşturuldu!', [
        { text: 'Tamam', onPress: () => navigation.navigate('Home') }
      ]);
    }
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <LinearGradient colors={gradients.background} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: logoAnim,
                  transform: [{
                    scale: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  }],
                },
              ]}
            >
              <View style={styles.logoWrapper}>
                <Logo width={logoSize} height={logoSize} />
              </View>
              <Text style={[styles.appTitle, { fontSize: isSmallScreen ? 22 : 26 }]}>Kuaförüm Online</Text>
              <Text style={[styles.appSubtitle, { fontSize: isSmallScreen ? 13 : 15 }]}>Yeni hesap oluşturun</Text>
            </Animated.View>
            
            {/* Form Section */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.formCard}>
                <Text style={styles.welcomeText}>Kayıt Ol</Text>
                <Text style={styles.subtitleText}>Hesabınızı oluşturun</Text>
                
                {/* Name Inputs Row */}
                <View style={styles.nameRow}>
                  <View style={[styles.inputContainer, styles.nameInput]}>
                    <Text style={styles.inputLabel}>Ad</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'firstName' && styles.inputFocused,
                      ]}
                      placeholder="Adınız"
                      placeholderTextColor={colors.textPlaceholder}
                      value={firstName}
                      onChangeText={setFirstName}
                      onFocus={() => setFocusedInput('firstName')}
                      onBlur={() => setFocusedInput(null)}
                      autoCapitalize="words"
                    />
                  </View>
                  
                  <View style={[styles.inputContainer, styles.nameInput]}>
                    <Text style={styles.inputLabel}>Soyad</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'lastName' && styles.inputFocused,
                      ]}
                      placeholder="Soyadınız"
                      placeholderTextColor={colors.textPlaceholder}
                        value={lastName}
                        onChangeText={setLastName}
                      onFocus={() => setFocusedInput('lastName')}
                      onBlur={() => setFocusedInput(null)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
                
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>E-posta</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'email' && styles.inputFocused,
                    ]}
                    placeholder="ornek@email.com"
                    placeholderTextColor={colors.textPlaceholder}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                
                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Şifre</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'password' && styles.inputFocused,
                    ]}
                    placeholder="En az 6 karakter"
                    placeholderTextColor={colors.textPlaceholder}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry
                  />
                </View>
                
                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Şifre Tekrar</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'confirmPassword' && styles.inputFocused,
                      password !== confirmPassword && confirmPassword.length > 0 && styles.inputError,
                    ]}
                    placeholder="Şifrenizi tekrar girin"
                    placeholderTextColor={colors.textPlaceholder}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry
                  />
                  {password !== confirmPassword && confirmPassword.length > 0 && (
                    <Text style={styles.errorText}>Şifreler eşleşmiyor</Text>
                  )}
                </View>
                
                {/* Register Button */}
                <TouchableOpacity
                  style={styles.registerButtonContainer}
                  onPress={handleRegister}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={gradients.accent}
                    style={styles.registerButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                  <TouchableOpacity onPress={navigateToLogin}>
                    <Text style={styles.loginLink}>Giriş Yap</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
    marginBottom: spacing.sm,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appTitle: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  appSubtitle: {
    ...typography.caption,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    ...shadows.large,
  },
  welcomeText: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  subtitleText: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    color: colors.textPrimary,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
    ...shadows.small,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.white,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
    fontSize: 12,
  },
  registerButtonContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  registerButton: {
    borderRadius: 25,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  registerButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;