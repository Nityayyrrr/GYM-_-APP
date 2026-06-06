import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../styles';
import TopBar from '../components/TopBar';
import { registerUser } from '../api';    // ← NEW
import { setToken } from '../auth';       // ← NEW

const PLANS = [
    {
        name: 'Seedling',
        price: '₹2,999',
        period: '/month',
        color: '#815344',
        features: ['Mon–Fri access', '2 group classes/month', 'App & progress tracking'],
    },
    {
        name: 'Forged',
        price: '₹5,499',
        period: '/month',
        color: '#800000',
        features: ['Unlimited 24/7 access', 'Unlimited group classes', '2 coaching sessions/month'],
    },
    {
        name: 'Sanctuary',
        price: '₹9,999',
        period: '/month',
        color: '#271900',
        features: ['Unlimited 24/7 access', '4 coaching sessions/month', 'Personal programming'],
    },
];

const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI', icon: '⚡' },
    { id: 'card', label: 'Debit / Credit Card', icon: '💳' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
];

type Props = {
    onBack: () => void;
    onSuccess: () => void;
    selectedPlan?: string;
};

export default function SignUpScreen({ onBack, onSuccess, selectedPlan = 'Forged' }: Props) {
    const insets = useSafeAreaInsets();

    const [activePlan, setActivePlan] = useState(selectedPlan);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [bank, setBank] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');           // ← NEW
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);          // ← NEW

    const plan = PLANS.find(p => p.name === activePlan) ?? PLANS[1];

    function formatCardNumber(val: string) {
        return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }

    function formatExpiry(val: string) {
        const digits = val.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
        return digits;
    }

    function validate() {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = 'Full name is required';
        if (!phone.trim() || phone.length < 10) e.phone = 'Valid phone number is required';
        if (!password.trim() || password.length < 8) e.password = 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(password)) e.password = 'Password must contain an uppercase letter';
        if (!/[a-z]/.test(password)) e.password = 'Password must contain a lowercase letter';
        if (!/\d/.test(password)) e.password = 'Password must contain a number';
        if (!/[!@#$%^&*]/.test(password)) e.password = 'Password must contain a special character (!@#$%^&*)';
        if (paymentMethod === 'upi' && !upiId.trim()) e.upi = 'UPI ID is required';
        if (paymentMethod === 'card') {
            if (cardNumber.replace(/\s/g, '').length < 16) e.card = 'Valid card number required';
            if (cardExpiry.length < 5) e.expiry = 'Valid expiry required';
            if (cardCvv.length < 3) e.cvv = 'Valid CVV required';
            if (!cardName.trim()) e.cardName = 'Name on card is required';
        }
        if (paymentMethod === 'netbanking' && !bank.trim()) e.bank = 'Please select a bank';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // ── UPDATED: calls real backend ──────────────────────────────
    async function handleSubmit() {
        if (!validate()) return;

        setLoading(true);
        try {
            const { token } = await registerUser({
                name,
                phone,
                password,
                role: 'member',
            });
            setToken(token);
            onSuccess();
        } catch (e: any) {
            Alert.alert('Registration failed', e.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    }
    // ────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" translucent={false} backgroundColor="#fff8f3" />
            <TopBar onBack={onBack} title="Create Account" />

            {/* Progress */}
            <View style={styles.progressBar}>
                <View style={[styles.progressStep, styles.progressDone]} />
                <View style={[styles.progressStep, styles.progressDone]} />
                <View style={[styles.progressStep, styles.progressDone]} />
                <View style={[styles.progressStep, styles.progressActive]} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={styles.capsLabel}>STEP 4 OF 4</Text>
                        <Text style={styles.pageTitle}>Almost{'\n'}There</Text>
                        <Text style={styles.pageSubtitle}>
                            Complete your profile and choose how you'd like to pay.
                        </Text>
                    </View>

                    {/* ── Plan Selector ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>YOUR PLAN</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.planScroll}>
                            {PLANS.map(p => (
                                <TouchableOpacity
                                    key={p.name}
                                    style={[
                                        styles.planChip,
                                        activePlan === p.name && {
                                            backgroundColor: p.color,
                                            borderColor: p.color,
                                        },
                                    ]}
                                    onPress={() => setActivePlan(p.name)}
                                    activeOpacity={0.85}
                                >
                                    <Text style={[styles.planChipName, activePlan === p.name && { color: '#fff' }]}>
                                        {p.name}
                                    </Text>
                                    <Text style={[styles.planChipPrice, activePlan === p.name && { color: 'rgba(255,255,255,0.8)' }]}>
                                        {p.price}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Selected Plan Summary */}
                        <View style={[styles.planSummary, { borderLeftColor: plan.color }]}>
                            <View style={[styles.planSummaryBadge, { backgroundColor: plan.color }]}>
                                <Text style={styles.planSummaryBadgeText}>{plan.name}</Text>
                            </View>
                            <View style={styles.planSummaryRight}>
                                <Text style={styles.planSummaryPrice}>
                                    {plan.price}
                                    <Text style={styles.planSummaryPeriod}>{plan.period}</Text>
                                </Text>
                                <View style={{ gap: 2, marginTop: 6 }}>
                                    {plan.features.map((f, i) => (
                                        <Text key={i} style={styles.planSummaryFeature}>✓ {f}</Text>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View style={styles.joiningFeeRow}>
                            <Text style={styles.joiningFeeText}>One-time joining fee</Text>
                            <Text style={styles.joiningFeeAmount}>₹999</Text>
                        </View>
                    </View>

                    {/* ── Personal Details ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>PERSONAL DETAILS</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={[styles.input, errors.name && styles.inputError]}
                                placeholder="Arjun Sharma"
                                placeholderTextColor="#bbb"
                                value={name}
                                onChangeText={t => { setName(t); setErrors(e => ({ ...e, name: '' })); }}
                                autoCapitalize="words"
                            />
                            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Mobile Number</Text>
                            <TextInput
                                style={[styles.input, errors.phone && styles.inputError]}
                                placeholder="9876543210"
                                placeholderTextColor="#bbb"
                                value={phone}
                                onChangeText={t => { setPhone(t.replace(/\D/g, '').slice(0, 10)); setErrors(e => ({ ...e, phone: '' })); }}
                                keyboardType="phone-pad"
                            />
                            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                        </View>

                        {/* ── Password field (NEW) ── */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={[styles.input, errors.password && styles.inputError]}
                                placeholder="Min 8 chars, A-Z, 0-9, !@#$"
                                placeholderTextColor="#bbb"
                                value={password}
                                onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: '' })); }}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        </View>
                    </View>

                    {/* ── Payment ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>

                        <View style={styles.paymentTabs}>
                            {PAYMENT_METHODS.map(m => (
                                <TouchableOpacity
                                    key={m.id}
                                    style={[styles.paymentTab, paymentMethod === m.id && styles.paymentTabActive]}
                                    onPress={() => setPaymentMethod(m.id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.paymentTabIcon}>{m.icon}</Text>
                                    <Text style={[styles.paymentTabLabel, paymentMethod === m.id && styles.paymentTabLabelActive]}>
                                        {m.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* UPI */}
                        {paymentMethod === 'upi' && (
                            <View style={styles.paymentForm}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>UPI ID</Text>
                                    <TextInput
                                        style={[styles.input, errors.upi && styles.inputError]}
                                        placeholder="yourname@upi"
                                        placeholderTextColor="#bbb"
                                        value={upiId}
                                        onChangeText={t => { setUpiId(t); setErrors(e => ({ ...e, upi: '' })); }}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                    {errors.upi ? <Text style={styles.errorText}>{errors.upi}</Text> : null}
                                </View>
                                <View style={styles.upiAppsRow}>
                                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                                        <View key={app} style={styles.upiAppChip}>
                                            <Text style={styles.upiAppText}>{app}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Card */}
                        {paymentMethod === 'card' && (
                            <View style={styles.paymentForm}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Card Number</Text>
                                    <TextInput
                                        style={[styles.input, styles.inputMono, errors.card && styles.inputError]}
                                        placeholder="1234 5678 9012 3456"
                                        placeholderTextColor="#bbb"
                                        value={cardNumber}
                                        onChangeText={t => { setCardNumber(formatCardNumber(t)); setErrors(e => ({ ...e, card: '' })); }}
                                        keyboardType="numeric"
                                    />
                                    {errors.card ? <Text style={styles.errorText}>{errors.card}</Text> : null}
                                </View>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                        <Text style={styles.inputLabel}>Expiry</Text>
                                        <TextInput
                                            style={[styles.input, styles.inputMono, errors.expiry && styles.inputError]}
                                            placeholder="MM/YY"
                                            placeholderTextColor="#bbb"
                                            value={cardExpiry}
                                            onChangeText={t => { setCardExpiry(formatExpiry(t)); setErrors(e => ({ ...e, expiry: '' })); }}
                                            keyboardType="numeric"
                                        />
                                        {errors.expiry ? <Text style={styles.errorText}>{errors.expiry}</Text> : null}
                                    </View>
                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                        <Text style={styles.inputLabel}>CVV</Text>
                                        <TextInput
                                            style={[styles.input, styles.inputMono, errors.cvv && styles.inputError]}
                                            placeholder="•••"
                                            placeholderTextColor="#bbb"
                                            value={cardCvv}
                                            onChangeText={t => { setCardCvv(t.replace(/\D/g, '').slice(0, 4)); setErrors(e => ({ ...e, cvv: '' })); }}
                                            keyboardType="numeric"
                                            secureTextEntry
                                        />
                                        {errors.cvv ? <Text style={styles.errorText}>{errors.cvv}</Text> : null}
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Name on Card</Text>
                                    <TextInput
                                        style={[styles.input, errors.cardName && styles.inputError]}
                                        placeholder="ARJUN SHARMA"
                                        placeholderTextColor="#bbb"
                                        value={cardName}
                                        onChangeText={t => { setCardName(t.toUpperCase()); setErrors(e => ({ ...e, cardName: '' })); }}
                                        autoCapitalize="characters"
                                    />
                                    {errors.cardName ? <Text style={styles.errorText}>{errors.cardName}</Text> : null}
                                </View>
                            </View>
                        )}

                        {/* Net Banking */}
                        {paymentMethod === 'netbanking' && (
                            <View style={styles.paymentForm}>
                                <Text style={styles.inputLabel}>Select Bank</Text>
                                <View style={styles.bankGrid}>
                                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Other'].map(b => (
                                        <TouchableOpacity
                                            key={b}
                                            style={[styles.bankChip, bank === b && styles.bankChipActive]}
                                            onPress={() => { setBank(b); setErrors(e => ({ ...e, bank: '' })); }}
                                        >
                                            <Text style={[styles.bankChipText, bank === b && styles.bankChipTextActive]}>
                                                {b}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {errors.bank ? <Text style={styles.errorText}>{errors.bank}</Text> : null}
                            </View>
                        )}
                    </View>

                    {/* ── Order Summary ── */}
                    <View style={styles.orderSummary}>
                        <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>{plan.name} Plan</Text>
                            <Text style={styles.orderValue}>{plan.price}</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>Joining Fee (one-time)</Text>
                            <Text style={styles.orderValue}>₹999</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>GST (18%)</Text>
                            <Text style={styles.orderValue}>Incl.</Text>
                        </View>
                        <View style={[styles.orderRow, styles.orderTotal]}>
                            <Text style={styles.orderTotalLabel}>Due Today</Text>
                            <Text style={styles.orderTotalValue}>
                                {plan.name === 'Seedling' ? '₹3,998' : plan.name === 'Forged' ? '₹6,498' : '₹10,998'}
                            </Text>
                        </View>
                    </View>

                    {/* ── Submit ── */}
                    <View style={styles.ctaSection}>
                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: plan.color }, loading && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            activeOpacity={0.85}
                            disabled={loading}
                        >
                            <Text style={styles.submitBtnText}>
                                {loading ? 'Creating Account…' : 'Confirm & Pay →'}
                            </Text>
                            <Text style={styles.submitBtnSub}>
                                {plan.price.toUpperCase()} · {plan.name.toUpperCase()} PLAN
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.secureRow}>
                            <Text style={styles.secureText}>🔒 Secured by Razorpay · 256-bit SSL</Text>
                        </View>
                        <Text style={styles.ctaDisclaimer}>
                            By continuing you agree to our Terms of Service and Privacy Policy.
                            Cancel anytime after your first month.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff8f3' },
    scrollContent: { paddingTop: 4 },
    progressBar: { flexDirection: 'row', gap: 6, paddingHorizontal: 24, paddingVertical: 12 },
    progressStep: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#e2bfb9' },
    progressActive: { backgroundColor: C.primary },
    progressDone: { backgroundColor: C.primary + 'aa' },
    headerSection: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20, gap: 10 },
    capsLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: C.secondary, textTransform: 'uppercase' },
    pageTitle: { fontSize: 32, fontWeight: '800', color: C.primary, letterSpacing: -0.5, lineHeight: 38 },
    pageSubtitle: { fontSize: 14, color: C.onSurfaceVariant, lineHeight: 22 },
    section: { paddingHorizontal: 24, paddingBottom: 28, gap: 12 },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: C.secondary },
    planScroll: { marginHorizontal: -4 },
    planChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.12)', backgroundColor: '#fff', marginHorizontal: 4, alignItems: 'center', gap: 2 },
    planChipName: { fontSize: 13, fontWeight: '800', color: C.onSurface },
    planChipPrice: { fontSize: 12, color: C.onSurfaceVariant },
    planSummary: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderLeftWidth: 4, overflow: 'hidden', padding: 14, gap: 12, alignItems: 'flex-start' },
    planSummaryBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
    planSummaryBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
    planSummaryRight: { flex: 1 },
    planSummaryPrice: { fontSize: 22, fontWeight: '800', color: C.onSurface },
    planSummaryPeriod: { fontSize: 13, fontWeight: '400', color: C.onSurfaceVariant },
    planSummaryFeature: { fontSize: 12, color: C.onSurfaceVariant, lineHeight: 18 },
    joiningFeeRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffebce', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
    joiningFeeText: { fontSize: 13, color: C.onSurface },
    joiningFeeAmount: { fontSize: 13, fontWeight: '700', color: C.primary },
    inputGroup: { gap: 6 },
    inputLabel: { fontSize: 12, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.3 },
    input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.12)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: C.onSurface },
    inputMono: { fontVariant: ['tabular-nums'], letterSpacing: 1 },
    inputError: { borderColor: '#e53935' },
    errorText: { fontSize: 11, color: '#e53935' },
    row: { flexDirection: 'row', gap: 12 },
    paymentTabs: { gap: 8 },
    paymentTab: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)' },
    paymentTabActive: { borderColor: C.primary, backgroundColor: '#fff5f0' },
    paymentTabIcon: { fontSize: 18 },
    paymentTabLabel: { fontSize: 14, color: C.onSurfaceVariant, fontWeight: '500' },
    paymentTabLabelActive: { color: C.primary, fontWeight: '700' },
    paymentForm: { gap: 12 },
    upiAppsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    upiAppChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
    upiAppText: { fontSize: 12, fontWeight: '600', color: C.onSurfaceVariant },
    bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    bankChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)', backgroundColor: '#fff' },
    bankChipActive: { borderColor: C.primary, backgroundColor: '#fff5f0' },
    bankChipText: { fontSize: 13, fontWeight: '600', color: C.onSurfaceVariant },
    bankChipTextActive: { color: C.primary },
    orderSummary: { marginHorizontal: 24, marginBottom: 8, backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', gap: 10 },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderLabel: { fontSize: 14, color: C.onSurfaceVariant },
    orderValue: { fontSize: 14, color: C.onSurface, fontWeight: '500' },
    orderTotal: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)', paddingTop: 10, marginTop: 2 },
    orderTotalLabel: { fontSize: 15, fontWeight: '800', color: C.onSurface },
    orderTotalValue: { fontSize: 18, fontWeight: '800', color: C.primary },
    ctaSection: { paddingHorizontal: 24, paddingTop: 20, gap: 12, alignItems: 'center' },
    submitBtn: { width: '100%', paddingVertical: 18, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: '#000', gap: 4 },
    submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 17 },
    submitBtnSub: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
    secureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    secureText: { fontSize: 12, color: C.onSurfaceVariant, fontWeight: '500' },
    ctaDisclaimer: { fontSize: 12, color: C.onSurfaceVariant, textAlign: 'center', lineHeight: 18, maxWidth: 300 },
});