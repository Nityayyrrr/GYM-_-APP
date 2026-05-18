import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, styles as shared } from '../styles';
import TopBar from '../components/TopBar';

const QUICK_STATS = [
  { icon: '🏋️', label: 'Workouts', value: '0' },
  { icon: '📅', label: 'Streak', value: '0 days' },
  { icon: '🌿', label: 'Recovery', value: 'Ready' },
  { icon: '🔥', label: 'Calories', value: '—' },
];

const QUICK_ACTIONS = [
  { icon: '📋', label: 'My Plan', color: '#800000' },
  { icon: '🏃', label: 'Start Session', color: '#815344' },
  { icon: '📊', label: 'Progress', color: '#382300' },
  { icon: '🧘', label: 'Recovery', color: '#5a413d' },
];

export default function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const insets = useSafeAreaInsets();

  // ── Entrance anims ──────────────────────────────────────────────────────
  const fadeHero = useRef(new Animated.Value(0)).current;
  const slideHero = useRef(new Animated.Value(30)).current;
  const fadeStats = useRef(new Animated.Value(0)).current;
  const slideStats = useRef(new Animated.Value(30)).current;
  const fadeActions = useRef(new Animated.Value(0)).current;
  const slideActions = useRef(new Animated.Value(30)).current;
  const fadeBanner = useRef(new Animated.Value(0)).current;
  const slideBanner = useRef(new Animated.Value(30)).current;

  // Per-stat card scale bounce
  const statScales = useRef(QUICK_STATS.map(() => new Animated.Value(0.7))).current;

  // Per-action card scale bounce
  const actionScales = useRef(QUICK_ACTIONS.map(() => new Animated.Value(0.7))).current;

  // Press scales for action cards
  const actionPressScales = useRef(QUICK_ACTIONS.map(() => new Animated.Value(1))).current;

  // Continuous pulse on the announcement badge dot
  const badgePulse = useRef(new Animated.Value(1)).current;

  // Hero emoji float
  const emojiFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Staggered entrance ──────────────────────────────────────────────
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(fadeHero, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideHero, { toValue: 0, speed: 14, bounciness: 8, useNativeDriver: true }),
      ]),
      Animated.stagger(60, statScales.map(scale =>
        Animated.spring(scale, { toValue: 1, speed: 12, bounciness: 14, useNativeDriver: true })
      )),
      Animated.parallel([
        Animated.timing(fadeStats, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideStats, { toValue: 0, speed: 14, bounciness: 6, useNativeDriver: true }),
      ]),
      Animated.stagger(60, actionScales.map(scale =>
        Animated.spring(scale, { toValue: 1, speed: 12, bounciness: 14, useNativeDriver: true })
      )),
      Animated.parallel([
        Animated.timing(fadeActions, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideActions, { toValue: 0, speed: 14, bounciness: 6, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBanner, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideBanner, { toValue: 0, speed: 14, bounciness: 8, useNativeDriver: true }),
      ]),
    ]).start();

    // ── Continuous: badge pulse ─────────────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, { toValue: 1.15, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(badgePulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // ── Continuous: emoji float ─────────────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(emojiFloat, { toValue: -6, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(emojiFloat, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const pressIn = (s: Animated.Value) =>
    Animated.spring(s, { toValue: 0.93, speed: 50, useNativeDriver: true }).start();
  const pressOut = (s: Animated.Value) =>
    Animated.spring(s, { toValue: 1, speed: 30, bounciness: 10, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" translucent={false} backgroundColor="#fff8f3" />
      <TopBar title="Dashboard" />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        {/* ── Welcome Hero ─────────────────────────────────────── */}
        <Animated.View
          style={[styles.heroSection, { opacity: fadeHero, transform: [{ translateY: slideHero }] }]}
        >
          <Text style={shared.capsLabel}>Good Morning</Text>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitle}>Welcome to{'\n'}Your Sanctuary </Text>
            <Animated.Text style={[styles.heroEmoji, { transform: [{ translateY: emojiFloat }] }]}>
              🌿
            </Animated.Text>
          </View>
          <Text style={styles.heroSubtitle}>
            Your membership is active. The floor is yours.
          </Text>
        </Animated.View>

        {/* ── Quick Stats ──────────────────────────────────────── */}
        <Animated.View
          style={[styles.statsGrid, { opacity: fadeStats, transform: [{ translateY: slideStats }] }]}
        >
          {QUICK_STATS.map((stat, i) => (
            <Animated.View
              key={i}
              style={[styles.statCard, { transform: [{ scale: statScales[i] }] }]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* ── Quick Actions ─────────────────────────────────────── */}
        <Animated.View
          style={[styles.section, { opacity: fadeActions, transform: [{ translateY: slideActions }] }]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <Animated.View
                key={i}
                style={{ width: '47.5%', transform: [{ scale: Animated.multiply(actionScales[i], actionPressScales[i]) }] }}
              >
                <TouchableOpacity
                  style={[styles.actionCard, { backgroundColor: action.color }]}
                  activeOpacity={1}
                  onPressIn={() => pressIn(actionPressScales[i])}
                  onPressOut={() => pressOut(actionPressScales[i])}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* ── Announcement Banner ───────────────────────────────── */}
        <Animated.View
          style={[styles.section, styles.sectionLast, { opacity: fadeBanner, transform: [{ translateY: slideBanner }] }]}
        >
          <View style={styles.announcementCard}>
            <View style={styles.announcementBadgeRow}>
              <Animated.View style={[styles.badgeDot, { transform: [{ scale: badgePulse }] }]} />
              <Text style={styles.announcementBadge}>📢 ANNOUNCEMENT</Text>
            </View>
            <Text style={styles.announcementTitle}>Induction Session Booked</Text>
            <Text style={styles.announcementBody}>
              Your welcome induction with a Forge & Flora trainer is confirmed. Check your email for details.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff8f3' },
  scrollContent: { /* paddingBottom set dynamically */ },

  // Hero
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 10,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  heroEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 15,
    color: C.onSurfaceVariant,
    lineHeight: 22,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 24,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 16, fontWeight: '800', color: C.onSurface },
  statLabel: {
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Section
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  sectionLast: {
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.3,
  },

  // Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000',
    padding: 18,
    gap: 8,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // Announcement
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  announcementBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  announcementBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: C.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  announcementTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.onSurface,
  },
  announcementBody: {
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 20,
  },
});