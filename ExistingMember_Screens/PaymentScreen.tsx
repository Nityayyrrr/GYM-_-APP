// ExistingMember_Screens/PaymentScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
    Easing,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../styles';
import TopBar from '../components/TopBar';
import RazorpayCheckout from 'react-native-razorpay';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface Plan {
    name: string;
    tagline: string;
    price: string;
    priceAmount: number; // numeric, in paise (₹ × 100)
    period: string;
    color: string;
    tier: number;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const BANKS = [
    { key: 'sbi', label: 'State Bank of India' },
    { key: 'hdfc', label: 'HDFC Bank' },
    { key: 'icici', label: 'ICICI Bank' },
    { key: 'axis', label: 'Axis Bank' },
    { key: 'kotak', label: 'Kotak Mahindra' },
    { key: 'pnb', label: 'Punjab National Bank' },
];

// ─────────────────────────────────────────────────────────────
// ORDER SUMMARY CARD
// ─────────────────────────────────────────────────────────────

function OrderSummaryCard({
    plan,
    currentPlan,
    anim,
}: {
    plan: Plan;
    currentPlan: string;
    anim: Animated.Value;
}) {
    const isUpgrade = plan.tier > 0; // simplified; parent passes correct data

    return (
        <Animated.View
            style={[
                summaryStyles.wrapper,
                {
                    opacity: anim,
                    transform: [
                        {
                            translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [24, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <View style={[summaryStyles.card, { backgroundColor: plan.color }]}>
                {/* Header */}
                <View style={summaryStyles.header}>
                    <View>
                        <Text style={summaryStyles.upgradeLabel}>
                            {isUpgrade ? '⬆  UPGRADING TO' : '⬇  SWITCHING TO'}
                        </Text>
                        <Text style={summaryStyles.planName}>{plan.name}</Text>
                        <Text style={summaryStyles.planTagline}>{plan.tagline}</Text>
                    </View>
                    <View style={summaryStyles.priceBox}>
                        <Text style={summaryStyles.price}>{plan.price}</Text>
                        <Text style={summaryStyles.period}>{plan.period}</Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={summaryStyles.divider} />

                {/* Billing note */}
                <View style={summaryStyles.noteRow}>
                    <Text style={summaryStyles.noteIcon}>🔒</Text>
                    <Text style={summaryStyles.noteText}>
                        First charge applies on your next billing cycle.
                        Moving from{' '}
                        <Text style={{ fontWeight: '800' }}>{currentPlan}</Text>
                        {' '}→{' '}
                        <Text style={{ fontWeight: '800' }}>{plan.name}</Text>.
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// METHOD SELECTOR ITEM
// ─────────────────────────────────────────────────────────────

function MethodItem({
    icon,
    label,
    sub,
    selected,
    accentColor,
    iconBg,
    onPress,
    delay,
}: {
    icon: string;
    label: string;
    sub: string;
    selected: boolean;
    accentColor: string;
    iconBg: string;
    onPress: () => void;
    delay: number;
}) {
    const entryAnim = useRef(new Animated.Value(0)).current;
    const pressScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(entryAnim, {
            toValue: 1,
            duration: 320,
            delay,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(pressScale, { toValue: 0.97, speed: 30, bounciness: 4, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressScale, { toValue: 1, speed: 22, bounciness: 6, useNativeDriver: true }).start();
    };

    return (
        <Animated.View
            style={{
                opacity: entryAnim,
                transform: [
                    { scale: pressScale },
                    { translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
                ],
            }}
        >
            <TouchableOpacity
                style={[
                    methodStyles.item,
                    selected && { borderColor: accentColor, borderWidth: 2 },
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <View style={[methodStyles.iconBox, { backgroundColor: iconBg }]}>
                    <Text style={methodStyles.iconText}>{icon}</Text>
                </View>
                <View style={methodStyles.labelBox}>
                    <Text style={[methodStyles.label, selected && { color: accentColor }]}>{label}</Text>
                    <Text style={methodStyles.sub}>{sub}</Text>
                </View>
                <View style={[methodStyles.radio, selected && { backgroundColor: accentColor, borderColor: accentColor }]}>
                    {selected && <View style={methodStyles.radioDot} />}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// UPI PANEL
// ─────────────────────────────────────────────────────────────

function UPIPanel({ accentColor }: { accentColor: string }) {
    const [upiId, setUpiId] = useState('');
    const [verified, setVerified] = useState<null | boolean>(null);
    const [verifying, setVerifying] = useState(false);
    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(heightAnim, {
            toValue: 1,
            speed: 18,
            bounciness: 6,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleVerify = () => {
        if (!upiId.includes('@')) {
            Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. name@upi)');
            return;
        }
        setVerifying(true);
        setVerified(null);
        // Simulate verification
        setTimeout(() => {
            setVerifying(false);
            setVerified(true);
        }, 1200);
    };

    return (
        <Animated.View
            style={[
                upiStyles.wrapper,
                {
                    opacity: heightAnim,
                    transform: [
                        { scaleY: heightAnim },
                        {
                            translateY: heightAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-8, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <View style={[upiStyles.card, { borderColor: accentColor + '44' }]}>
                <Text style={upiStyles.inputLabel}>Enter your UPI ID</Text>
                <View style={upiStyles.inputRow}>
                    <TextInput
                        style={upiStyles.input}
                        value={upiId}
                        onChangeText={(t) => { setUpiId(t); setVerified(null); }}
                        placeholder="name@upi"
                        placeholderTextColor="#bbb"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                    />
                    <TouchableOpacity
                        style={[upiStyles.verifyBtn, { backgroundColor: accentColor }]}
                        onPress={handleVerify}
                        activeOpacity={0.85}
                    >
                        <Text style={upiStyles.verifyBtnText}>
                            {verifying ? '...' : 'Verify'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {verified === true && (
                    <Text style={upiStyles.verifiedText}>✓  UPI ID verified</Text>
                )}
                {verified === false && (
                    <Text style={upiStyles.errorText}>✗  UPI ID not found</Text>
                )}
                <View style={upiStyles.appsRow}>
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <View key={app} style={upiStyles.appChip}>
                            <Text style={upiStyles.appChipText}>{app}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// CARD PANEL
// ─────────────────────────────────────────────────────────────

function CardPanel({ accentColor }: { accentColor: string }) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(heightAnim, {
            toValue: 1,
            speed: 18,
            bounciness: 6,
            useNativeDriver: false,
        }).start();
    }, []);

    const formatCardNumber = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
        return digits;
    };

    return (
        <Animated.View style={{ opacity: heightAnim }}>
            <View style={[cardPanelStyles.wrapper, { borderColor: accentColor + '44' }]}>
                <View style={cardPanelStyles.field}>
                    <Text style={cardPanelStyles.label}>Card Number</Text>
                    <TextInput
                        style={cardPanelStyles.input}
                        value={cardNumber}
                        onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                        placeholder="1234 5678 9012 3456"
                        placeholderTextColor="#bbb"
                        keyboardType="numeric"
                        maxLength={19}
                    />
                </View>
                <View style={cardPanelStyles.row}>
                    <View style={[cardPanelStyles.field, { flex: 1 }]}>
                        <Text style={cardPanelStyles.label}>Expiry</Text>
                        <TextInput
                            style={cardPanelStyles.input}
                            value={expiry}
                            onChangeText={(t) => setExpiry(formatExpiry(t))}
                            placeholder="MM/YY"
                            placeholderTextColor="#bbb"
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                    <View style={{ width: 12 }} />
                    <View style={[cardPanelStyles.field, { flex: 1 }]}>
                        <Text style={cardPanelStyles.label}>CVV</Text>
                        <TextInput
                            style={cardPanelStyles.input}
                            value={cvv}
                            onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                            placeholder="•••"
                            placeholderTextColor="#bbb"
                            keyboardType="numeric"
                            secureTextEntry
                            maxLength={4}
                        />
                    </View>
                </View>
                <View style={cardPanelStyles.field}>
                    <Text style={cardPanelStyles.label}>Name on Card</Text>
                    <TextInput
                        style={cardPanelStyles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="As printed on card"
                        placeholderTextColor="#bbb"
                        autoCapitalize="words"
                    />
                </View>
                <View style={cardPanelStyles.networksRow}>
                    {['VISA', 'MC', 'RuPay'].map((n) => (
                        <View key={n} style={cardPanelStyles.networkChip}>
                            <Text style={cardPanelStyles.networkText}>{n}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// NET BANKING PANEL
// ─────────────────────────────────────────────────────────────

function NetBankingPanel({ accentColor }: { accentColor: string }) {
    const [selected, setSelected] = useState<string | null>(null);
    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(heightAnim, {
            toValue: 1,
            speed: 18,
            bounciness: 6,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View style={{ opacity: heightAnim }}>
            <View style={[nbStyles.wrapper, { borderColor: accentColor + '44' }]}>
                <Text style={nbStyles.hint}>Select your bank</Text>
                <View style={nbStyles.grid}>
                    {BANKS.map((b) => (
                        <TouchableOpacity
                            key={b.key}
                            style={[
                                nbStyles.bankItem,
                                selected === b.key && {
                                    borderColor: accentColor,
                                    backgroundColor: accentColor + '0f',
                                },
                            ]}
                            onPress={() => setSelected(b.key)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    nbStyles.bankLabel,
                                    selected === b.key && { color: accentColor, fontWeight: '700' },
                                ]}
                                numberOfLines={2}
                            >
                                {b.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────
// PROCESSING OVERLAY
// ─────────────────────────────────────────────────────────────

function ProcessingOverlay({ plan, onDone }: { plan: Plan; onDone: () => void }) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;
    const [step, setStep] = useState<'processing' | 'success'>('processing');

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, speed: 16, bounciness: 10, useNativeDriver: true }),
        ]).start();

        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 900,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Simulate payment processing
        const t = setTimeout(() => {
            setStep('success');
            setTimeout(onDone, 1600);
        }, 2200);

        return () => clearTimeout(t);
    }, []);

    const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <Animated.View style={[processingStyles.overlay, { opacity: opacityAnim }]}>
            <Animated.View style={[processingStyles.card, { transform: [{ scale: scaleAnim }] }]}>
                <View style={[processingStyles.iconBand, { backgroundColor: plan.color }]}>
                    {step === 'processing' ? (
                        <Animated.Text
                            style={[processingStyles.spinIcon, { transform: [{ rotate: spin }] }]}
                        >
                            ⟳
                        </Animated.Text>
                    ) : (
                        <Text style={processingStyles.spinIcon}>✓</Text>
                    )}
                </View>
                <View style={processingStyles.body}>
                    <Text style={processingStyles.title}>
                        {step === 'processing' ? 'Processing Payment…' : 'Payment Successful!'}
                    </Text>
                    <Text style={processingStyles.sub}>
                        {step === 'processing'
                            ? 'Please do not close this screen.'
                            : `You're now on the ${plan.name} plan. Welcome aboard!`}
                    </Text>
                    {step === 'processing' && (
                        <View style={[processingStyles.progressBar, { backgroundColor: plan.color + '22' }]}>
                            <ProcessingBar color={plan.color} />
                        </View>
                    )}
                </View>
            </Animated.View>
        </Animated.View>
    );
}

function ProcessingBar({ color }: { color: string }) {
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                processingStyles.progressFill,
                { backgroundColor: color, width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
        />
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────

export default function PaymentScreen({
    plan,
    currentPlan,
    onBack,
    onSuccess,
}: {
    plan: Plan;
    currentPlan: string;
    onBack: () => void;
    onSuccess: () => void;
}) {
    const [method, setMethod] = useState<PaymentMethod>('upi');
    const insets = useSafeAreaInsets();

    const summaryAnim = useRef(new Animated.Value(0)).current;
    const methodsAnim = useRef(new Animated.Value(0)).current;
    const ctaAnim = useRef(new Animated.Value(0)).current;
    const ctaScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.stagger(100, [
            Animated.timing(summaryAnim, { toValue: 1, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(methodsAnim, { toValue: 1, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(ctaAnim, { toValue: 1, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
    }, []);

    const handlePay = () => {
        const options = {
            description: `${plan.name} Membership`,
            image: 'https://forgeflora.in/logo.png', // replace with your hosted logo URL
            currency: 'INR',
            key: 'rzp_live_YOUR_KEY_HERE',           // replace with your Razorpay live key
            amount: plan.priceAmount,                 // already in paise (₹ × 100)
            name: 'ForgeFlora',
            prefill: {
                // Pass real user data here if available from your auth/profile context
                email: '',
                contact: '',
                name: '',
            },
            theme: { color: plan.color },
        };

        RazorpayCheckout.open(options)
            .then(() => {
                // Payment captured — Razorpay confirmed success
                onSuccess();
            })
            .catch((error: { code: number; description: string }) => {
                if (error.code === 2) {
                    // User dismissed the Razorpay sheet — do nothing
                    return;
                }
                Alert.alert(
                    'Payment Failed',
                    error.description || 'Something went wrong. Please try again.',
                    [{ text: 'OK' }]
                );
            });
    };

    const handleCtaPressIn = () => {
        Animated.spring(ctaScale, { toValue: 0.97, speed: 30, bounciness: 4, useNativeDriver: true }).start();
    };

    const handleCtaPressOut = () => {
        Animated.spring(ctaScale, { toValue: 1, speed: 22, bounciness: 6, useNativeDriver: true }).start();
    };

    return (
        <SafeAreaView style={screenStyles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" translucent={false} backgroundColor="#fff8f3" />
            <TopBar onBack={onBack} title="Complete Payment" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={[screenStyles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Order Summary */}
                    <OrderSummaryCard plan={plan} currentPlan={currentPlan} anim={summaryAnim} />

                    {/* Payment Methods */}
                    <Animated.View
                        style={[
                            screenStyles.methodsSection,
                            {
                                opacity: methodsAnim,
                                transform: [
                                    {
                                        translateY: methodsAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Text style={screenStyles.sectionLabel}>PAYMENT METHOD</Text>

                        <View style={screenStyles.methodsList}>
                            <MethodItem
                                icon="📲"
                                label="UPI"
                                sub="GPay, PhonePe, Paytm, BHIM"
                                selected={method === 'upi'}
                                accentColor={plan.color}
                                iconBg="#fff0eb"
                                onPress={() => setMethod('upi')}
                                delay={80}
                            />
                            {method === 'upi' && <UPIPanel accentColor={plan.color} />}

                            <MethodItem
                                icon="💳"
                                label="Credit / Debit Card"
                                sub="Visa, Mastercard, RuPay"
                                selected={method === 'card'}
                                accentColor={plan.color}
                                iconBg="#e6f0fb"
                                onPress={() => setMethod('card')}
                                delay={160}
                            />
                            {method === 'card' && <CardPanel accentColor={plan.color} />}

                            <MethodItem
                                icon="🏦"
                                label="Net Banking"
                                sub="All major Indian banks"
                                selected={method === 'netbanking'}
                                accentColor={plan.color}
                                iconBg="#e6f4ea"
                                onPress={() => setMethod('netbanking')}
                                delay={240}
                            />
                            {method === 'netbanking' && <NetBankingPanel accentColor={plan.color} />}
                        </View>
                    </Animated.View>

                    {/* Secure note */}
                    <Animated.View style={[screenStyles.secureRow, { opacity: ctaAnim }]}>
                        <Text style={screenStyles.secureText}>🔐  Payments secured by Razorpay</Text>
                    </Animated.View>
                </ScrollView>

                {/* Fixed Pay CTA */}
                <Animated.View
                    style={[
                        screenStyles.ctaBar,
                        {
                            paddingBottom: insets.bottom + 12,
                            opacity: ctaAnim,
                            transform: [{ scale: ctaScale }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={[screenStyles.payBtn, { backgroundColor: plan.color }]}
                        onPress={handlePay}
                        onPressIn={handleCtaPressIn}
                        onPressOut={handleCtaPressOut}
                        activeOpacity={0.9}
                    >
                        <Text style={screenStyles.payBtnText}>
                            Pay {plan.price} →
                        </Text>
                    </TouchableOpacity>
                    <Text style={screenStyles.ctaNote}>
                        By paying you agree to our{' '}
                        <Text style={{ color: plan.color, fontWeight: '700' }}>Terms & Conditions</Text>
                    </Text>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const screenStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff8f3' },
    scrollContent: { paddingTop: 8 },
    methodsSection: { paddingHorizontal: 20, marginTop: 20 },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: C.onSurfaceVariant,
        marginBottom: 10,
    },
    methodsList: { gap: 10 },
    secureRow: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 8,
    },
    secureText: {
        fontSize: 12,
        color: C.onSurfaceVariant,
        fontWeight: '500',
    },
    ctaBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        backgroundColor: '#fff8f3',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
        gap: 8,
    },
    payBtn: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    payBtnText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.3,
    },
    ctaNote: {
        fontSize: 11,
        color: C.onSurfaceVariant,
        textAlign: 'center',
    },
});

const summaryStyles = StyleSheet.create({
    wrapper: { paddingHorizontal: 20 },
    card: { borderRadius: 18, padding: 18, overflow: 'hidden' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    upgradeLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: 'rgba(255,255,255,0.65)',
        marginBottom: 4,
    },
    planName: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.4 },
    planTagline: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
    priceBox: { alignItems: 'flex-end', paddingTop: 4 },
    price: { fontSize: 28, fontWeight: '800', color: '#fff' },
    period: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 14 },
    noteRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
    noteIcon: { fontSize: 14, marginTop: 1 },
    noteText: { fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 18, flex: 1 },
});

const methodStyles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: { fontSize: 20 },
    labelBox: { flex: 1, gap: 2 },
    label: { fontSize: 14, fontWeight: '700', color: C.onSurface },
    sub: { fontSize: 12, color: C.onSurfaceVariant },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});

const upiStyles = StyleSheet.create({
    wrapper: { marginTop: 2 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
        gap: 10,
    },
    inputLabel: { fontSize: 11, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.5 },
    inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    input: {
        flex: 1,
        fontSize: 15,
        color: C.onSurface,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.12)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontWeight: '500',
    },
    verifyBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    verifyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    verifiedText: { fontSize: 12, color: '#1a6b3c', fontWeight: '700' },
    errorText: { fontSize: 12, color: '#c0392b', fontWeight: '700' },
    appsRow: { flexDirection: 'row', gap: 6 },
    appChip: {
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    appChipText: { fontSize: 11, fontWeight: '600', color: C.onSurfaceVariant },
});

const cardPanelStyles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
        gap: 12,
        marginTop: 2,
    },
    row: { flexDirection: 'row' },
    field: { gap: 6 },
    label: { fontSize: 11, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.5 },
    input: {
        fontSize: 15,
        color: C.onSurface,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.12)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontWeight: '500',
    },
    networksRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
    networkChip: {
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    networkText: { fontSize: 11, fontWeight: '700', color: C.onSurfaceVariant },
});

const nbStyles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
        marginTop: 2,
    },
    hint: { fontSize: 12, color: C.onSurfaceVariant, marginBottom: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    bankItem: {
        width: '47%',
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fafafa',
    },
    bankLabel: { fontSize: 13, fontWeight: '500', color: C.onSurface, lineHeight: 18 },
});

const processingStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        paddingHorizontal: 28,
    },
    card: { width: '100%', borderRadius: 20, overflow: 'hidden', backgroundColor: '#fff' },
    iconBand: { paddingVertical: 20, alignItems: 'center' },
    spinIcon: { fontSize: 36, color: '#fff' },
    body: { padding: 22, gap: 10, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: '800', color: C.primary, textAlign: 'center' },
    sub: { fontSize: 14, color: C.onSurfaceVariant, textAlign: 'center', lineHeight: 21 },
    progressBar: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 8,
    },
    progressFill: { height: '100%', borderRadius: 3 },
});