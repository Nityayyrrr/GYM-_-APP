import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../styles';
import TopBar from '../components/TopBar';

const PLANS = [
    {
        name: 'Seedling',
        tagline: 'Start your journey',
        price: '₹2,999',
        period: '/month',
        color: '#815344',
        textColor: '#fff',
        popular: false,
        features: [
            '✓  Access Mon–Fri (6am–10pm)',
            '✓  Standard strength floor',
            '✓  2 group classes/month',
            '✓  Locker & shower access',
            '✓  App & progress tracking',
            '✗  Coaching sessions',
            '✗  Recovery suite',
            '✗  Nutrition lounge',
        ],
    },
    {
        name: 'Forged',
        tagline: 'Most popular',
        price: '₹5,499',
        period: '/month',
        color: '#800000',
        textColor: '#fff',
        popular: true,
        features: [
            '✓  Unlimited access 24/7',
            '✓  Full strength floor',
            '✓  Unlimited group classes',
            '✓  2 coaching sessions/month',
            '✓  Recovery suite access',
            '✓  Nutrition lounge',
            '✓  Locker & towel service',
            '✗  Personal programming',
        ],
    },
    {
        name: 'Sanctuary',
        tagline: 'Elite membership',
        price: '₹9,999',
        period: '/month',
        color: '#271900',
        textColor: '#fff',
        popular: false,
        features: [
            '✓  Unlimited access 24/7',
            '✓  Full strength floor',
            '✓  Unlimited group classes',
            '✓  4 coaching sessions/month',
            '✓  Full recovery suite',
            '✓  Nutrition lounge + meal plan',
            '✓  Personal programming',
            '✓  Guest passes (2/month)',
        ],
    },
];

const FAQS = [
    {
        q: 'Is there a joining fee?',
        a: 'A one-time joining fee of ₹999 applies to all plans. This covers your induction session and access card.',
    },
    {
        q: 'Can I freeze my membership?',
        a: 'Yes, you can freeze your membership for up to 60 days per year at no extra charge.',
    },
    {
        q: 'What is the minimum commitment?',
        a: 'All plans are on a monthly rolling basis. No long-term contracts required.',
    },
    {
        q: 'Can I upgrade my plan?',
        a: 'Absolutely. You can upgrade at any time and only pay the prorated difference for the remainder of the month.',
    },
];

export default function PlansScreen({
    onBack,
    onJoin,
}: {
    onBack: () => void;
    onJoin: () => void;
}) {
    const [selectedPlan, setSelectedPlan] = useState('Forged');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // ✅ Read bottom inset for home indicator / gesture nav bar
    const insets = useSafeAreaInsets();

    return (
        // ✅ edges handles notch (top) and side cutouts; bottom handled via insets
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

            {/* ✅ translucent=false prevents content drawing behind Android status bar */}
            <StatusBar style="dark" translucent={false} backgroundColor="#fff8f3" />

            <TopBar onBack={onBack} title="Membership Plans" />

            {/* Progress Indicator */}
            <View style={styles.progressBar}>
                <View style={[styles.progressStep, styles.progressDone]} />
                <View style={[styles.progressStep, styles.progressDone]} />
                <View style={[styles.progressStep, styles.progressActive]} />
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    // ✅ Clears home indicator and Android gesture nav bar
                    { paddingBottom: insets.bottom + 48 },
                ]}
                showsVerticalScrollIndicator={false}
                // ✅ Keeps scroll indicator inside safe area
                scrollIndicatorInsets={{ bottom: insets.bottom }}
            >
                {/* Header */}
                <View style={styles.headerSection}>
                    <Text style={styles.capsLabel}>MEMBERSHIP PLANS</Text>
                    <Text style={styles.pageTitle}>Choose Your{'\n'}Path</Text>
                    <Text style={styles.pageSubtitle}>
                        Every membership includes full facility access, app tracking and our
                        welcoming community. Choose the level of support that fits your goals.
                    </Text>
                </View>

                {/* Plans */}
                {PLANS.map((plan, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[
                            styles.planCard,
                            selectedPlan === plan.name && styles.planCardSelected,
                        ]}
                        activeOpacity={0.9}
                        onPress={() => setSelectedPlan(plan.name)}
                    >
                        {plan.popular && (
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularBadgeText}>⭐ MOST POPULAR</Text>
                            </View>
                        )}

                        <View style={[styles.planHeader, { backgroundColor: plan.color }]}>
                            <View>
                                <Text style={styles.planName}>{plan.name}</Text>
                                <Text style={styles.planTagline}>{plan.tagline}</Text>
                            </View>
                            <View style={styles.planPriceBox}>
                                <Text style={styles.planPrice}>{plan.price}</Text>
                                <Text style={styles.planPeriod}>{plan.period}</Text>
                            </View>
                        </View>

                        <View style={styles.planFeatures}>
                            {plan.features.map((f, fi) => (
                                <Text
                                    key={fi}
                                    style={[
                                        styles.planFeature,
                                        f.startsWith('✗') && styles.planFeatureOff,
                                    ]}
                                >
                                    {f}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.planSelectRow}>
                            <View
                                style={[
                                    styles.planRadio,
                                    selectedPlan === plan.name && {
                                        backgroundColor: plan.color,
                                        borderColor: plan.color,
                                    },
                                ]}
                            >
                                {selectedPlan === plan.name && (
                                    <View style={styles.planRadioDot} />
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.planSelectText,
                                    selectedPlan === plan.name && {
                                        color: plan.color,
                                        fontWeight: '700',
                                    },
                                ]}
                            >
                                {selectedPlan === plan.name ? 'Selected' : 'Select this plan'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Annual Savings Banner */}
                <View style={styles.annualBanner}>
                    <Text style={styles.annualIcon}>💡</Text>
                    <View style={styles.annualText}>
                        <Text style={styles.annualTitle}>Save up to 20% annually</Text>
                        <Text style={styles.annualDesc}>
                            Pay for 10 months, get 12. Switch to annual billing after joining.
                        </Text>
                    </View>
                </View>

                {/* FAQ */}
                <View style={styles.faqSection}>
                    <Text style={styles.sectionTitle}>Common Questions</Text>
                    {FAQS.map((faq, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.faqItem}
                            onPress={() => setOpenFaq(openFaq === i ? null : i)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.faqRow}>
                                <Text style={styles.faqQuestion}>{faq.q}</Text>
                                <Text style={styles.faqChevron}>
                                    {openFaq === i ? '▲' : '▼'}
                                </Text>
                            </View>
                            {openFaq === i && (
                                <Text style={styles.faqAnswer}>{faq.a}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* CTA */}
                <View style={styles.ctaSection}>
                    <Text style={styles.ctaNote}>
                        Selected:{' '}
                        <Text style={{ fontWeight: '800', color: C.primary }}>
                            {selectedPlan}
                        </Text>{' '}
                        plan
                    </Text>
                    <TouchableOpacity
                        style={styles.joinBtn}
                        onPress={onJoin}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.joinBtnText}>Create My Account →</Text>
                        <Text style={styles.joinBtnSub}>START YOUR FREE TOUR</Text>
                    </TouchableOpacity>
                    <Text style={styles.ctaDisclaimer}>
                        No payment required now. Complete your profile and our team will be in
                        touch within 24 hours.
                    </Text>
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
        // paddingBottom set dynamically via insets above
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

    planCard: {
        marginHorizontal: 24,
        marginBottom: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    planCardSelected: {
        borderWidth: 2.5,
        borderColor: C.primary,
    },
    popularBadge: {
        backgroundColor: '#ffebce',
        paddingVertical: 6,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
    },
    popularBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: C.primary,
        letterSpacing: 1,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    planName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },
    planTagline: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    planPriceBox: { alignItems: 'flex-end' },
    planPrice: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    planPeriod: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },

    planFeatures: {
        padding: 16,
        gap: 8,
    },
    planFeature: {
        fontSize: 13,
        color: C.onSurface,
        lineHeight: 20,
    },
    planFeatureOff: {
        color: '#bbb',
    },

    planSelectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    planRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    planRadioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    planSelectText: {
        fontSize: 13,
        color: C.onSurfaceVariant,
    },

    annualBanner: {
        marginHorizontal: 24,
        backgroundColor: '#ffebce',
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        marginBottom: 8,
    },
    annualIcon: { fontSize: 22 },
    annualText: { flex: 1, gap: 4 },
    annualTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: C.onSurface,
    },
    annualDesc: {
        fontSize: 13,
        color: C.onSurfaceVariant,
        lineHeight: 19,
    },

    faqSection: {
        paddingHorizontal: 24,
        paddingTop: 24,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: C.primary,
        marginBottom: 4,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.08)',
        padding: 14,
        gap: 8,
    },
    faqRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 14,
        fontWeight: '700',
        color: C.onSurface,
        flex: 1,
        paddingRight: 8,
    },
    faqChevron: {
        fontSize: 10,
        color: C.onSurfaceVariant,
    },
    faqAnswer: {
        fontSize: 13,
        color: C.onSurfaceVariant,
        lineHeight: 20,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0,0,0,0.06)',
        paddingTop: 8,
    },

    ctaSection: {
        paddingHorizontal: 24,
        paddingTop: 28,
        gap: 12,
        alignItems: 'center',
    },
    ctaNote: {
        fontSize: 14,
        color: C.onSurfaceVariant,
    },
    joinBtn: {
        width: '100%',
        backgroundColor: C.primary,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
        gap: 4,
    },
    joinBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 17,
    },
    joinBtnSub: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    ctaDisclaimer: {
        fontSize: 12,
        color: C.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 280,
    },
});