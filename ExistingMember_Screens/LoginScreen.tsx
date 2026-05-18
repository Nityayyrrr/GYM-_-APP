import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
// ✅ Use react-native-safe-area-context — NOT react-native's SafeAreaView
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, styles as shared } from '../styles';
import TopBar from '../components/TopBar';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Entry animations
  const heroAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const field1Anim = useRef(new Animated.Value(0)).current;
  const field2Anim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  // Success overlay animations
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const successTextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(90, [
      Animated.spring(heroAnim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
      Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
      Animated.spring(field1Anim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
      Animated.spring(field2Anim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
      Animated.spring(btnAnim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
    ]).start();
  }, []);

  const animStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  });

  const triggerSuccessAnimation = () => {
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(checkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        Animated.timing(successTextOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => onSuccess(), 700);
        });
      });
    });
  };

  const handleLogin = () => {
    if (!mobile || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mobile.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      triggerSuccessAnimation();
    }, 1200);
  };

  return (
    // ✅ edges={['top','left','right']} — top edge pushes content below
    //    the status bar / notch automatically on every device
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      {/* translucent=false keeps the status bar background solid, no bleed */}
      <StatusBar style="dark" translucent={false} backgroundColor="#fff8f3" />

      {/* TopBar is placed AFTER safe area inset — never overlaps status bar */}
      <TopBar onBack={onBack} title="Member Login" />

      {/* Visual separator between TopBar and scrollable content */}
      <View style={styles.divider} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.formContent,
            // ✅ Bottom inset so nothing hides behind the home indicator
            { paddingBottom: insets.bottom + 48 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <Animated.View style={[styles.formHero, animStyle(heroAnim)]}>
            <Text style={shared.capsLabel}>Welcome Back</Text>
            <Text style={styles.formTitle}>Access Your{'\n'}Dashboard</Text>
          </Animated.View>

          {/* Card */}
          <Animated.View style={[styles.formCard, animStyle(cardAnim)]}>

            {/* Mobile Number */}
            <Animated.View style={[styles.fieldGroup, animStyle(field1Anim)]}>
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <View style={styles.mobileRow}>
                <View style={styles.dialCode}>
                  <Text style={styles.dialCodeText}>🇮🇳  +91</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.mobileInput]}
                  placeholder="98765 43210"
                  placeholderTextColor={C.onSurfaceVariant}
                  value={mobile}
                  onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                />
              </View>
            </Animated.View>

            {/* Password */}
            <Animated.View style={[styles.fieldGroup, animStyle(field2Anim)]}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={C.onSurfaceVariant}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </Animated.View>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Animated.View style={animStyle(btnAnim)}>
              <TouchableOpacity
                style={[shared.primaryBtn, loading && { opacity: 0.7 }]}
                activeOpacity={0.85}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={shared.primaryBtnTitle}>
                  {loading ? 'Signing In…' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Success Overlay ── */}
      <Animated.View
        style={[styles.successOverlay, { opacity: overlayOpacity }]}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            styles.successIconWrap,
            { opacity: checkOpacity, transform: [{ scale: checkScale }] },
          ]}
        >
          <View style={styles.checkCircle}>
            <View style={styles.checkStem} />
            <View style={styles.checkKick} />
          </View>
        </Animated.View>

        <Animated.Text style={[styles.successLabel, { opacity: successTextOpacity }]}>
          Welcome!
        </Animated.Text>
        <Animated.Text style={[styles.successSub, { opacity: successTextOpacity }]}>
          Signed in successfully
        </Animated.Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff8f3', // matches StatusBar backgroundColor
  },
  divider: {
    height: 1,
    backgroundColor: C.outline,
    opacity: 0.4,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    // paddingBottom applied dynamically via insets above
  },
  formHero: {
    marginBottom: 24,
    gap: 8,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.onSurface,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  formCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: C.outline,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldGroup: { gap: 6 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  mobileRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dialCode: {
    borderWidth: 1,
    borderColor: C.outline,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: C.surfaceVariant,
    justifyContent: 'center',
  },
  dialCodeText: {
    fontSize: 14,
    color: C.onSurface,
    fontWeight: '600',
  },
  mobileInput: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: C.outline,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: C.onSurface,
    backgroundColor: C.surfaceVariant,
  },
  errorBanner: {
    backgroundColor: '#ffdad4',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#8f0f07',
    fontWeight: '500',
  },
  forgotLink: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 13,
    color: C.primary,
    fontWeight: '600',
  },

  // ── Success overlay ──
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff8f3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  successIconWrap: {
    marginBottom: 8,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.primary ?? '#800000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  checkStem: {
    position: 'absolute',
    width: 4,
    height: 22,
    backgroundColor: '#fff',
    borderRadius: 2,
    bottom: 22,
    left: 30,
    transform: [{ rotate: '45deg' }],
  },
  checkKick: {
    position: 'absolute',
    width: 4,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 2,
    bottom: 20,
    left: 40,
    transform: [{ rotate: '-45deg' }],
  },
  successLabel: {
    fontSize: 26,
    fontWeight: '800',
    color: C.onSurface,
    letterSpacing: -0.4,
  },
  successSub: {
    fontSize: 15,
    color: C.onSurfaceVariant,
    fontWeight: '500',
  },
});