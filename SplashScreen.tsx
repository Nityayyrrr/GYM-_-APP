import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: W, height: H } = Dimensions.get('window');

// ── Color Palette ──────────────────────────────────────────────
const C = {
  bg: '#FDF6F0',   // warm off-white background
  bgDeep: '#F5EDE4',   // slightly deeper off-white surface
  grid: 'rgba(196,60,80,0.07)',
  rose: '#C43C50',   // primary rose-red
  roseDark: '#9B2D3F',   // deeper rose for depth
  roseLight: '#E8748A',   // lighter rose accent
  roseFaint: 'rgba(196,60,80,0.12)',
  white: '#FFFFFF',
  offWhite: '#FAF3EE',
  textMain: '#2A1018',   // near-black warm text
  textMuted: 'rgba(196,60,80,0.55)',
};

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const bgScale = useRef(new Animated.Value(1.3)).current;
  const flareOpacity = useRef(new Animated.Value(0)).current;
  const flareScale = useRef(new Animated.Value(0.4)).current;

  const bar1 = useRef(new Animated.Value(0)).current;
  const bar2 = useRef(new Animated.Value(0)).current;
  const bar3 = useRef(new Animated.Value(0)).current;
  const bar4 = useRef(new Animated.Value(0)).current;
  const bar5 = useRef(new Animated.Value(0)).current;

  const plateLeft = useRef(new Animated.Value(-W * 0.6)).current;
  const plateRight = useRef(new Animated.Value(W * 0.6)).current;
  const barbelOpacity = useRef(new Animated.Value(0)).current;
  const barbelScale = useRef(new Animated.Value(0.7)).current;

  const impactOpacity = useRef(new Animated.Value(0)).current;
  const impactScale = useRef(new Animated.Value(0.5)).current;

  const logoY = useRef(new Animated.Value(40)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;

  const taglineY = useRef(new Animated.Value(20)).current;
  const taglineO = useRef(new Animated.Value(0)).current;

  const lineLeft = useRef(new Animated.Value(0)).current;
  const lineRight = useRef(new Animated.Value(0)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const exitOpacity = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spring = (val: Animated.Value, toValue: number, tension = 60, friction = 8) =>
      Animated.spring(val, { toValue, tension, friction, useNativeDriver: true });

    const timing = (val: Animated.Value, toValue: number, duration: number, easing = Easing.out(Easing.cubic)) =>
      Animated.timing(val, { toValue, duration, easing, useNativeDriver: true });

    Animated.sequence([
      timing(bgScale, 1, 900, Easing.out(Easing.exp)),

      Animated.parallel([
        timing(flareOpacity, 1, 300),
        spring(flareScale, 1, 50, 7),
        Animated.stagger(60, [
          spring(bar1, 1, 80, 9),
          spring(bar2, 1, 80, 9),
          spring(bar3, 1, 70, 8),
          spring(bar4, 1, 80, 9),
          spring(bar5, 1, 80, 9),
        ]),
      ]),

      Animated.parallel([
        timing(barbelOpacity, 1, 200),
        spring(barbelScale, 1, 90, 7),
        spring(plateLeft, 0, 85, 9),
        spring(plateRight, 0, 85, 9),
      ]),

      Animated.sequence([
        timing(impactOpacity, 1, 80),
        timing(impactScale, 1.6, 120, Easing.out(Easing.cubic)),
        timing(impactOpacity, 0, 200),
      ]),

      Animated.parallel([
        spring(logoY, 0, 60, 10),
        timing(logoOpacity, 1, 400),
        spring(logoScale, 1, 55, 9),
        timing(lineLeft, 1, 500, Easing.out(Easing.exp)),
        timing(lineRight, 1, 500, Easing.out(Easing.exp)),
      ]),

      Animated.parallel([
        spring(taglineY, 0, 55, 10),
        timing(taglineO, 1, 350),
      ]),

    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          timing(pulseAnim, 1.06, 800, Easing.inOut(Easing.sin)),
          timing(pulseAnim, 1, 800, Easing.inOut(Easing.sin)),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          timing(glowAnim, 1, 1000, Easing.inOut(Easing.sin)),
          timing(glowAnim, 0, 1000, Easing.inOut(Easing.sin)),
        ])
      ).start();

      setTimeout(() => {
        Animated.parallel([
          timing(exitOpacity, 0, 500, Easing.in(Easing.cubic)),
          timing(exitScale, 1.08, 500, Easing.in(Easing.cubic)),
        ]).start(() => onDone());
      }, 1200);
    });
  }, []);

  const barHeights = [H * 0.28, H * 0.38, H * 0.52, H * 0.38, H * 0.28];
  const barColors = [
    'rgba(196,60,80,0.12)',
    'rgba(196,60,80,0.22)',
    'rgba(196,60,80,0.35)',
    'rgba(196,60,80,0.22)',
    'rgba(196,60,80,0.12)',
  ];

  return (
    <Animated.View style={[styles.root, { opacity: exitOpacity, transform: [{ scale: exitScale }] }]}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* ── Off-white textured background ── */}
      <Animated.View style={[styles.bg, { transform: [{ scale: bgScale }] }]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridV, { left: (W / 12) * i }]} />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridH, { top: (H / 18) * i }]} />
        ))}
      </Animated.View>

      {/* ── Soft vignette overlay ── */}
      <View style={styles.vignette} />

      {/* ── Energy bars ── */}
      <View style={styles.barsContainer}>
        {[bar1, bar2, bar3, bar4, bar5].map((bar, i) => (
          <Animated.View
            key={i}
            style={[
              styles.energyBar,
              {
                height: barHeights[i],
                backgroundColor: barColors[i],
                transform: [{ scaleY: bar }],
              },
            ]}
          />
        ))}
      </View>

      {/* ── Center flare ── */}
      <Animated.View
        style={[
          styles.flare,
          {
            opacity: flareOpacity,
            transform: [{ scale: flareScale }],
          },
        ]}
      />

      {/* ── Barbell ── */}
      <Animated.View
        style={[
          styles.barbellWrap,
          {
            opacity: barbelOpacity,
            transform: [{ scale: barbelScale }],
          },
        ]}
      >
        <Animated.View style={[styles.plate, styles.plateLeft, { transform: [{ translateX: plateLeft }] }]}>
          <View style={styles.plateFace}>
            <View style={styles.plateInner} />
            <View style={styles.plateCore} />
          </View>
        </Animated.View>

        <View style={styles.barbellBar}>
          <View style={styles.barbellBarInner} />
          <View style={styles.barbellKnurl} />
          <View style={styles.barbellKnurlRight} />
        </View>

        <Animated.View style={[styles.plate, styles.plateRight, { transform: [{ translateX: plateRight }] }]}>
          <View style={styles.plateFace}>
            <View style={styles.plateInner} />
            <View style={styles.plateCore} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* ── Impact ring ── */}
      <Animated.View
        style={[
          styles.impactRing,
          {
            opacity: impactOpacity,
            transform: [{ scale: impactScale }],
          },
        ]}
      />

      {/* ── Logo ── */}
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoY }, { scale: Animated.multiply(logoScale, pulseAnim) }],
          },
        ]}
      >
        <View style={styles.lineRow}>
          <Animated.View style={[styles.lineSide, { transform: [{ scaleX: lineLeft }] }]} />
          <View style={styles.lineDiamond} />
          <Animated.View style={[styles.lineSide, { transform: [{ scaleX: lineRight }] }]} />
        </View>

        <Text style={styles.logoSuper}>FORGE</Text>
        <Animated.View
          style={[
            styles.logoGlow,
            {
              opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.35] }),
            },
          ]}
        />
        <Text style={styles.logoMain}>FLORA</Text>

        <View style={styles.lineRow}>
          <Animated.View style={[styles.lineSide, { transform: [{ scaleX: lineLeft }] }]} />
          <View style={styles.lineDiamond} />
          <Animated.View style={[styles.lineSide, { transform: [{ scaleX: lineRight }] }]} />
        </View>
      </Animated.View>

      {/* ── Tagline ── */}
      <Animated.View
        style={[
          styles.taglineWrap,
          { opacity: taglineO, transform: [{ translateY: taglineY }] },
        ]}
      >
        <Text style={styles.tagline}>FORGE YOUR STRENGTH · GROW YOUR LEGACY</Text>
      </Animated.View>

      {/* ── Bottom badge ── */}
      <Animated.View style={[styles.badge, { opacity: taglineO }]}>
        <Text style={styles.badgeText}>EST. 2024</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.bg,
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: C.grid,
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: C.grid,
  },

  // Soft radial-like vignette using a centered tinted view
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: W * 0.5,
    borderColor: 'rgba(245,237,228,0.45)',
    borderRadius: W,
    transform: [{ scaleX: 2 }],
  },

  barsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
  },
  energyBar: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  flare: {
    position: 'absolute',
    bottom: H * 0.35,
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W * 0.45,
    backgroundColor: 'transparent',
    shadowColor: C.rose,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 0,
  },

  barbellWrap: {
    position: 'absolute',
    top: H * 0.32,
    flexDirection: 'row',
    alignItems: 'center',
    width: W * 0.88,
  },
  plate: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateLeft: { marginRight: -2 },
  plateRight: { marginLeft: -2 },
  plateFace: {
    width: 38,
    height: 100,
    backgroundColor: C.white,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(196,60,80,0.3)',
    shadowColor: C.rose,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  plateInner: {
    width: 24,
    height: 82,
    backgroundColor: C.offWhite,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(196,60,80,0.18)',
  },
  plateCore: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.rose,
    shadowColor: C.rose,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  barbellBar: {
    flex: 1,
    height: 16,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(196,60,80,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.rose,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  barbellBarInner: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(196,60,80,0.08)',
  },
  barbellKnurl: {
    position: 'absolute',
    left: '25%',
    width: '20%',
    height: 14,
    borderRadius: 2,
    backgroundColor: C.offWhite,
    borderWidth: 1,
    borderColor: 'rgba(196,60,80,0.18)',
  },
  barbellKnurlRight: {
    position: 'absolute',
    right: '25%',
    width: '20%',
    height: 14,
    borderRadius: 2,
    backgroundColor: C.offWhite,
    borderWidth: 1,
    borderColor: 'rgba(196,60,80,0.18)',
  },

  impactRing: {
    position: 'absolute',
    top: H * 0.32,
    width: W * 0.95,
    height: 110,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.rose,
    backgroundColor: C.roseFaint,
  },

  logoWrap: {
    alignItems: 'center',
    gap: 6,
    marginTop: 40,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: W * 0.72,
  },
  lineSide: {
    flex: 1,
    height: 1,
    backgroundColor: C.rose,
  },
  lineDiamond: {
    width: 6,
    height: 6,
    backgroundColor: C.rose,
    transform: [{ rotate: '45deg' }],
  },
  logoSuper: {
    fontSize: 22,
    fontWeight: '900',
    color: C.textMain,
    letterSpacing: 18,
    textTransform: 'uppercase',
    marginLeft: 18,
  },
  logoGlow: {
    position: 'absolute',
    top: 28,
    width: W * 0.75,
    height: 80,
    backgroundColor: C.roseLight,
    borderRadius: 40,
    shadowColor: C.rose,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 0,
  },
  logoMain: {
    fontSize: 72,
    fontWeight: '900',
    color: C.textMain,
    letterSpacing: 12,
    textTransform: 'uppercase',
    marginLeft: 12,
    textShadowColor: 'rgba(196,60,80,0.15)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    lineHeight: 80,
  },

  taglineWrap: {
    marginTop: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 9.5,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  badge: {
    position: 'absolute',
    bottom: 48,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(196,60,80,0.3)',
    borderRadius: 2,
    backgroundColor: 'rgba(196,60,80,0.05)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 4,
  },
});