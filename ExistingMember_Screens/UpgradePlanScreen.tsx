// ExistingMember_Screens/UpgradePlanScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Animated,
    Easing,
    Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../styles';
import TopBar from '../components/TopBar';
import PaymentScreen from './PaymentScreen';

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const PLANS = [
    {
        name: 'Seedling',
        tagline: 'Start your journey',
        price: '₹2,999',
        priceAmount: 299900, // in paise for Razorpay
        period: '/month',
        color: '#815344',
        popular: false,
        tier: 1,
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
        priceAmount: 549900,
        period: '/month',
        color: '#800000',
        popular: true,
        tier: 2,
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
        priceAmount: 999900,
        period: '/month',
        color: '#271900',
        popular: false,
        tier: 3,
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

// ─────────────────────────────────────────────────────────────
// CONTACT US SECTION
// ─────────────────────────────────────────────────────────────

const CONTACT_OPTIONS = [
    {
        key: 'phone',
        label: 'Call Us',
        detail: '+91 98765 43210',
        icon: '📞',
        color: '#1a6b3c',
        bgColor: '#e6f4ea',
        action: () => Linking.openURL('tel:+919876543210'),
    },
    {
        key: 'whatsapp',
        label: 'WhatsApp',
        detail: 'Chat with us',
        icon: '💬',
        color: '#25d366',
        bgColor: '#e8fdf0',
        action: () =>
            Linking.openURL(
                'https://wa.me/919876543210?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20membership%20plans.'
            ),
    },
    {
        key: 'email',
        label: 'Email Us',
        detail: 'hello@forgeflora.in',
        icon: '✉️',
        color: '#800000',
        bgColor: '#fff0eb',
        action: () =>
            Linking.openURL(
                'mailto:hello@forgeflora.in?subject=Membership%20Enquiry&body=Hi%20ForgeFlora%20team%2C%0A%0AI%27d%20like%20to%20know%20more%20about%20your%20membership%20plans.'
            ),
    },
];

function ContactUsSection() {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 420,
            delay: PLANS.length * 110 + 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                contactStyles.wrapper,
                {
                    opacity: anim,
                    transform: [
                        {
                            translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <View style={contactStyles.sectionHeader}>
                <Text style={contactStyles.sectionTitle}>Need help choosing?</Text>
                <Text style={contactStyles.sectionSub}>
                    Our team is happy to walk you through the right plan for your goals.
                </Text>
            </View>

            <View style={contactStyles.cardsRow}>
                {CONTACT_OPTIONS.map((opt) => (
                    <ContactCard key={opt.key} option={opt} />
                ))}
            </View>

            <View style={contactStyles.hoursRow}>
                <Text style={contactStyles.hoursText}>
                    🕐  Available Mon–Sat, 6am–9pm
                </Text>
            </View>
        </Animated.View>
    );
}

function ContactCard({ option }: { option: typeof CONTACT_OPTIONS[0] }) {
    const pressScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(pressScale, { toValue: 0.95, speed: 30, bounciness: 4, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressScale, { toValue: 1, speed: 22, bounciness: 6, useNativeDriver: true }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: pressScale }], flex: 1 }}>
            <TouchableOpacity
                style={[contactStyles.card, { backgroundColor: option.bgColor }]}
                onPress={option.action}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <Text style={contactStyles.cardIcon}>{option.icon}</Text>
                <Text style={[contactStyles.cardLabel, { color: option.color }]}>{option.label}</Text>
                <Text style={contactStyles.cardDetail} numberOfLines={1}>{option.detail}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// ANIMATED PLAN CARD
// ─────────────────────────────────────────────────────────────

function AnimatedPlanCard({
    plan,
    index,
    isCurrent,
    isSelected,
    isUpgrade,
    isDowngrade,
    onPress,
    onConfirm,
    activePlan,
}: {
    plan: typeof PLANS[0];
    index: number;
    isCurrent: boolean;
    isSelected: boolean;
    isUpgrade: boolean;
    isDowngrade: boolean;
    onPress: () => void;
    onConfirm: () => void;
    activePlan: string;
}) {
    const entryOpacity = useRef(new Animated.Value(0)).current;
    const entryTranslateY = useRef(new Animated.Value(40)).current;
    const pressScale = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const glowLoop = useRef<Animated.CompositeAnimation | null>(null);
    const ctaHeight = useRef(new Animated.Value(0)).current;
    const ctaOpacity = useRef(new Animated.Value(0)).current;

    const featureAnims = useRef(
        plan.features.map(() => ({
            opacity: new Animated.Value(0),
            translateX: new Animated.Value(-16),
        }))
    ).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(entryOpacity, {
                toValue: 1,
                duration: 380,
                delay: index * 110,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(entryTranslateY, {
                toValue: 0,
                speed: 14,
                bounciness: 6,
                delay: index * 110,
                useNativeDriver: true,
            }),
        ]).start();

        plan.features.forEach((_, fi) => {
            Animated.parallel([
                Animated.timing(featureAnims[fi].opacity, {
                    toValue: 1,
                    duration: 260,
                    delay: index * 110 + 200 + fi * 45,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(featureAnims[fi].translateX, {
                    toValue: 0,
                    duration: 260,
                    delay: index * 110 + 200 + fi * 45,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
            ]).start();
        });
    }, []);

    useEffect(() => {
        if (isSelected) {
            glowLoop.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 700,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 700,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: false,
                    }),
                ])
            );
            glowLoop.current.start();
        } else {
            glowLoop.current?.stop();
            glowAnim.setValue(0);
        }
        return () => glowLoop.current?.stop();
    }, [isSelected]);

    useEffect(() => {
        if (isSelected) {
            Animated.parallel([
                Animated.spring(ctaHeight, { toValue: 64, speed: 18, bounciness: 7, useNativeDriver: false }),
                Animated.timing(ctaOpacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: false }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(ctaHeight, { toValue: 0, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: false }),
                Animated.timing(ctaOpacity, { toValue: 0, duration: 160, useNativeDriver: false }),
            ]).start();
        }
    }, [isSelected]);

    const handlePressIn = () => {
        if (isCurrent) return;
        Animated.spring(pressScale, { toValue: 0.974, speed: 30, bounciness: 4, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressScale, { toValue: 1, speed: 22, bounciness: 6, useNativeDriver: true }).start();
    };

    const borderColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [plan.color, plan.color + '99'],
    });

    return (
        <Animated.View
            style={[
                cardStyles.wrapper,
                {
                    opacity: entryOpacity,
                    transform: [{ translateY: entryTranslateY }, { scale: pressScale }],
                },
            ]}
        >
            <Animated.View
                style={[
                    cardStyles.card,
                    isCurrent && cardStyles.cardCurrent,
                    isSelected && { borderColor, borderWidth: 2.5 },
                ]}
            >
                {isCurrent && (
                    <View style={[cardStyles.badge, { backgroundColor: C.primary }]}>
                        <Text style={cardStyles.badgeText}>✦ YOUR CURRENT PLAN</Text>
                    </View>
                )}
                {!isCurrent && plan.popular && (
                    <View style={[cardStyles.badge, { backgroundColor: '#ffebce' }]}>
                        <Text style={[cardStyles.badgeText, { color: C.primary }]}>⭐ MOST POPULAR</Text>
                    </View>
                )}
                {!isCurrent && isUpgrade && (
                    <View style={[cardStyles.badge, { backgroundColor: '#e6f4ea' }]}>
                        <Text style={[cardStyles.badgeText, { color: '#1a6b3c' }]}>⬆ UPGRADE</Text>
                    </View>
                )}
                {!isCurrent && isDowngrade && (
                    <View style={[cardStyles.badge, { backgroundColor: '#fce8e6' }]}>
                        <Text style={[cardStyles.badgeText, { color: '#c0392b' }]}>⬇ DOWNGRADE</Text>
                    </View>
                )}

                <TouchableOpacity
                    activeOpacity={isCurrent ? 1 : 0.92}
                    onPress={isCurrent ? undefined : onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <View style={[cardStyles.planHeader, { backgroundColor: plan.color }]}>
                        <View>
                            <Text style={cardStyles.planName}>{plan.name}</Text>
                            <Text style={cardStyles.planTagline}>{plan.tagline}</Text>
                        </View>
                        <View style={cardStyles.planPriceBox}>
                            <Text style={cardStyles.planPrice}>{plan.price}</Text>
                            <Text style={cardStyles.planPeriod}>{plan.period}</Text>
                        </View>
                    </View>

                    <View style={cardStyles.planFeatures}>
                        {plan.features.map((f, fi) => (
                            <Animated.Text
                                key={fi}
                                style={[
                                    cardStyles.planFeature,
                                    f.startsWith('✗') && cardStyles.planFeatureOff,
                                    {
                                        opacity: featureAnims[fi].opacity,
                                        transform: [{ translateX: featureAnims[fi].translateX }],
                                    },
                                ]}
                            >
                                {f}
                            </Animated.Text>
                        ))}
                    </View>

                    {!isCurrent ? (
                        <View style={cardStyles.planSelectRow}>
                            <View
                                style={[
                                    cardStyles.planRadio,
                                    isSelected && { backgroundColor: plan.color, borderColor: plan.color },
                                ]}
                            >
                                {isSelected && <View style={cardStyles.planRadioDot} />}
                            </View>
                            <Text style={[cardStyles.planSelectText, isSelected && { color: plan.color, fontWeight: '700' }]}>
                                {isSelected ? 'Selected' : 'Select this plan'}
                            </Text>
                        </View>
                    ) : (
                        <View style={cardStyles.currentLabel}>
                            <Text style={cardStyles.currentLabelText}>✓  You are on this plan</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {!isCurrent && (
                    <Animated.View style={[cardStyles.inCardCta, { height: ctaHeight, opacity: ctaOpacity }]}>
                        {/* ── CHANGED: button now says "Proceed to Pay" and triggers payment flow ── */}
                        <TouchableOpacity
                            style={[cardStyles.inCardCtaBtn, { backgroundColor: plan.color }]}
                            onPress={onConfirm}
                            activeOpacity={0.85}
                        >
                            <Text style={cardStyles.inCardCtaBtnText}>
                                {isUpgrade
                                    ? `Upgrade to ${plan.name} — Pay ${plan.price} →`
                                    : `Switch to ${plan.name} — Pay ${plan.price} →`}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </Animated.View>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// CONFIRMATION MODAL
// ─────────────────────────────────────────────────────────────

function ConfirmModal({
    plan,
    currentPlan,
    onProceedToPayment,
    onCancel,
}: {
    plan: typeof PLANS[0];
    currentPlan: string;
    onProceedToPayment: () => void; // ← renamed: goes to PaymentScreen
    onCancel: () => void;
}) {
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const currentTier = PLANS.find(p => p.name === currentPlan)?.tier ?? 0;
    const isUpgrade = plan.tier > currentTier;
    const confirmPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(overlayOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, speed: 18, bounciness: 10, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();

        const timeout = setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(confirmPulse, { toValue: 1.04, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                    Animated.timing(confirmPulse, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                ])
            ).start();
        }, 600);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Animated.View style={[modalStyles.overlay, { opacity: overlayOpacity }]}>
            <Animated.View style={[modalStyles.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
                <View style={[modalStyles.iconBand, { backgroundColor: plan.color }]}>
                    <Text style={modalStyles.iconBandText}>
                        {isUpgrade ? '⬆️  UPGRADE PLAN' : '⬇️  DOWNGRADE PLAN'}
                    </Text>
                </View>

                <View style={modalStyles.body}>
                    <Text style={modalStyles.modalTitle}>Switch to {plan.name}?</Text>
                    <Text style={modalStyles.modalSub}>
                        Moving from{' '}
                        <Text style={{ fontWeight: '800', color: C.primary }}>{currentPlan}</Text>
                        {' '}→{' '}
                        <Text style={{ fontWeight: '800', color: plan.color }}>{plan.name}</Text>.
                        {' '}New billing of{' '}
                        <Text style={{ fontWeight: '800' }}>{plan.price}/month</Text>{' '}
                        starts from your next cycle.
                    </Text>

                    <View style={modalStyles.divider} />

                    <Text style={modalStyles.modalNote}>
                        {isUpgrade
                            ? '✦  Upgrade benefits are unlocked immediately after payment.'
                            : '⚠  Some features will be removed at cycle end.'}
                    </Text>

                    <View style={modalStyles.btnRow}>
                        <TouchableOpacity style={modalStyles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
                            <Text style={modalStyles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>

                        {/* ── CHANGED: now says "Pay Now" and calls onProceedToPayment ── */}
                        <Animated.View style={{ flex: 1, transform: [{ scale: confirmPulse }] }}>
                            <TouchableOpacity
                                style={[modalStyles.confirmBtn, { backgroundColor: plan.color }]}
                                onPress={onProceedToPayment}
                                activeOpacity={0.85}
                            >
                                <Text style={modalStyles.confirmBtnText}>Pay Now →</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </Animated.View>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// SUCCESS BANNER
// ─────────────────────────────────────────────────────────────

function SuccessBanner({ planName, onDone }: { planName: string; onDone: () => void }) {
    const slideAnim = useRef(new Animated.Value(-90)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const emojiRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, speed: 16, bounciness: 12, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, speed: 18, bounciness: 8, useNativeDriver: true }),
        ]).start();

        Animated.timing(emojiRotate, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
        }).start();
    }, []);

    const spin = emojiRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <Animated.View
            style={[
                successStyles.banner,
                { transform: [{ translateY: slideAnim }, { scale: scaleAnim }], opacity: opacityAnim },
            ]}
        >
            <Animated.Text style={[successStyles.emoji, { transform: [{ rotate: spin }] }]}>🎉</Animated.Text>
            <View style={successStyles.textBlock}>
                <Text style={successStyles.title}>Plan Updated!</Text>
                <Text style={successStyles.sub}>
                    You're now on the <Text style={{ fontWeight: '800' }}>{planName}</Text> plan.
                </Text>
            </View>
            <TouchableOpacity onPress={onDone} style={successStyles.doneBtn}>
                <Text style={successStyles.doneBtnText}>Done</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// ANIMATED HEADER
// ─────────────────────────────────────────────────────────────

function AnimatedHeader({ activePlan }: { activePlan: string }) {
    const labelAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const subtitleAnim = useRef(new Animated.Value(0)).current;
    const chipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(80, [
            Animated.timing(labelAnim, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(titleAnim, { toValue: 1, duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(subtitleAnim, { toValue: 1, duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.spring(chipAnim, { toValue: 1, speed: 16, bounciness: 10, useNativeDriver: true }),
        ]).start();
    }, []);

    const makeSlide = (anim: Animated.Value) => ({
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
    });

    return (
        <View style={styles.headerSection}>
            <Animated.Text style={[styles.capsLabel, makeSlide(labelAnim)]}>YOUR MEMBERSHIP</Animated.Text>
            <Animated.Text style={[styles.pageTitle, makeSlide(titleAnim)]}>Upgrade{'\n'}Your Plan</Animated.Text>
            <Animated.Text style={[styles.pageSubtitle, makeSlide(subtitleAnim)]}>
                You're currently on the{' '}
                <Text style={{ fontWeight: '800', color: C.primary }}>{activePlan}</Text>{' '}
                plan. Upgrade anytime — changes take effect immediately.
            </Animated.Text>
            <Animated.View style={[styles.currentChip, { opacity: chipAnim, transform: [{ scale: chipAnim }] }]}>
                <Text style={styles.currentChipText}>✦  Current: {activePlan}</Text>
            </Animated.View>
        </View>
    );
}

// ─────────────────────────────────────────────────────────────
// ANNUAL BANNER
// ─────────────────────────────────────────────────────────────

function AnimatedAnnualBanner() {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 420,
            delay: PLANS.length * 110 + 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.annualBanner,
                {
                    opacity: anim,
                    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                },
            ]}
        >
            <Text style={styles.annualIcon}>💡</Text>
            <View style={styles.annualText}>
                <Text style={styles.annualTitle}>Save up to 20% annually</Text>
                <Text style={styles.annualDesc}>
                    Pay for 10 months, get 12. Contact the front desk to switch to annual billing.
                </Text>
            </View>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────

export default function UpgradePlanScreen({
    onBack,
    currentPlan = 'Seedling',
}: {
    onBack: () => void;
    currentPlan?: string;
}) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [confirmingPlan, setConfirmingPlan] = useState<typeof PLANS[0] | null>(null);
    const [activePlan, setActivePlan] = useState(currentPlan);
    const [showSuccess, setShowSuccess] = useState(false);

    // ── NEW: tracks which plan is headed to PaymentScreen ──
    const [payingPlan, setPayingPlan] = useState<typeof PLANS[0] | null>(null);

    const insets = useSafeAreaInsets();
    const currentTier = PLANS.find(p => p.name === activePlan)?.tier ?? 0;

    // Called from ConfirmModal "Pay Now" button
    const handleProceedToPayment = () => {
        if (!confirmingPlan) return;
        setConfirmingPlan(null);   // close modal
        setPayingPlan(confirmingPlan); // navigate to PaymentScreen
    };

    // Called when PaymentScreen reports success
    const handlePaymentSuccess = () => {
        if (!payingPlan) return;
        setActivePlan(payingPlan.name);
        setSelectedPlan(null);
        setPayingPlan(null);
        setShowSuccess(true);
    };

    // ── Render PaymentScreen as a full-screen replacement ──
    if (payingPlan) {
        return (
            <PaymentScreen
                plan={payingPlan}
                currentPlan={activePlan}
                onBack={() => setPayingPlan(null)}   // back arrow returns to upgrade screen
                onSuccess={handlePaymentSuccess}
            />
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" translucent={false} backgroundColor="#fff8f3" />
            <TopBar onBack={onBack} title="Manage Plan" />

            {showSuccess && (
                <SuccessBanner planName={activePlan} onDone={() => setShowSuccess(false)} />
            )}

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
                showsVerticalScrollIndicator={false}
                scrollIndicatorInsets={{ bottom: insets.bottom }}
            >
                <AnimatedHeader activePlan={activePlan} />

                {PLANS.map((plan, i) => {
                    const isCurrent = plan.name === activePlan;
                    const isSelected = selectedPlan === plan.name;
                    const isUpgrade = plan.tier > currentTier;
                    const isDowngrade = plan.tier < currentTier;

                    return (
                        <AnimatedPlanCard
                            key={plan.name}
                            plan={plan}
                            index={i}
                            isCurrent={isCurrent}
                            isSelected={isSelected}
                            isUpgrade={isUpgrade}
                            isDowngrade={isDowngrade}
                            activePlan={activePlan}
                            onPress={() => setSelectedPlan(isSelected ? null : plan.name)}
                            onConfirm={() => setConfirmingPlan(plan)}
                        />
                    );
                })}

                <AnimatedAnnualBanner />
                <ContactUsSection />
            </ScrollView>

            {confirmingPlan && (
                <ConfirmModal
                    plan={confirmingPlan}
                    currentPlan={activePlan}
                    onProceedToPayment={handleProceedToPayment}  // ← goes to PaymentScreen
                    onCancel={() => setConfirmingPlan(null)}
                />
            )}
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────────
// STYLES (unchanged from original)
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff8f3' },
    scrollContent: {},
    headerSection: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20, gap: 10 },
    capsLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: C.secondary, textTransform: 'uppercase' },
    pageTitle: { fontSize: 32, fontWeight: '800', color: C.primary, letterSpacing: -0.5, lineHeight: 38 },
    pageSubtitle: { fontSize: 14, color: C.onSurfaceVariant, lineHeight: 22 },
    currentChip: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff0eb',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: 'rgba(128,0,0,0.15)',
    },
    currentChipText: { fontSize: 12, fontWeight: '700', color: C.primary, letterSpacing: 0.5 },
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
    annualTitle: { fontSize: 15, fontWeight: '700', color: C.onSurface },
    annualDesc: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 19 },
});

const cardStyles = StyleSheet.create({
    wrapper: { marginHorizontal: 24, marginBottom: 16 },
    card: { borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.1)', overflow: 'hidden', backgroundColor: '#fff' },
    cardCurrent: { borderWidth: 2.5, borderColor: C.primary },
    badge: { paddingVertical: 6, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
    badgeText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 1 },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    planName: { fontSize: 20, fontWeight: '800', color: '#fff' },
    planTagline: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    planPriceBox: { alignItems: 'flex-end' },
    planPrice: { fontSize: 24, fontWeight: '800', color: '#fff' },
    planPeriod: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
    planFeatures: { padding: 16, gap: 8 },
    planFeature: { fontSize: 13, color: C.onSurface, lineHeight: 20 },
    planFeatureOff: { color: '#bbb' },
    planSelectRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 16 },
    planRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
    planRadioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
    planSelectText: { fontSize: 13, color: C.onSurfaceVariant },
    currentLabel: { paddingHorizontal: 16, paddingBottom: 14 },
    currentLabelText: { fontSize: 13, fontWeight: '700', color: C.primary },
    inCardCta: { overflow: 'hidden', paddingHorizontal: 16, justifyContent: 'center' },
    inCardCtaBtn: { paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginBottom: 4 },
    inCardCtaBtnText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.2 },
});

const contactStyles = StyleSheet.create({
    wrapper: { marginHorizontal: 24, marginTop: 8, marginBottom: 8 },
    sectionHeader: { marginBottom: 14, gap: 6 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: C.primary, letterSpacing: -0.3 },
    sectionSub: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 19 },
    cardsRow: { flexDirection: 'row', gap: 10 },
    card: { borderRadius: 14, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
    cardIcon: { fontSize: 26 },
    cardLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 0.2 },
    cardDetail: { fontSize: 11, color: C.onSurfaceVariant, fontWeight: '500' },
    hoursRow: { marginTop: 12, backgroundColor: '#f5f5f5', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center' },
    hoursText: { fontSize: 12, color: C.onSurfaceVariant, fontWeight: '600', letterSpacing: 0.3 },
});

const modalStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        paddingHorizontal: 28,
    },
    card: { width: '100%', borderRadius: 20, overflow: 'hidden', backgroundColor: '#fff' },
    iconBand: { paddingVertical: 14, alignItems: 'center' },
    iconBandText: { color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 1.5 },
    body: { padding: 22, gap: 12 },
    modalTitle: { fontSize: 22, fontWeight: '800', color: C.primary },
    modalSub: { fontSize: 14, color: C.onSurfaceVariant, lineHeight: 22 },
    divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.07)' },
    modalNote: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 20 },
    btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#f3f4f6' },
    cancelBtnText: { fontSize: 15, fontWeight: '700', color: C.onSurface },
    confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    confirmBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

const successStyles = StyleSheet.create({
    banner: {
        marginHorizontal: 16,
        marginBottom: 4,
        backgroundColor: '#e6f4ea',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(26,107,60,0.2)',
    },
    emoji: { fontSize: 24 },
    textBlock: { flex: 1, gap: 2 },
    title: { fontSize: 15, fontWeight: '800', color: '#1a6b3c' },
    sub: { fontSize: 13, color: '#2d7a4f', lineHeight: 18 },
    doneBtn: { backgroundColor: '#1a6b3c', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
    doneBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});