import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#b22b1d',
  onPrimary: '#ffffff',
  onSurface: '#1a1a1a',
  onSurfaceVariant: '#4b5563',
  surface: '#ffffff',
  surfaceVariant: '#f3f4f6',
  background: '#fffbf8',
};

const FONTS = {
  displayXL: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 42,
    fontWeight: '800' as const,
    letterSpacing: -1,
    lineHeight: 48,
  },
  headlineMd: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  labelCaps: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 2.5, lineHeight: 16 },
  bodySm: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 1.5, lineHeight: 16 },
  bodyLg: { fontSize: 15, fontWeight: '400' as const, lineHeight: 24 },
};

interface WelcomeScreenProps {
  onNewMember?: () => void;
  onExistingMember?: () => void;
}

export default function WelcomeScreen({ onNewMember, onExistingMember }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  // ── Entrance animations ──────────────────────────────────────────────────
  const fadeHeader = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(-24)).current;

  const fadeLabel = useRef(new Animated.Value(0)).current;
  const slideLabel = useRef(new Animated.Value(20)).current;

  const scaleTitle = useRef(new Animated.Value(0.82)).current;
  const fadeTitle = useRef(new Animated.Value(0)).current;

  const fadeSub = useRef(new Animated.Value(0)).current;
  const slideSub = useRef(new Animated.Value(12)).current;

  // Button 1 (New Member) — slides up from further down
  const slideBtn1 = useRef(new Animated.Value(60)).current;
  const fadeBtn1 = useRef(new Animated.Value(0)).current;

  // Button 2 (Existing Member) — slides up slightly after
  const slideBtn2 = useRef(new Animated.Value(60)).current;
  const fadeBtn2 = useRef(new Animated.Value(0)).current;

  const fadeQuote = useRef(new Animated.Value(0)).current;
  const scaleQuote = useRef(new Animated.Value(0.94)).current;

  // ── Continuous animations ────────────────────────────────────────────────
  // Logo icon float up/down
  const logoFloat = useRef(new Animated.Value(0)).current;

  // Shimmer sweep on the primary (New Member) button
  const shimmerX = useRef(new Animated.Value(-width * 0.6)).current;

  // Soft glow pulse on primary button shadow
  const glowPulse = useRef(new Animated.Value(0.18)).current;

  // Subtle border shimmer on secondary button
  const borderAnim = useRef(new Animated.Value(0)).current;

  // ── Press scales ─────────────────────────────────────────────────────────
  const scaleBtn1Press = useRef(new Animated.Value(1)).current;
  const scaleBtn2Press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // ── Entrance sequence ──────────────────────────────────────────────
    Animated.stagger(80, [
      // Header slides down from above
      Animated.parallel([
        Animated.timing(fadeHeader, { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.spring(slideHeader, { toValue: 0, speed: 14, bounciness: 7, useNativeDriver: true }),
      ]),
      // Label floats up
      Animated.parallel([
        Animated.timing(fadeLabel, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(slideLabel, { toValue: 0, speed: 14, bounciness: 6, useNativeDriver: true }),
      ]),
      // Title scales in with a pop
      Animated.parallel([
        Animated.timing(fadeTitle, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scaleTitle, { toValue: 1, speed: 9, bounciness: 12, useNativeDriver: true }),
      ]),
      // Subtitle slides up
      Animated.parallel([
        Animated.timing(fadeSub, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.spring(slideSub, { toValue: 0, speed: 14, bounciness: 5, useNativeDriver: true }),
      ]),
      // NEW MEMBER button — big bounce entrance
      Animated.parallel([
        Animated.timing(fadeBtn1, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(slideBtn1, { toValue: 0, speed: 10, bounciness: 14, useNativeDriver: true }),
      ]),
      // EXISTING MEMBER button — follows with slight delay
      Animated.parallel([
        Animated.timing(fadeBtn2, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(slideBtn2, { toValue: 0, speed: 10, bounciness: 14, useNativeDriver: true }),
      ]),
      // Quote fades + scales in last
      Animated.parallel([
        Animated.timing(fadeQuote, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scaleQuote, { toValue: 1, speed: 10, bounciness: 6, useNativeDriver: true }),
      ]),
    ]).start();

    // ── Logo float (continuous) ───────────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -5, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // ── Shimmer on New Member button (continuous) ─────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: width * 0.8,
          duration: 1800,
          delay: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerX, {
          toValue: -width * 0.6,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ── Glow pulse on New Member button shadow (continuous) ───────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 0.45, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.18, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // ── Border shimmer on Existing Member button (continuous) ─────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(borderAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const pressIn = (s: Animated.Value) =>
    Animated.spring(s, { toValue: 0.95, speed: 50, useNativeDriver: true }).start();

  const pressOut = (s: Animated.Value) =>
    Animated.spring(s, { toValue: 1, speed: 25, bounciness: 12, useNativeDriver: true }).start();

  // Interpolate border color for secondary button
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#1a1a1a', '#b22b1d', '#1a1a1a'],
  });

  // Interpolate glow opacity
  const glowOpacity = glowPulse;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" translucent={false} backgroundColor={COLORS.background} />

      {/* Background blobs */}
      <View style={styles.blobContainer} pointerEvents="none">
        <View style={[styles.blob, styles.blobTopLeft]} />
        <View style={[styles.blob, styles.blobBottomRight]} />
        <View style={[styles.blob, styles.blobMidRight]} />
      </View>

      {/* ── Header ───────────────────────────────────────────────── */}
      <Animated.View
        style={[styles.header, { opacity: fadeHeader, transform: [{ translateY: slideHeader }] }]}
      >
        <View style={styles.headerLeft}>
          {/* Floating logo icon */}
          <Animated.Text style={[styles.headerIcon, { transform: [{ translateY: logoFloat }] }]}>
            🏋️
          </Animated.Text>
          <Text style={styles.headerTitle}>FORGE & FLORA</Text>
        </View>
        <TouchableOpacity style={styles.helpBtn} activeOpacity={0.7}>
          <Text style={styles.helpIcon}>?</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <View style={styles.main}>

        {/* Hero text block */}
        <View style={styles.heroBlock}>
          <Animated.Text
            style={[styles.labelCaps, { opacity: fadeLabel, transform: [{ translateY: slideLabel }] }]}
          >
            The Sanctuary of Strength
          </Animated.Text>

          <Animated.Text
            style={[styles.displayTitle, { opacity: fadeTitle, transform: [{ scale: scaleTitle }] }]}
          >
            Welcome
          </Animated.Text>

          <Animated.Text
            style={[styles.subtitle, { opacity: fadeSub, transform: [{ translateY: slideSub }] }]}
          >
            Please select your membership status to continue.
          </Animated.Text>
        </View>

        {/* ── Button Group ───────────────────────────────────────── */}
        <View style={styles.buttonGroup}>

          {/* ── NEW MEMBER button ─────────────────────────────── */}
          <Animated.View
            style={{
              opacity: fadeBtn1,
              transform: [{ translateY: slideBtn1 }, { scale: scaleBtn1Press }],
            }}
          >
            {/* Glow layer behind button */}
            <Animated.View style={[styles.btnGlow, { opacity: glowOpacity }]} />

            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => pressIn(scaleBtn1Press)}
              onPressOut={() => pressOut(scaleBtn1Press)}
              onPress={onNewMember}
              style={styles.btnPrimaryWrapper}
            >
              <LinearGradient
                colors={['#c73020', '#b22b1d', '#8f1510']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btnPrimary}
              >
                {/* Shimmer overlay */}
                <Animated.View
                  style={[styles.shimmer, { transform: [{ translateX: shimmerX }] }]}
                  pointerEvents="none"
                />
                <Text style={styles.btnPrimaryTitle}>I'm a New Member</Text>
                <Text style={styles.btnPrimarySubtitle}>JOIN THE COLLECTIVE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* ── EXISTING MEMBER button ────────────────────────── */}
          <Animated.View
            style={{
              opacity: fadeBtn2,
              transform: [{ translateY: slideBtn2 }, { scale: scaleBtn2Press }],
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => pressIn(scaleBtn2Press)}
              onPressOut={() => pressOut(scaleBtn2Press)}
              onPress={onExistingMember}
            >
              {/* Animated border via Animated.View overlay trick */}
              <Animated.View style={[styles.btnSecondaryBorder, { borderColor }]}>
                <View style={styles.btnSecondaryInner}>
                  <Text style={styles.btnSecondaryTitle}>I'm an Existing Member</Text>
                  <Text style={styles.btnSecondarySubtitle}>ACCESS YOUR DASHBOARD</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

        </View>

        {/* ── Quote ──────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.quoteBlock,
            { opacity: fadeQuote, transform: [{ scale: scaleQuote }] },
          ]}
        >
          <View style={styles.quoteDivider} />
          <Text style={styles.quoteText}>
            "True strength is forged in the silence of nature{'\n'}and the heat of the iron."
          </Text>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Blobs
  blobContainer: { ...StyleSheet.absoluteFillObject, zIndex: -1 },
  blob: { position: 'absolute', borderRadius: 999 },
  blobTopLeft: {
    top: -height * 0.15, left: -width * 0.1,
    width: width * 1.0, height: height * 0.6,
    backgroundColor: '#fff2e0', opacity: 0.6,
  },
  blobBottomRight: {
    bottom: -height * 0.08, right: -width * 0.1,
    width: width * 0.85, height: height * 0.5,
    backgroundColor: '#fff8f3', opacity: 0.8,
  },
  blobMidRight: {
    top: '22%' as any, right: '10%' as any,
    width: width * 0.55, height: height * 0.35,
    backgroundColor: '#ffe5ba', opacity: 0.2,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(209,213,219,0.15)',
    backgroundColor: 'rgba(255,251,248,0.85)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { fontSize: 20 },
  headerTitle: {
    ...FONTS.labelCaps,
    fontSize: 13,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  helpBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surfaceVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  helpIcon: { fontSize: 15, color: COLORS.onSurfaceVariant, fontWeight: '600' },

  // Main
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 40,
  },

  // Hero
  heroBlock: { alignItems: 'center', gap: 12 },
  labelCaps: {
    ...FONTS.labelCaps,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  displayTitle: {
    ...FONTS.displayXL,
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.bodyLg,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 240,
  },

  // Buttons
  buttonGroup: { width: '100%', gap: 14 },

  // Primary — New Member
  btnGlow: {
    position: 'absolute',
    top: 4, left: 8, right: 8, bottom: -6,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    zIndex: -1,
  },
  btnPrimaryWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.18)',
    transform: [{ skewX: '-20deg' }],
  },
  btnPrimaryTitle: {
    ...FONTS.headlineMd,
    color: COLORS.onPrimary,
    textAlign: 'center',
  },
  btnPrimarySubtitle: {
    ...FONTS.bodySm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 3,
  },

  // Secondary — Existing Member
  btnSecondaryBorder: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  btnSecondaryInner: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  btnSecondaryTitle: {
    ...FONTS.headlineMd,
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  btnSecondarySubtitle: {
    ...FONTS.bodySm,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 3,
  },

  // Quote
  quoteBlock: { alignItems: 'center', gap: 20, paddingTop: 8 },
  quoteDivider: { width: 32, height: 1, backgroundColor: 'rgba(209,213,219,0.5)' },
  quoteText: {
    fontStyle: 'italic',
    color: COLORS.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 260,
    opacity: 0.8,
    fontWeight: '300',
  },
});