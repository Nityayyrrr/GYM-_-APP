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
    Dimensions,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, styles as shared } from '../styles';
import { forgotPassword, verifyOTP, resetPassword } from '../api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const otpRefs = useRef<(TextInput | null)[]>([]);

    // Bottom sheet animation
    const sheetAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    // Success overlay
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0)).current;
    const checkOpacity = useRef(new Animated.Value(0)).current;
    const successTextOpacity = useRef(new Animated.Value(0)).current;

    // Slide up on mount
    useEffect(() => {
        Animated.parallel([
            Animated.spring(sheetAnim, {
                toValue: 0,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
            }),
            Animated.timing(backdropAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Slide down and close
    const handleClose = () => {
        Animated.parallel([
            Animated.timing(sheetAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(backdropAnim, {
                toValue: 0,
                duration: 280,
                useNativeDriver: true,
            }),
        ]).start(() => onBack());
    };

    // Resend countdown
    useEffect(() => {
        if (step !== 'otp') return;
        setResendTimer(30);
        setCanResend(false);
        const interval = setInterval(() => {
            setResendTimer((t) => {
                if (t <= 1) { clearInterval(interval); setCanResend(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [step]);

    // ── Handlers ────────────────────────────────────────────────────────────────

    const handleSendOtp = async () => {
        if (mobile.replace(/\D/g, '').length < 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await forgotPassword(mobile);
            setStep('otp');
        } catch (e: any) {
            setError(e.message || 'Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        const cleaned = value.replace(/[^0-9]/g, '').slice(-1);
        const next = [...otp];
        next[index] = cleaned;
        setOtp(next);
        if (cleaned && index < 5) otpRefs.current[index + 1]?.focus();
        if (!cleaned && index > 0) otpRefs.current[index - 1]?.focus();
    };

    const handleVerifyOtp = async () => {
        if (otp.join('').length < 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await verifyOTP(mobile, otp.join(''));
            setStep('newPassword');
        } catch (e: any) {
            setError(e.message || 'Invalid OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPass || !confirmPass) { setError('Please fill in both fields.'); return; }
        if (newPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (newPass !== confirmPass) { setError('Passwords do not match.'); return; }
        if (!/[A-Z]/.test(newPass)) { setError('Must contain an uppercase letter.'); return; }
        if (!/[a-z]/.test(newPass)) { setError('Must contain a lowercase letter.'); return; }
        if (!/\d/.test(newPass)) { setError('Must contain a number.'); return; }
        if (!/[!@#$%^&*]/.test(newPass)) { setError('Must contain a special character (!@#$%^&*).'); return; }

        setError('');
        setLoading(true);
        try {
            await resetPassword(mobile, newPass);
            triggerSuccessAnimation();
        } catch (e: any) {
            setError(e.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const triggerSuccessAnimation = () => {
        Animated.timing(overlayOpacity, { toValue: 1, duration: 350, useNativeDriver: true })
            .start(() => {
                Animated.parallel([
                    Animated.spring(checkScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
                    Animated.timing(checkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                ]).start(() => {
                    Animated.timing(successTextOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
                        .start(() => { setTimeout(() => onSuccess(), 900); });
                });
            });
    };

    const stepMeta: Record<Step, { capsLabel: string; title: string }> = {
        mobile: { capsLabel: 'Account Recovery', title: 'Forgot Your\nPassword?' },
        otp: { capsLabel: 'Verification', title: 'Enter the\nOTP Sent' },
        newPassword: { capsLabel: 'New Password', title: 'Set a New\nPassword' },
        done: { capsLabel: '', title: '' },
    };

    return (
        <Modal transparent animationType="none" visible onRequestClose={handleClose}>

            {/* Backdrop */}
            <Animated.View
                style={[styles.backdrop, { opacity: backdropAnim }]}
            >
                <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleClose} />
            </Animated.View>

            {/* Bottom Sheet */}
            <Animated.View
                style={[
                    styles.sheet,
                    { paddingBottom: insets.bottom + 16 },
                    { transform: [{ translateY: sheetAnim }] },
                ]}
            >
                {/* Handle bar */}
                <View style={styles.handleBar} />

                {/* Header row */}
                <View style={styles.sheetHeader}>
                    <View>
                        <Text style={styles.capsLabel}>{stepMeta[step].capsLabel}</Text>
                        <Text style={styles.sheetTitle}>{stepMeta[step].title}</Text>
                    </View>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <Text style={styles.closeBtnText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Subtitle */}
                {step === 'mobile' && (
                    <Text style={styles.subtitle}>
                        Enter your registered mobile number and we'll send you a one-time password.
                    </Text>
                )}
                {step === 'otp' && (
                    <Text style={styles.subtitle}>
                        A 6-digit OTP was sent to{' '}
                        <Text style={styles.highlight}>+91 {mobile}</Text>
                    </Text>
                )}
                {step === 'newPassword' && (
                    <Text style={styles.subtitle}>
                        Choose a strong password you haven't used before.
                    </Text>
                )}

                {/* Step indicator */}
                <View style={styles.stepBar}>
                    {(['mobile', 'otp', 'newPassword'] as Step[]).map((s, i) => {
                        const steps: Step[] = ['mobile', 'otp', 'newPassword'];
                        const currentIdx = steps.indexOf(step);
                        const isComplete = i < currentIdx;
                        const isActive = s === step;
                        return (
                            <View key={s} style={styles.stepItem}>
                                <View style={[
                                    styles.stepDot,
                                    isActive && styles.stepDotActive,
                                    isComplete && styles.stepDotComplete,
                                ]}>
                                    {isComplete
                                        ? <Text style={styles.stepDotTick}>✓</Text>
                                        : <Text style={[styles.stepDotNum, (isActive || isComplete) && { color: '#fff' }]}>{i + 1}</Text>
                                    }
                                </View>
                                {i < 2 && <View style={[styles.stepLine, isComplete && styles.stepLineComplete]} />}
                            </View>
                        );
                    })}
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* STEP 1: Mobile */}
                        {step === 'mobile' && (
                            <View style={styles.fieldSection}>
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
                                        autoFocus
                                    />
                                </View>
                                {error ? <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View> : null}
                                <TouchableOpacity
                                    style={[shared.primaryBtn, loading && { opacity: 0.7 }]}
                                    activeOpacity={0.85}
                                    onPress={handleSendOtp}
                                    disabled={loading}
                                >
                                    <Text style={shared.primaryBtnTitle}>{loading ? 'Sending OTP…' : 'Send OTP'}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* STEP 2: OTP */}
                        {step === 'otp' && (
                            <View style={styles.fieldSection}>
                                <Text style={styles.fieldLabel}>One-Time Password</Text>
                                <View style={styles.otpRow}>
                                    {otp.map((digit, i) => (
                                        <TextInput
                                            key={i}
                                            ref={(r) => { otpRefs.current[i] = r; }}
                                            style={[styles.otpBox, digit.length > 0 && styles.otpBoxFilled]}
                                            value={digit}
                                            onChangeText={(v) => handleOtpChange(v, i)}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            textAlign="center"
                                            selectTextOnFocus
                                        />
                                    ))}
                                </View>

                                <View style={styles.resendRow}>
                                    {canResend ? (
                                        <TouchableOpacity onPress={() => { setOtp(['', '', '', '', '', '']); setStep('otp'); }}>
                                            <Text style={styles.resendActive}>Resend OTP</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={styles.resendTimer}>
                                            Resend in <Text style={styles.resendTimerBold}>{resendTimer}s</Text>
                                        </Text>
                                    )}
                                    <TouchableOpacity onPress={() => { setError(''); setStep('mobile'); }}>
                                        <Text style={styles.changeNumber}>Change Number</Text>
                                    </TouchableOpacity>
                                </View>

                                {error ? <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View> : null}

                                <TouchableOpacity
                                    style={[shared.primaryBtn, loading && { opacity: 0.7 }]}
                                    activeOpacity={0.85}
                                    onPress={handleVerifyOtp}
                                    disabled={loading}
                                >
                                    <Text style={shared.primaryBtnTitle}>{loading ? 'Verifying…' : 'Verify OTP'}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* STEP 3: New Password */}
                        {step === 'newPassword' && (
                            <View style={styles.fieldSection}>
                                <Text style={styles.fieldLabel}>New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min. 8 chars, A-Z, 0-9, !@#$"
                                    placeholderTextColor={C.onSurfaceVariant}
                                    value={newPass}
                                    onChangeText={setNewPass}
                                    secureTextEntry
                                    returnKeyType="next"
                                />

                                <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Confirm Password</Text>
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

                                {newPass.length > 0 && (
                                    <View style={styles.strengthRow}>
                                        {[8, 12, 16].map((threshold, i) => (
                                            <View key={i} style={[styles.strengthBar, newPass.length >= threshold && styles.strengthBarFilled]} />
                                        ))}
                                        <Text style={styles.strengthLabel}>
                                            {newPass.length < 8 ? 'Too short' : newPass.length < 12 ? 'Fair' : newPass.length < 16 ? 'Good' : 'Strong'}
                                        </Text>
                                    </View>
                                )}

                                {error ? <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View> : null}

                                <TouchableOpacity
                                    style={[shared.primaryBtn, loading && { opacity: 0.7 }]}
                                    activeOpacity={0.85}
                                    onPress={handleResetPassword}
                                    disabled={loading}
                                >
                                    <Text style={shared.primaryBtnTitle}>{loading ? 'Updating…' : 'Reset Password'}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </Animated.View>

            {/* Success Overlay */}
            <Animated.View style={[styles.successOverlay, { opacity: overlayOpacity }]} pointerEvents="none">
                <Animated.View style={[styles.successIconWrap, { opacity: checkOpacity, transform: [{ scale: checkScale }] }]}>
                    <View style={styles.checkCircle}>
                        <View style={styles.checkStem} />
                        <View style={styles.checkKick} />
                    </View>
                </Animated.View>
                <Animated.Text style={[styles.successLabel, { opacity: successTextOpacity }]}>Password Reset!</Animated.Text>
                <Animated.Text style={[styles.successSub, { opacity: successTextOpacity }]}>You can now sign in with your new password</Animated.Text>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff8f3',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 12,
        maxHeight: SCREEN_HEIGHT * 0.92,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 20,
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: C.outline,
        alignSelf: 'center',
        marginBottom: 16,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    capsLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        color: C.primary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    sheetTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: C.onSurface,
        letterSpacing: -0.5,
        lineHeight: 30,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: C.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: {
        fontSize: 14,
        color: C.onSurfaceVariant,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 13,
        color: C.onSurfaceVariant,
        lineHeight: 20,
        marginBottom: 16,
    },
    highlight: {
        color: C.primary,
        fontWeight: '600',
    },
    stepBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    stepDot: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 1.5,
        borderColor: C.outline,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDotActive: { backgroundColor: C.primary, borderColor: C.primary },
    stepDotComplete: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
    stepDotNum: { fontSize: 11, fontWeight: '700', color: C.onSurfaceVariant },
    stepDotTick: { fontSize: 11, fontWeight: '800', color: '#fff' },
    stepLine: { flex: 1, height: 1.5, backgroundColor: C.outline, marginHorizontal: 4 },
    stepLineComplete: { backgroundColor: '#2e7d32' },
    scrollContent: { paddingBottom: 16 },
    fieldSection: { gap: 12 },
    fieldLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: C.onSurfaceVariant,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    mobileRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    dialCode: {
        borderWidth: 1,
        borderColor: C.outline,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: C.surfaceVariant,
        justifyContent: 'center',
    },
    dialCodeText: { fontSize: 14, color: C.onSurface, fontWeight: '600' },
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
    errorBanner: { backgroundColor: '#ffdad4', borderRadius: 8, padding: 12 },
    errorText: { fontSize: 13, color: '#8f0f07', fontWeight: '500' },
    otpRow: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
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
    otpBoxFilled: { borderColor: C.primary, backgroundColor: '#fff' },
    resendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    resendTimer: { fontSize: 13, color: C.onSurfaceVariant },
    resendTimerBold: { fontWeight: '700', color: C.onSurface },
    resendActive: { fontSize: 13, color: C.primary, fontWeight: '700' },
    changeNumber: { fontSize: 13, color: C.primary, fontWeight: '600' },
    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    strengthBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.outline },
    strengthBarFilled: { backgroundColor: C.primary },
    strengthLabel: { fontSize: 11, fontWeight: '600', color: C.onSurfaceVariant, width: 48, textAlign: 'right' },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff8f3',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    successIconWrap: { marginBottom: 8 },
    checkCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: C.primary,
        alignItems: 'center', justifyContent: 'center', position: 'relative',
    },
    checkStem: {
        position: 'absolute', width: 4, height: 22, backgroundColor: '#fff',
        borderRadius: 2, bottom: 22, left: 30, transform: [{ rotate: '45deg' }],
    },
    checkKick: {
        position: 'absolute', width: 4, height: 36, backgroundColor: '#fff',
        borderRadius: 2, bottom: 20, left: 40, transform: [{ rotate: '-45deg' }],
    },
    successLabel: { fontSize: 26, fontWeight: '800', color: C.onSurface, letterSpacing: -0.4 },
    successSub: { fontSize: 15, color: C.onSurfaceVariant, fontWeight: '500', textAlign: 'center', paddingHorizontal: 32 },
});