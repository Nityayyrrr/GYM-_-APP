import { StyleSheet } from 'react-native';

export const C = {
    primary: '#b22b1d',
    secondary: '#815344',
    onPrimary: '#ffffff',
    surface: '#ffffff',
    surfaceBright: '#ffffff',
    surfaceVariant: '#f3f4f6',
    onSurface: '#1a1a1a',
    onSurfaceVariant: '#4b5563',
    outline: '#d1d5db',
};

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: C.surfaceBright,
    },
    capsLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        color: C.primary,
        textTransform: 'uppercase',
    },
    primaryBtn: {
        width: '100%',
        paddingVertical: 18,
        paddingHorizontal: 24,
        backgroundColor: C.primary,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    primaryBtnTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: C.onPrimary,
    },
    primaryBtnSub: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: 1.5,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    secondaryBtn: {
        width: '100%',
        paddingVertical: 18,
        paddingHorizontal: 24,
        backgroundColor: C.surface,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    secondaryBtnTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: C.onSurface,
    },
    secondaryBtnSub: {
        fontSize: 10,
        fontWeight: '600',
        color: C.onSurfaceVariant,
        letterSpacing: 1.5,
        marginTop: 2,
        textTransform: 'uppercase',
    },
});