import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../styles';
import TopBar from '../components/TopBar';

const MACHINERY_CATEGORIES = [
    {
        category: 'Free Weights',
        icon: '🏋️',
        color: '#800000',
        items: [
            {
                name: 'Olympic Barbells',
                desc: 'Custom-milled 20 kg bars with precision bearings. IWF-spec knurling and centre marking for Olympic lifts.',
                image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
            },
            {
                name: 'Power Racks',
                desc: 'Competition-grade racks with band pegs, monolift attachments and safeties. Rated to 1500 lbs.',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
            },
            {
                name: 'Dumbbells 2–100kg',
                desc: 'Rubber hex dumbbells with knurled chrome handles across the full range from 2 kg to 100 kg.',
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
            },
        ],
    },
    {
        category: 'Machines',
        icon: '⚙️',
        color: '#815344',
        items: [
            {
                name: 'Cable Machines',
                desc: 'Dual-stack functional trainers with 200 lbs per stack and 18 pulley positions for full range of motion.',
                image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400',
            },
            {
                name: 'Leg Press & Hack Squat',
                desc: 'Plate-loaded leg press with 45-degree angle and a dedicated hack squat station with roller pads.',
                image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
            },
            {
                name: 'Smith Machine',
                desc: 'Counter-balanced Smith machine with linear bearings for smooth, controlled pressing movements.',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
            },
        ],
    },
    {
        category: 'Cardio',
        icon: '🏃',
        color: '#382300',
        items: [
            {
                name: 'Assault Bikes',
                desc: 'Air-resistance fan bikes for high-intensity interval training. Unlimited resistance as you push harder.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            },
            {
                name: 'Concept2 Rowers',
                desc: 'World-class rowing ergometers used in competition. Performance monitor tracks every split.',
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
            },
            {
                name: 'SkiErg',
                desc: 'Full-body skiing motion targeting lats, core and legs simultaneously. Brutal and effective.',
                image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400',
            },
        ],
    },
    {
        category: 'Recovery',
        icon: '🧘',
        color: '#5a413d',
        items: [
            {
                name: 'Infrared Sauna Pods',
                desc: 'Full-spectrum infrared sauna cabins promoting deep tissue recovery, detox and improved sleep.',
                image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
            },
            {
                name: 'Contrast Therapy Baths',
                desc: 'Hot-cold plunge pool system. Cycle between 38°C hot tub and 10°C cold bath for peak recovery.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            },
            {
                name: 'Percussion Therapy Station',
                desc: 'Theragun and Hypervolt devices for deep muscle percussive therapy. Self-guided or coached sessions.',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
            },
        ],
    },
];

export default function MachineryScreen({
    onBack,
    onNext,
}: {
    onBack: () => void;
    onNext: () => void;
}) {
    // ✅ Read insets so we can pad the bottom for home-bar / gesture nav
    const insets = useSafeAreaInsets();

    return (
        // ✅ edges prop: 'top' handled here, 'bottom' handled manually via insets
        // This prevents the notch/status-bar overlap on iOS & Android
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right']}   // handles notch + side cutouts
        >
            {/* ✅ Dark icons on light background; translucent keeps bg colour */}
            <StatusBar style="dark" translucent={false} backgroundColor="#fff8f3" />

            {/* TopBar sits immediately below the safe area — no overlap */}
            <TopBar onBack={onBack} title="Our Equipment" />

            {/* Progress Indicator */}
            <View style={styles.progressBar}>
                <View style={[styles.progressStep, styles.progressDone]} />
                <View style={[styles.progressStep, styles.progressActive]} />
                <View style={styles.progressStep} />
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    // ✅ Add bottom inset so content clears the home indicator / nav bar
                    { paddingBottom: insets.bottom + 40 },
                ]}
                showsVerticalScrollIndicator={false}
                // ✅ Keeps scroll indicator inside the safe area
                scrollIndicatorInsets={{ bottom: insets.bottom }}
            >
                {/* Header */}
                <View style={styles.headerSection}>
                    <Text style={styles.capsLabel}>OUR ARSENAL</Text>
                    <Text style={styles.pageTitle}>World-Class{'\n'}Machinery</Text>
                    <Text style={styles.pageSubtitle}>
                        Every piece of equipment is hand-selected to support your performance
                        goals — from raw strength to precision recovery.
                    </Text>
                </View>

                {/* Categories */}
                {MACHINERY_CATEGORIES.map((cat, ci) => (
                    <View key={ci} style={styles.categorySection}>
                        <View style={[styles.categoryHeader, { backgroundColor: cat.color }]}>
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                            <Text style={styles.categoryName}>{cat.category}</Text>
                        </View>

                        {cat.items.map((item, ii) => (
                            <View key={ii} style={styles.machineCard}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.machineImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.machineInfo}>
                                    <Text style={styles.machineName}>{item.name}</Text>
                                    <Text style={styles.machineDesc}>{item.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Floor Plan Highlight */}
                <View style={styles.floorHighlight}>
                    <Text style={styles.floorTitle}>8,000 sq ft of{'\n'}Pure Performance</Text>
                    <Text style={styles.floorDesc}>
                        Our facility is divided into four dedicated zones — Strength, Functional,
                        Cardio and Recovery — each designed to eliminate crowding and maximise
                        your focus.
                    </Text>
                    <View style={styles.floorStats}>
                        {[
                            { label: 'Power Racks', value: '12' },
                            { label: 'Cable Stations', value: '8' },
                            { label: 'Cardio Units', value: '15' },
                            { label: 'Recovery Pods', value: '6' },
                        ].map((s, i) => (
                            <View key={i} style={styles.floorStat}>
                                <Text style={styles.floorStatNum}>{s.value}</Text>
                                <Text style={styles.floorStatLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Next Button */}
                <View style={styles.bottomActions}>
                    <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.85}>
                        <Text style={styles.nextBtnText}>View Membership Plans →</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff8f3',
    },
    scrollContent: {
        // paddingBottom is set dynamically above using insets
    },

    progressBar: {
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    progressStep: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#e2bfb9',
    },
    progressActive: { backgroundColor: C.primary },
    progressDone: { backgroundColor: C.primary + 'aa' },

    headerSection: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 20,
        gap: 10,
    },
    capsLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        color: C.secondary,
        textTransform: 'uppercase',
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: C.primary,
        letterSpacing: -0.5,
        lineHeight: 38,
    },
    pageSubtitle: {
        fontSize: 14,
        color: C.onSurfaceVariant,
        lineHeight: 22,
    },

    categorySection: {
        marginBottom: 8,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginBottom: 2,
    },
    categoryIcon: { fontSize: 18 },
    categoryName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },

    machineCard: {
        marginHorizontal: 24,
        marginVertical: 6,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        backgroundColor: '#fff',
        flexDirection: 'row',
    },
    machineImage: {
        width: 100,
        height: 100,
    },
    machineInfo: {
        flex: 1,
        padding: 14,
        gap: 5,
        justifyContent: 'center',
    },
    machineName: {
        fontSize: 15,
        fontWeight: '700',
        color: C.onSurface,
    },
    machineDesc: {
        fontSize: 12,
        color: C.onSurfaceVariant,
        lineHeight: 18,
    },

    floorHighlight: {
        marginHorizontal: 24,
        marginTop: 20,
        backgroundColor: '#800000',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#000',
        padding: 20,
        gap: 12,
    },
    floorTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 30,
    },
    floorDesc: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 20,
    },
    floorStats: {
        flexDirection: 'row',
        marginTop: 4,
    },
    floorStat: {
        flex: 1,
        alignItems: 'center',
        borderRightWidth: 0.5,
        borderRightColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8,
    },
    floorStatNum: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },
    floorStatLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.65)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 2,
        textAlign: 'center',
    },

    bottomActions: {
        paddingHorizontal: 24,
        paddingTop: 28,
    },
    nextBtn: {
        backgroundColor: C.primary,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    nextBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});