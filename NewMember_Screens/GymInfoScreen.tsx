import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  StatusBar as RNStatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { C } from '../styles';
import TopBar from '../components/TopBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ANDROID_STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 0;

// ─── Data ──────────────────────────────────────────────────────────────────

const PHOTOS = [
  { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', label: 'Strength Floor' },
  { uri: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', label: 'Recovery Suite' },
  { uri: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800', label: 'Members Lounge' },
  { uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', label: 'Wellness Spa' },
  { uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', label: 'Cardio Zone' },
  { uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', label: 'Functional Area' },
];

const OFFERS = [
  { icon: '🏋️', title: 'Olympic Strength Floor', desc: 'Competition-grade racks, custom barbells and precision cable machines for serious lifters.' },
  { icon: '🧖', title: 'Recovery & Spa Suite', desc: 'Cold plunge pools, infrared saunas and massage chairs to restore your body after every session.' },
  { icon: '☕', title: 'Nutrition Lounge', desc: 'Cold-pressed juices, performance shakes and post-workout meals crafted by our in-house dietitian.' },
  { icon: '👩‍🏫', title: 'Expert Coaching', desc: 'World-class strength specialists who build personalised programmes tailored to your body and goals.' },
  { icon: '📊', title: 'Smart Performance Lab', desc: 'Force plates, velocity trackers and DEXA body scans — real data so you can train smarter.' },
  { icon: '🔑', title: '24 / 7 Access', desc: 'Keyless private entry for all members. Train on your schedule, not ours.' },
];

const INFO = [
  { icon: '📍', label: 'Address', value: 'Plot 12, VIP Road, Arera Colony\nBhopal — 462016, Madhya Pradesh' },
  { icon: '🕐', label: 'Weekdays  (Mon – Fri)', value: '5:00 AM – 11:00 PM' },
  { icon: '🕐', label: 'Weekends  (Sat – Sun)', value: '6:00 AM – 10:00 PM' },
  { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
  { icon: '✉️', label: 'Email', value: 'hello@sanctuary.gym.in' },
];

// ─── Animation hook ─────────────────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 550, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Screen ─────────────────────────────────────────────────────────────────
export default function GymInfoScreen({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={{ height: ANDROID_STATUS_BAR_HEIGHT }} />
      <TopBar onBack={onBack} title="About Our Gym" />

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressStep, styles.progressActive]} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── 1. Hero photo ── */}
        <HeroPhoto />

        {/* ── 2. About text ── */}
        <AboutSection />

        {/* ── 3. Photo gallery ── */}
        <GallerySection />

        {/* ── 4. What we offer ── */}
        <OfferSection />

        {/* ── 5. Hours & location ── */}
        <VisitSection />

        {/* ── 6. CTA button ── */}
        <CTASection onNext={onNext} />

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Hero photo ─────────────────────────────────────────────────────────────
function HeroPhoto() {
  const anim = useFadeUp(0);
  return (
    <Animated.View style={[styles.heroWrap, anim]}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900' }}
        style={styles.heroImg}
        resizeMode="cover"
      />
      {/* Dim overlay + pill badges */}
      <View style={styles.heroOverlay}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>Est. 2019</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>⭐ 4.9 Rating</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>MP's #1 Gym</Text></View>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── About section ──────────────────────────────────────────────────────────
function AboutSection() {
  const t = useFadeUp(100);
  const b = useFadeUp(220);
  return (
    <View style={styles.section}>
      <Animated.Text style={[styles.overline, t]}>WHO WE ARE</Animated.Text>
      <Animated.Text style={[styles.h1, t]}>The Sanctuary{'\n'}of Strength</Animated.Text>

      <Animated.Text style={[styles.body, b]}>
        Welcome to The Sanctuary — Bhopal's most complete strength and wellness club. Founded in
        2019, we built an 8,000 sq ft space that combines competition-grade equipment, expert
        coaches and a recovery environment that actually helps you come back stronger.
      </Animated.Text>
      <Animated.Text style={[styles.body, b]}>
        Whether you're picking up a barbell for the first time or chasing a personal record, our
        team and our facility are fully equipped to meet you where you are and take you further.
      </Animated.Text>

      {/* Stats strip */}
      <Animated.View style={[styles.statsStrip, b]}>
        {[
          { n: '500+', l: 'Members' },
          { n: '12', l: 'Trainers' },
          { n: '8K sqft', l: 'Space' },
          { n: '24 / 7', l: 'Access' },
        ].map((s, i) => (
          <View key={i} style={[styles.statCell, i < 3 && styles.statDivider]}>
            <Text style={styles.statNum}>{s.n}</Text>
            <Text style={styles.statLbl}>{s.l}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

// ─── Gallery section ─────────────────────────────────────────────────────────
function GallerySection() {
  const t = useFadeUp(160);
  return (
    <View style={styles.section}>
      <Animated.Text style={[styles.overline, t]}>INSIDE THE SANCTUARY</Animated.Text>
      <Animated.Text style={[styles.h2, t]}>Our Space</Animated.Text>
      <View style={styles.grid}>
        {PHOTOS.map((p, i) => (
          <PhotoCard key={i} photo={p} delay={200 + i * 70} />
        ))}
      </View>
    </View>
  );
}

function PhotoCard({ photo, delay }: { photo: typeof PHOTOS[0]; delay: number }) {
  const anim = useFadeUp(delay);
  return (
    <Animated.View style={[styles.photoCard, anim]}>
      <Image source={{ uri: photo.uri }} style={styles.photoImg} resizeMode="cover" />
      <View style={styles.photoOverlay}>
        <Text style={styles.photoLabel}>{photo.label}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Offer section ───────────────────────────────────────────────────────────
function OfferSection() {
  const t = useFadeUp(160);
  return (
    <View style={styles.section}>
      <Animated.Text style={[styles.overline, t]}>WHAT WE OFFER</Animated.Text>
      <Animated.Text style={[styles.h2, t]}>Everything You Need</Animated.Text>
      {OFFERS.map((o, i) => (
        <OfferRow key={i} item={o} delay={200 + i * 80} />
      ))}
    </View>
  );
}

function OfferRow({ item, delay }: { item: typeof OFFERS[0]; delay: number }) {
  const anim = useFadeUp(delay);
  return (
    <Animated.View style={[styles.offerRow, anim]}>
      <View style={styles.offerIcon}>
        <Text style={{ fontSize: 22 }}>{item.icon}</Text>
      </View>
      <View style={styles.offerText}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDesc}>{item.desc}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Visit section ───────────────────────────────────────────────────────────
function VisitSection() {
  const t = useFadeUp(160);
  const c = useFadeUp(260);
  return (
    <View style={styles.section}>
      <Animated.Text style={[styles.overline, t]}>VISIT US</Animated.Text>
      <Animated.Text style={[styles.h2, t]}>Hours & Location</Animated.Text>
      <Animated.View style={[styles.infoCard, c]}>
        {INFO.map((row, i) => (
          <View key={i} style={[styles.infoRow, i < INFO.length - 1 && styles.infoRowLine]}>
            <Text style={styles.infoEmoji}>{row.icon}</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

// ─── CTA ────────────────────────────────────────────────────────────────────
function CTASection({ onNext }: { onNext: () => void }) {
  const anim = useFadeUp(280);
  return (
    <Animated.View style={[styles.ctaWrap, anim]}>
      <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.85}>
        <Text style={styles.nextBtnText}>View Our Equipment →</Text>
      </TouchableOpacity>
      <Text style={styles.ctaNote}>Free 3-day trial  •  No commitment  •  Cancel anytime</Text>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff8f3' },
  scroll: { paddingBottom: 52 },

  progressBar: { flexDirection: 'row', gap: 6, paddingHorizontal: 24, paddingVertical: 12 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#e2bfb9' },
  progressActive: { backgroundColor: C.primary },

  /* Hero */
  heroWrap: { borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#000', overflow: 'hidden' },
  heroImg: { width: '100%', height: 260 },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingBottom: 14,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#222' },

  /* Section */
  section: { paddingHorizontal: 24, paddingTop: 32, gap: 12 },

  /* Typography */
  overline: { fontSize: 10, fontWeight: '700', letterSpacing: 2.2, color: C.secondary, textTransform: 'uppercase' },
  h1: { fontSize: 32, fontWeight: '800', color: C.primary, letterSpacing: -0.5, lineHeight: 38 },
  h2: { fontSize: 22, fontWeight: '800', color: C.primary, letterSpacing: -0.3, marginTop: -2 },
  body: { fontSize: 14, color: C.onSurfaceVariant, lineHeight: 23 },

  /* Stats strip */
  statsStrip: {
    flexDirection: 'row', marginTop: 4,
    backgroundColor: C.primary, borderRadius: 14,
    borderWidth: 2, borderColor: '#000', overflow: 'hidden',
  },
  statCell: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  statDivider: { borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.22)' },
  statNum: { fontSize: 16, fontWeight: '800', color: '#fff' },
  statLbl: { fontSize: 9, fontWeight: '600', color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },

  /* Photo grid */
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoCard: {
    width: (SCREEN_WIDTH - 58) / 2, height: 140,
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
  },
  photoImg: { width: '100%', height: '100%' },
  photoOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.44)',
    paddingVertical: 7, paddingHorizontal: 10,
  },
  photoLabel: { fontSize: 12, fontWeight: '700', color: '#fff' },

  /* Offer rows */
  offerRow: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  offerIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#ffebce',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  offerText: { flex: 1, gap: 3 },
  offerTitle: { fontSize: 15, fontWeight: '700', color: C.onSurface },
  offerDesc: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 19 },

  /* Info card */
  infoCard: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2,
  },
  infoRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', padding: 16 },
  infoRowLine: { borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.07)' },
  infoEmoji: { fontSize: 20, marginTop: 1 },
  infoLabel: { fontSize: 10, fontWeight: '700', color: C.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  infoValue: { fontSize: 14, color: C.onSurface, lineHeight: 21 },

  /* CTA */
  ctaWrap: { paddingHorizontal: 24, paddingTop: 32, gap: 10 },
  nextBtn: {
    backgroundColor: C.primary, paddingVertical: 17,
    borderRadius: 12, alignItems: 'center',
    borderWidth: 2, borderColor: '#000',
    shadowColor: C.primary, shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 5,
  },
  nextBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  ctaNote: { textAlign: 'center', fontSize: 12, color: C.onSurfaceVariant },
});