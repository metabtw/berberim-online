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
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, spacing, typography, shadows, screenDimensions } from '../styles/globalStyles';
import Logo from '../components/Logo';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const logoSize = Math.min(screenWidth * 0.3, screenHeight * 0.15);
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
  
  const handleLogin = () => {
    // Trim whitespace and validate inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    
    // Check if fields are empty
    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }
    
    // Simulated login with test credentials
    if (trimmedEmail === 'örnek@gmail.com' && trimmedPassword === 'admin') {
      console.log('Login successful:', { email: trimmedEmail, password: trimmedPassword });
      navigation.navigate('Home');
    } else {
      console.log('Login failed:', { email: trimmedEmail, password: trimmedPassword });
      Alert.alert('Hata', 'E-posta veya şifre hatalı!\n\nTest için:\nE-posta: örnek@gmail.com\nŞifre: admin');
    }
  };
  
  const navigateToRegister = () => {
    navigation.navigate('Register');
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
              <Text style={[styles.appTitle, { fontSize: isSmallScreen ? 24 : 28 }]}>Kuaförüm Online</Text>
              <Text style={[styles.appSubtitle, { fontSize: isSmallScreen ? 14 : 16 }]}>Randevunuz bir dokunuş uzağında</Text>
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
                <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
                <Text style={styles.subtitleText}>Hesabınıza giriş yapın</Text>
                
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>E-posta</Text>
                  <TextInput
                    style={[
                      styles.input,
                      isEmailFocused && styles.inputFocused,
                    ]}
                    placeholder="ornek@email.com"
                    placeholderTextColor={colors.textPlaceholder}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
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
                      isPasswordFocused && styles.inputFocused,
                    ]}
                    placeholder="Şifrenizi girin"
                    placeholderTextColor={colors.textPlaceholder}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    secureTextEntry
                  />
                </View>
                
                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                </TouchableOpacity>
                
                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginButtonContainer}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={gradients.button}
                    style={styles.loginButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                {/* Register Link */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Hesabınız yok mu? </Text>
                  <TouchableOpacity onPress={navigateToRegister}>
                    <Text style={styles.registerLink}>Kayıt Ol</Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
    marginBottom: spacing.sm,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appTitle: {
    ...typography.h1,
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
    justifyContent: 'flex-end',
    paddingBottom: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.sm,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
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
    marginBottom: spacing.xl,
    color: colors.textSecondary,
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
    paddingVertical: spacing.md,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    color: colors.textPrimary,
    minHeight: 52,
    width: '100%',
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
    ...shadows.small,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  loginButtonContainer: {
    marginBottom: spacing.lg,
  },
  loginButton: {
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    width: '100%',
    ...shadows.medium,
  },
  loginButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;