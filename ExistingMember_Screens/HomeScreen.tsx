import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, styles as shared } from '../styles';
import TopBar from '../components/TopBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const DAYS: { key: DayKey; short: string; label: string }[] = [
  { key: 'mon', short: 'M', label: 'Mon' },
  { key: 'tue', short: 'T', label: 'Tue' },
  { key: 'wed', short: 'W', label: 'Wed' },
  { key: 'thu', short: 'T', label: 'Thu' },
  { key: 'fri', short: 'F', label: 'Fri' },
  { key: 'sat', short: 'S', label: 'Sat' },
  { key: 'sun', short: 'S', label: 'Sun' },
];

const JS_TO_KEY: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const naturalTodayKey = JS_TO_KEY[new Date().getDay()];

const DAILY_DATA: Record<DayKey, { focus: string; accent: string; quote: string; burnTarget: string; tip: string }> = {
  mon: {
    focus: 'Chest & Triceps Push',
    accent: '#2563eb',
    quote: '⚡ "Quality is not an act, it is a habit. Smash this push routine."',
    burnTarget: '550 kcal',
    tip: 'Fuel up on multi-source complex carbs 2 hours before your heavy presses.'
  },
  tue: {
    focus: 'Back & Biceps Pull',
    accent: '#059669',
    quote: '📐 "Success isn\'t always about greatness. It\'s about consistency."',
    burnTarget: '600 kcal',
    tip: 'Focus heavily on row contractions to maximize back thickness layout.'
  },
  wed: {
    focus: 'Shoulders & Core Power',
    accent: '#7c3aed',
    quote: '🦅 "Do something today that your future self will thank you for."',
    burnTarget: '500 kcal',
    tip: 'Keep structural execution clean on overhead sets to shield delts joints.'
  },
  thu: {
    focus: 'Leg Day Hypertrophy',
    accent: '#dc2626',
    quote: '🦵 "Don\'t decrease the goal. Increase your execution effort down on the platform."',
    burnTarget: '750 kcal',
    tip: 'Leg days burn massive energy reserves. Keep hydration exceptionally high.'
  },
  fri: {
    focus: 'Arms Hypertrophy Burn',
    accent: '#db2777',
    quote: '🔥 "The only bad workout is the session that didn\'t happen."',
    burnTarget: '480 kcal',
    tip: 'Lock your mechanical arm pivot lines tight to completely isolate bicep heads.'
  },
  sat: {
    focus: 'Posterior Chain & Calves',
    accent: '#d97706',
    quote: '🏃 "Great things come from hard work and perseverance. No excuses."',
    burnTarget: '520 kcal',
    tip: 'Engage glutes and hamstring tissue firmly at the peak extension arcs.'
  },
  sun: {
    focus: 'System Recovery Rest',
    accent: '#6b7280',
    quote: '🧘‍♂️ "Rest, reset, and re-feed. Your muscle fibers construct themselves during recovery."',
    burnTarget: 'Active Rest',
    tip: 'Prioritize structural joint mobilization work and baseline walking parameters.'
  },
};

export default function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const insets = useSafeAreaInsets();

  const [selectedDay, setSelectedDay] = useState<DayKey>(naturalTodayKey);
  const [isExpanded, setIsExpanded] = useState(false);

  const dayConfig = DAILY_DATA[selectedDay];

  const [tasks, setTasks] = useState([
    { id: 1, label: 'Complete Scheduled Workout Routine', done: false, time: '45-60 mins' },
    { id: 2, label: 'Log All Meals in Target Diet Plan', done: false, time: 'Daily Target' },
    { id: 3, label: 'Meet Daily Hydration Target (3.5L)', done: false, time: 'Track Fluid' },
  ]);

  // ── Entrance and Layout Drivers ───────────────────────────────────────────
  const fadeHero = useRef(new Animated.Value(0)).current;
  const slideHero = useRef(new Animated.Value(30)).current;
  const fadeStats = useRef(new Animated.Value(0)).current;
  const slideStats = useRef(new Animated.Value(30)).current;
  const fadeRoadmap = useRef(new Animated.Value(0)).current;
  const slideRoadmap = useRef(new Animated.Value(30)).current;
  const fadeBanner = useRef(new Animated.Value(0)).current;
  const slideBanner = useRef(new Animated.Value(30)).current;

  const fadeCalendar = useRef(new Animated.Value(0)).current;
  const slideCalendar = useRef(new Animated.Value(15)).current;
  const fadeQuote = useRef(new Animated.Value(0)).current;
  const slideQuote = useRef(new Animated.Value(20)).current;

  // Layout Animation Timers
  const calendarExpandAnim = useRef(new Animated.Value(0)).current;
  const chipSelectionScale = useRef(new Animated.Value(1)).current;
  const statScales = useRef([0, 1, 2].map(() => new Animated.Value(0.7))).current;

  const badgePulse = useRef(new Animated.Value(1)).current;
  const emojiFloat = useRef(new Animated.Value(0)).current;
  const quotePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(90, [
      Animated.parallel([
        Animated.timing(fadeHero, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideHero, { toValue: 0, speed: 14, bounciness: 8, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeCalendar, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideCalendar, { toValue: 0, speed: 12, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeQuote, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(slideQuote, { toValue: 0, speed: 12, bounciness: 4, useNativeDriver: true }),
      ]),
      Animated.stagger(60, statScales.map(scale =>
        Animated.spring(scale, { toValue: 1, speed: 12, bounciness: 14, useNativeDriver: true })
      )),
      Animated.parallel([
        Animated.timing(fadeStats, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideStats, { toValue: 0, speed: 14, bounciness: 6, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeRoadmap, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideRoadmap, { toValue: 0, speed: 14, bounciness: 6, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBanner, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideBanner, { toValue: 0, speed: 14, bounciness: 8, useNativeDriver: true }),
      ]),
    ]).start();

    // Loops setup
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, { toValue: 1.12, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(badgePulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(emojiFloat, { toValue: -6, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(emojiFloat, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(quotePulse, { toValue: 1.015, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(quotePulse, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleDaySelect = (key: DayKey) => {
    setSelectedDay(key);
    chipSelectionScale.setValue(0.85);
    Animated.spring(chipSelectionScale, {
      toValue: 1,
      tension: 50,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const toggleExpandCalendar = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(calendarExpandAnim, {
      toValue,
      tension: 38,
      friction: 8,
      useNativeDriver: false, // Required false for dynamic flex layout box adjustments
    }).start();
    setIsExpanded(!isExpanded);
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Intermediate interpolation maps for structural drawer metrics
  const drawerHeight = calendarExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 205],
  });

  const drawerOpacity = calendarExpandAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const chevronRotate = calendarExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);

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
        <Animated.View style={[styles.heroSection, { opacity: fadeHero, transform: [{ translateY: slideHero }] }]}>
          <Text style={shared.capsLabel}>Good Morning</Text>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitle}>Welcome to{'\n'}Your Sanctuary </Text>
            <Animated.Text style={[styles.heroEmoji, { transform: [{ translateY: emojiFloat }] }]}>
              🌿
            </Animated.Text>
          </View>
        </Animated.View>

        {/* ── DAILY FOCUS MINDSET QUOTE ─────────────────────────────────── */}
        <Animated.View style={[styles.quoteBox, { opacity: fadeQuote, transform: [{ translateY: slideQuote }, { scale: quotePulse }] }]}>
          <Text style={styles.quoteTitleText}>DAILY FOCUS MINDSET</Text>
          <Text style={styles.quoteBodyText}>{dayConfig.quote}</Text>
        </Animated.View>

        {/* ── BOTH CHIPS & FULL MONTH COMBINED EXPANDABLE CALENDAR ──────── */}
        <Animated.View style={[styles.calendarCard, { opacity: fadeCalendar, transform: [{ translateY: slideCalendar }] }]}>

          {/* Header Card (Triggers Drawer) */}
          <TouchableOpacity
            style={styles.calendarHeaderRow}
            activeOpacity={0.7}
            onPress={toggleExpandCalendar}
          >
            <View>
              <Text style={styles.cardHeaderTitle}>Routine Calendar Schedule</Text>
              <Text style={styles.calendarSubhead}>May 2026 · Tap arrow to view full month</Text>
            </View>
            <Animated.View style={[styles.chevronContainer, { transform: [{ rotate: chevronRotate }] }]}>
              <Text style={styles.chevronText}>▼</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Persistent Weekly Chips Layout (Always Visible) */}
          <View style={styles.calendarRowContainer}>
            {DAYS.map((day) => {
              const isSelectedDay = day.key === selectedDay;
              const isNaturalToday = day.key === naturalTodayKey;
              return (
                <TouchableOpacity
                  key={day.key}
                  activeOpacity={0.8}
                  onPress={() => handleDaySelect(day.key)}
                  style={[
                    styles.calendarDayChip,
                    isSelectedDay && { backgroundColor: dayConfig.accent, borderColor: dayConfig.accent },
                    isNaturalToday && !isSelectedDay && styles.naturalTodayBorder
                  ]}
                >
                  <Animated.Text style={[
                    styles.calendarDayText,
                    isSelectedDay && styles.calendarDayTextOn,
                    { transform: [{ scale: isSelectedDay ? chipSelectionScale : 1 }] }
                  ]}>
                    {day.short}
                  </Animated.Text>
                  <Text style={[styles.calendarLabelText, isSelectedDay && styles.calendarLabelTextOn]}>{day.label}</Text>
                  {isSelectedDay && <View style={styles.calendarActiveCoreDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Expandable Lower Monthly Grid Content */}
          <Animated.View style={[styles.drawerContainer, { height: drawerHeight, opacity: drawerOpacity }]}>
            <View style={styles.monthGridDivider} />
            <View style={styles.weeksHeaderRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, idx) => (
                <Text key={idx} style={styles.weekHeaderText}>{w}</Text>
              ))}
            </View>
            <View style={styles.monthGridDaysMatrix}>
              {/* Padding elements corresponding to calendar week configurations offsets */}
              <View style={{ width: '13.5%', height: 26 }} />
              <View style={{ width: '13.5%', height: 26 }} />
              <View style={{ width: '13.5%', height: 26 }} />
              <View style={{ width: '13.5%', height: 26 }} />

              {currentMonthDays.map((dateNum) => {
                const checkToday = dateNum === 20; // Matches system clock context parameter metrics
                return (
                  <View
                    key={dateNum}
                    style={[styles.monthDateCell, checkToday && { backgroundColor: dayConfig.accent + '22', borderRadius: 6 }]}
                  >
                    <Text style={[styles.monthDateCellText, checkToday && { color: dayConfig.accent, fontWeight: '900' }]}>
                      {dateNum}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        </Animated.View>

        {/* ── TODAY\'S TARGET BODY FOCUS BLOCK ─────────────────────────── */}
        <Animated.View style={[styles.bodyFocusCard, { opacity: fadeQuote, borderLeftColor: dayConfig.accent }]}>
          <View style={styles.bodyFocusIconLayout}>
            <Text style={styles.bodyFocusIconEmoji}>🏋️‍♂️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bodyFocusHeaderLabel}>CURRENT TARGETED MUSCLES</Text>
            <Text style={styles.bodyFocusValueText}>{dayConfig.focus}</Text>
          </View>
          <View style={[styles.statusTargetIndicator, { backgroundColor: dayConfig.accent + '22' }]}>
            <Text style={[styles.statusIndicatorText, { color: dayConfig.accent }]}>Active Today</Text>
          </View>
        </Animated.View>

        {/* ── QUICK STATS GRID WITH DYNAMIC CALORIE INTENSITY ─────────── */}
        <Animated.View style={[styles.statsGrid, { opacity: fadeStats, transform: [{ translateY: slideStats }] }]}>
          <Animated.View style={[styles.statCard, { transform: [{ scale: statScales[0] }] }]}>
            <Text style={styles.statIcon}>🏋️</Text>
            <Text style={styles.statValue}>3 Completed</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </Animated.View>

          <Animated.View style={[styles.statCard, { transform: [{ scale: statScales[1] }] }]}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statValue}>5 Days</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </Animated.View>

          <Animated.View style={[styles.statCard, { transform: [{ scale: statScales[2] }] }]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={[styles.statValue, { color: '#dc2626' }]}>{dayConfig.burnTarget}</Text>
            <Text style={styles.statLabel}>Burn Goal</Text>
          </Animated.View>
        </Animated.View>

        {/* ── TODAY\'S ACTIVE SESSION ROADMAP (CHECKLIST) ── */}
        <Animated.View style={[styles.section, { opacity: fadeRoadmap, transform: [{ translateY: slideRoadmap }] }]}>
          <Text style={styles.sectionTitle}>Today's Session Roadmap</Text>
          <View style={styles.roadmapContainer}>
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskRow, task.done && styles.taskRowDone]}
                activeOpacity={0.8}
                onPress={() => toggleTask(task.id)}
              >
                <View style={[styles.checkbox, task.done && { backgroundColor: dayConfig.accent, borderColor: dayConfig.accent }]}>
                  {task.done && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.taskLabel, task.done && styles.taskLabelDone]}>
                    {task.label}
                  </Text>
                  <Text style={styles.taskMeta}>{task.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ── NUTRITION FUEL STRATEGY MODULE ─────────────────────────── */}
        <Animated.View style={[styles.section, { opacity: fadeBanner }]}>
          <View style={[styles.announcementCard, { borderLeftWidth: 4, borderLeftColor: '#d97706', backgroundColor: '#fffdfa' }]}>
            <Text style={[styles.announcementBadge, { color: '#d97706' }]}>🍏 NUTRITION PACING ADVICE</Text>
            <Text style={styles.announcementTitle}>Optimize Your Muscle Fuel</Text>
            <Text style={styles.announcementBody}>{dayConfig.tip}</Text>
          </View>
        </Animated.View>

        {/* ── Announcement Banner ───────────────────────────────── */}
        <Animated.View style={[styles.section, styles.sectionLast, { opacity: fadeBanner, transform: [{ translateY: slideBanner }] }]}>
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
  scrollContent: { paddingTop: 8 },

  // Hero
  heroSection: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 10, gap: 4 },
  heroTitleRow: { flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap' },
  heroTitle: { fontSize: 28, fontWeight: '900', color: C.primary, letterSpacing: -0.5, lineHeight: 34 },
  heroEmoji: { fontSize: 26, marginBottom: 2 },

  // Quote Box Layout
  quoteBox: { marginHorizontal: 24, marginTop: 8, marginBottom: 12, padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 1 },
  quoteTitleText: { fontSize: 9, fontWeight: '800', color: '#64748b', letterSpacing: 1.2, marginBottom: 6 },
  quoteBodyText: { fontSize: 14, fontWeight: '600', color: '#334155', fontStyle: 'italic', lineHeight: 20 },

  // Combined Persistent Chips + Monthly Expansion Grid Style Properties
  calendarCard: { backgroundColor: '#fff', marginHorizontal: 24, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 1, overflow: 'hidden' },
  calendarHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardHeaderTitle: { fontSize: 13, fontWeight: '900', color: '#1e293b', letterSpacing: 0.1 },
  calendarSubhead: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginTop: 1 },
  chevronContainer: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  chevronText: { fontSize: 10, color: '#94a3b8' },

  calendarRowContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calendarDayChip: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 4, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#f8fafc', minWidth: (SCREEN_WIDTH - 84) / 7 },
  naturalTodayBorder: { borderColor: '#cbd5e1', borderWidth: 1.5 },
  calendarDayText: { fontSize: 13, fontWeight: '900', color: '#1e293b' },
  calendarDayTextOn: { color: '#fff' },
  calendarLabelText: { fontSize: 9, color: '#64748b', fontWeight: '600', marginTop: 2 },
  calendarLabelTextOn: { color: 'rgba(255,255,255,0.85)' },
  calendarActiveCoreDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#fff', marginTop: 4 },

  // Month Grid Container Elements
  drawerContainer: { overflow: 'hidden' },
  monthGridDivider: { height: 1, backgroundColor: '#f1f5f9', marginTop: 14, marginBottom: 12 },
  weeksHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, marginBottom: 8 },
  weekHeaderText: { width: '13.5%', fontSize: 10, fontWeight: '800', color: '#94a3b8', textAlign: 'center' },
  monthGridDaysMatrix: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 6, rowGap: 6 },
  monthDateCell: { width: '13.5%', height: 26, justifyContent: 'center', alignItems: 'center' },
  monthDateCellText: { fontSize: 11, fontWeight: '700', color: '#64748b' },

  // Body Focus Tracker
  bodyFocusCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 24, padding: 14, borderRadius: 16, borderLeftWidth: 4, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1, gap: 12 },
  bodyFocusIconLayout: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  bodyFocusIconEmoji: { fontSize: 20 },
  bodyFocusHeaderLabel: { fontSize: 9, fontWeight: '800', color: '#64748b', letterSpacing: 1 },
  bodyFocusValueText: { fontSize: 15, fontWeight: '900', color: '#0f172a', marginTop: 2 },
  statusTargetIndicator: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusIndicatorText: { fontSize: 11, fontWeight: '800' },

  // Stats Grid Layout Configuration
  statsGrid: { flexDirection: 'row', marginHorizontal: 24, gap: 8, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', padding: 12, alignItems: 'center', gap: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 14, fontWeight: '900', color: '#1e293b', textAlign: 'center' },
  statLabel: { fontSize: 9, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Section Defaults Header Core Structure
  section: { paddingHorizontal: 24, paddingTop: 16, gap: 12 },
  sectionLast: { paddingBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: C.primary, letterSpacing: -0.3 },

  // Roadmap Checklist Styles
  roadmapContainer: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', padding: 12, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9' },
  taskRowDone: { backgroundColor: '#fafafa', opacity: 0.7, borderColor: '#e2e8f0' },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#cbd5e1', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '900', marginTop: -2 },
  taskLabel: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  taskLabelDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  taskMeta: { fontSize: 11, color: '#64748b', fontWeight: '600', marginTop: 2 },

  // Announcement Layout Cards Elements
  announcementCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', padding: 16, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  announcementBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.primary },
  announcementBadge: { fontSize: 10, fontWeight: '800', color: C.primary, letterSpacing: 1 },
  announcementTitle: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  announcementBody: { fontSize: 13, color: '#64748b', lineHeight: 19, fontWeight: '500' },
});