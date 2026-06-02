import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, styles as shared } from '../styles';
import TopBar from '../components/TopBar';

// ─── Steps ───────────────────────────────────────────────────────────────────
type Step = 'mobile' | 'otp' | 'newPassword' | 'done';

export default function ForgotPasswordScreen({
    onBack,
    onSuccess,
}: {
    onBack: () => void;
    onSuccess: () => void;
}) {
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState<Step>('mobile');

    // Field values
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // OTP input refs
    const otpRefs = useRef<(TextInput | null)[]>([]);

    // Entry animations (re-run on step change)
    const heroAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const field1Anim = useRef(new Animated.Value(0)).current;
    const field2Anim = useRef(new Animated.Value(0)).current;
    const btnAnim = useRef(new Animated.Value(0)).current;

    // Success overlay
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0)).current;
    const checkOpacity = useRef(new Animated.Value(0)).current;
    const successTextOpacity = useRef(new Animated.Value(0)).current;

    // Re-animate on step change
    useEffect(() => {
        [heroAnim, cardAnim, field1Anim, field2Anim, btnAnim].forEach((a) => a.setValue(0));
        Animated.stagger(90, [
            Animated.spring(heroAnim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
            Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
            Animated.spring(field1Anim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
            Animated.spring(field2Anim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
            Animated.spring(btnAnim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 10 }),
        ]).start();
    }, [step]);

    // Resend countdown
    useEffect(() => {
        if (step !== 'otp') return;
        setResendTimer(30);
        setCanResend(false);
        const interval = setInterval(() => {
            setResendTimer((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [step]);

    const animStyle = (anim: Animated.Value) => ({
        opacity: anim,
        transform: [
            {
                translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                }),
            },
        ],
    });

    // ── Handlers ────────────────────────────────────────────────────────────────

    const handleSendOtp = () => {
        if (mobile.replace(/\D/g, '').length < 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
        }, 1200);
    };

    const handleOtpChange = (value: string, index: number) => {
        const cleaned = value.replace(/[^0-9]/g, '').slice(-1);
        const next = [...otp];
        next[index] = cleaned;
        setOtp(next);
        if (cleaned && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
        if (!cleaned && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = () => {
        if (otp.join('').length < 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('newPassword');
        }, 1200);
    };

    const handleResetPassword = () => {
        if (!newPass || !confirmPass) {
            setError('Please fill in both fields.');
            return;
        }
        if (newPass.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (newPass !== confirmPass) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            triggerSuccessAnimation();
        }, 1200);
    };

    const triggerSuccessAnimation = () => {
        Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start(() => {
            Animated.parallel([
                Animated.spring(checkScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
                Animated.timing(checkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start(() => {
                Animated.timing(successTextOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setTimeout(() => onSuccess(), 900);
                });
            });
        });
    };

    // ── Step content ─────────────────────────────────────────────────────────────

    const stepMeta: Record<Step, { capsLabel: string; title: string }> = {
        mobile: { capsLabel: 'Account Recovery', title: 'Forgot Your\nPassword?' },
        otp: { capsLabel: 'Verification', title: 'Enter the\nOTP Sent' },
        newPassword: { capsLabel: 'New Password', title: 'Set a New\nPassword' },
        done: { capsLabel: '', title: '' },
    };

    const currentMeta = stepMeta[step];

    // ── Render ───────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" translucent={false} backgroundColor="#fff8f3" />
            <TopBar onBack={onBack} title="Forgot Password" />
            <View style={styles.divider} />

            {/* Step indicator */}
            <View style={styles.stepBar}>
                {(['mobile', 'otp', 'newPassword'] as Step[]).map((s, i) => {
                    const steps: Step[] = ['mobile', 'otp', 'newPassword'];
                    const currentIdx = steps.indexOf(step);
                    const isComplete = i < currentIdx;
                    const isActive = s === step;
                    return (
                        <View key={s} style={styles.stepItem}>
                            <View
                                style={[
                                    styles.stepDot,
                                    isActive && styles.stepDotActive,
                                    isComplete && styles.stepDotComplete,
                                ]}
                            >
                                {isComplete ? (
                                    <Text style={styles.stepDotTick}>✓</Text>
                                ) : (
                                    <Text
                                        style={[
                                            styles.stepDotNum,
                                            (isActive || isComplete) && { color: '#fff' },
                                        ]}
                                    >
                                        {i + 1}
                                    </Text>
                                )}
                            </View>
                            {i < 2 && (
                                <View
                                    style={[styles.stepLine, isComplete && styles.stepLineComplete]}
                                />
                            )}
                        </View>
                    );
                })}
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.formContent,
                        { paddingBottom: insets.bottom + 48 },
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero */}
                    <Animated.View style={[styles.formHero, animStyle(heroAnim)]}>
                        <Text style={shared.capsLabel}>{currentMeta.capsLabel}</Text>
                        <Text style={styles.formTitle}>{currentMeta.title}</Text>
                        {step === 'mobile' && (
                            <Text style={styles.formSubtitle}>
                                Enter your registered mobile number and we'll send you a one-time password.
                            </Text>
                        )}
                        {step === 'otp' && (
                            <Text style={styles.formSubtitle}>
                                A 6-digit OTP was sent to{' '}
                                <Text style={styles.highlight}>+91 {mobile}</Text>
                            </Text>
                        )}
                        {step === 'newPassword' && (
                            <Text style={styles.formSubtitle}>
                                Choose a strong password you haven't used before.
                            </Text>
                        )}
                    </Animated.View>

                    {/* ── Card ── */}
                    <Animated.View style={[styles.formCard, animStyle(cardAnim)]}>

                        {/* STEP 1: Mobile */}
                        {step === 'mobile' && (
                            <>
                                <Animated.View style={[styles.fieldGroup, animStyle(field1Anim)]}>
                                    <Text style={styles.fieldLabel}>Mobile Number</Text>
                                    <View style={styles.mobileRow}>
                                        <View style={styles.dialCode}>
                                            <Text style={styles.dialCodeText}>🇮🇳  +91</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.input, styles.mobileInput]}
                                            placeholder="98765 43210"
                                            placeholderTextColor={C.onSurfaceVariant}
                                            value={mobile}
                                            onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ''))}
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                            returnKeyType="done"
                                            onSubmitEditing={handleSendOtp}
                                        />
                                    </View>
                                </Animated.View>

                                {error ? (
                                    <View style={styles.errorBanner}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <Animated.View style={animStyle(btnAnim)}>
                                    <TouchableOpacity
                                        style={[shared.primaryBtn, loading && { opacity: 0.7 }]}
                                        activeOpacity={0.85}
                                        onPress={handleSendOtp}
                                        disabled={loading}
                                    >
                                        <Text style={shared.primaryBtnTitle}>
                                            {loading ? 'Sending OTP…' : 'Send OTP'}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </>
                        )}

                        {/* STEP 2: OTP */}
                        {step === 'otp' && (
                            <>
                                <Animated.View style={[styles.fieldGroup, animStyle(field1Anim)]}>
                                    <Text style={styles.fieldLabel}>One-Time Password</Text>
                                    <View style={styles.otpRow}>
                                        {otp.map((digit, i) => (
                                            <TextInput
                                                key={i}
                                                ref={(r) => { otpRefs.current[i] = r; }}
                                                style={[
                                                    styles.otpBox,
                                                    digit.length > 0 && styles.otpBoxFilled,
                                                ]}
                                                value={digit}
                                                onChangeText={(v) => handleOtpChange(v, i)}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                textAlign="center"
                                                selectTextOnFocus
                                            />
                                        ))}
                                    </View>
                                </Animated.View>

                                {/* Resend */}
                                <Animated.View style={[styles.resendRow, animStyle(field2Anim)]}>
                                    {canResend ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setOtp(['', '', '', '', '', '']);
                                                setStep('otp'); // re-triggers timer via useEffect
                                            }}
                                        >
                                            <Text style={styles.resendActive}>Resend OTP</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={styles.resendTimer}>
                                            Resend in{' '}
                                            <Text style={styles.resendTimerBold}>{resendTimer}s</Text>
                                        </Text>
                                    )}
                                    <TouchableOpacity onPress={() => { setError(''); setStep('mobile'); }}>
                                        <Text style={styles.changeNumber}>Change Number</Text>
                                    </TouchableOpacity>
                                </Animated.View>

                                {error ? (
                                    <View style={styles.errorBanner}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <Animated.View style={animStyle(btnAnim)}>
                                    <TouchableOpacity
                                        style={[shared.primaryBtn, loading && { opacity: 0.7 }]}
                                        activeOpacity={0.85}
                                        onPress={handleVerifyOtp}
                                        disabled={loading}
                                    >
                                        <Text style={shared.primaryBtnTitle}>
                                            {loading ? 'Verifying…' : 'Verify OTP'}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </>
                        )}

                        {/* STEP 3: New Password */}
                        {step === 'newPassword' && (
                            <>
                                <Animated.View style={[styles.fieldGroup, animStyle(field1Anim)]}>
                                    <Text style={styles.fieldLabel}>New Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Min. 8 characters"
                                        placeholderTextColor={C.onSurfaceVariant}
                                        value={newPass}
                                        onChangeText={setNewPass}
                                        secureTextEntry
                                        returnKeyType="next"
                                    />
                                </Animated.View>

                                <Animated.View style={[styles.fieldGroup, animStyle(field2Anim)]}>
                                    <Text style={styles.fieldLabel}>Confirm Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Re-enter new password"
                                        placeholderTextColor={C.onSurfaceVariant}
                                        value={confirmPass}
                                        onChangeText={setConfirmPass}
                                        secureTextEntry
                                        returnKeyType="done"
                                        onSubmitEditing={handleResetPassword}
                                    />
                                </Animated.View>

                                {/* Password strength hint */}
                                {newPass.length > 0 && (
                                    <View style={styles.strengthRow}>
                                        {[8, 12, 16].map((threshold, i) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.strengthBar,
                                                    newPass.length >= threshold && styles.strengthBarFilled,
                                                ]}
                                            />
                                        ))}
                                        <Text style={styles.strengthLabel}>
                                            {newPass.length < 8
                                                ? 'Too short'
                                                : newPass.length < 12
                                                    ? 'Fair'
                                                    : newPass.length < 16
                                                        ? 'Good'
                                                        : 'Strong'}
                                        </Text>
                                    </View>
                                )}

                                {error ? (
                                    <View style={styles.errorBanner}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <Animated.View style={animStyle(btnAnim)}>
                                    <TouchableOpacity
                                        style={[shared.primaryBtn, loading && { opacity: 0.7 }]}
                                        activeOpacity={0.85}
                                        onPress={handleResetPassword}
                                        disabled={loading}
                                    >
                                        <Text style={shared.primaryBtnTitle}>
                                            {loading ? 'Updating…' : 'Reset Password'}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </>
                        )}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Success Overlay ── */}
            <Animated.View
                style={[styles.successOverlay, { opacity: overlayOpacity }]}
                pointerEvents="none"
            >
                <Animated.View
                    style={[
                        styles.successIconWrap,
                        { opacity: checkOpacity, transform: [{ scale: checkScale }] },
                    ]}
                >
                    <View style={styles.checkCircle}>
                        <View style={styles.checkStem} />
                        <View style={styles.checkKick} />
                    </View>
                </Animated.View>
                <Animated.Text style={[styles.successLabel, { opacity: successTextOpacity }]}>
                    Password Reset!
                </Animated.Text>
                <Animated.Text style={[styles.successSub, { opacity: successTextOpacity }]}>
                    You can now sign in with your new password
                </Animated.Text>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff8f3',
    },
    divider: {
        height: 1,
        backgroundColor: C.outline,
        opacity: 0.4,
    },

    // ── Step indicator ──────────────────────────────────────────────────────────
    stepBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        backgroundColor: '#fff8f3',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    stepDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: C.outline,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDotActive: {
        backgroundColor: C.primary ?? '#800000',
        borderColor: C.primary ?? '#800000',
    },
    stepDotComplete: {
        backgroundColor: '#2e7d32',
        borderColor: '#2e7d32',
    },
    stepDotNum: {
        fontSize: 12,
        fontWeight: '700',
        color: C.onSurfaceVariant,
    },
    stepDotTick: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
    },
    stepLine: {
        flex: 1,
        height: 1.5,
        backgroundColor: C.outline,
        marginHorizontal: 4,
    },
    stepLineComplete: {
        backgroundColor: '#2e7d32',
    },

    // ── Form layout ─────────────────────────────────────────────────────────────
    formContent: {
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    formHero: {
        marginBottom: 20,
        gap: 8,
    },
    formTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: C.onSurface,
        letterSpacing: -0.5,
        lineHeight: 34,
    },
    formSubtitle: {
        fontSize: 14,
        color: C.onSurfaceVariant,
        lineHeight: 20,
        fontWeight: '400',
    },
    highlight: {
        color: C.primary ?? '#800000',
        fontWeight: '600',
    },
    formCard: {
        backgroundColor: C.surface,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: C.outline,
        padding: 20,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    fieldGroup: { gap: 6 },
    fieldLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: C.onSurfaceVariant,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    mobileRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    dialCode: {
        borderWidth: 1,
        borderColor: C.outline,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: C.surfaceVariant,
        justifyContent: 'center',
    },
    dialCodeText: {
        fontSize: 14,
        color: C.onSurface,
        fontWeight: '600',
    },
    mobileInput: { flex: 1 },
    input: {
        borderWidth: 1,
        borderColor: C.outline,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: C.onSurface,
        backgroundColor: C.surfaceVariant,
    },
    errorBanner: {
        backgroundColor: '#ffdad4',
        borderRadius: 8,
        padding: 12,
    },
    errorText: {
        fontSize: 13,
        color: '#8f0f07',
        fontWeight: '500',
    },

    // ── OTP boxes ───────────────────────────────────────────────────────────────
    otpRow: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
    },
    otpBox: {
        flex: 1,
        aspectRatio: 0.9,
        borderWidth: 1.5,
        borderColor: C.outline,
        borderRadius: 10,
        fontSize: 20,
        fontWeight: '700',
        color: C.onSurface,
        backgroundColor: C.surfaceVariant,
    },
    otpBoxFilled: {
        borderColor: C.primary ?? '#800000',
        backgroundColor: '#fff',
    },

    // ── Resend row ───────────────────────────────────────────────────────────────
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -4,
    },
    resendTimer: {
        fontSize: 13,
        color: C.onSurfaceVariant,
    },
    resendTimerBold: {
        fontWeight: '700',
        color: C.onSurface,
    },
    resendActive: {
        fontSize: 13,
        color: C.primary ?? '#800000',
        fontWeight: '700',
    },
    changeNumber: {
        fontSize: 13,
        color: C.primary ?? '#800000',
        fontWeight: '600',
    },

    // ── Password strength ────────────────────────────────────────────────────────
    strengthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: -4,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: C.outline,
    },
    strengthBarFilled: {
        backgroundColor: C.primary ?? '#800000',
    },
    strengthLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: C.onSurfaceVariant,
        width: 48,
        textAlign: 'right',
    },

    // ── Success overlay ──────────────────────────────────────────────────────────
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff8f3',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    successIconWrap: { marginBottom: 8 },
    checkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: C.primary ?? '#800000',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    checkStem: {
        position: 'absolute',
        width: 4,
        height: 22,
        backgroundColor: '#fff',
        borderRadius: 2,
        bottom: 22,
        left: 30,
        transform: [{ rotate: '45deg' }],
    },
    checkKick: {
        position: 'absolute',
        width: 4,
        height: 36,
        backgroundColor: '#fff',
        borderRadius: 2,
        bottom: 20,
        left: 40,
        transform: [{ rotate: '-45deg' }],
    },
    successLabel: {
        fontSize: 26,
        fontWeight: '800',
        color: C.onSurface,
        letterSpacing: -0.4,
    },
    successSub: {
        fontSize: 15,
        color: C.onSurfaceVariant,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});