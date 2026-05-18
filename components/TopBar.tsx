import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { C } from '../styles';

export default function TopBar({
    onBack,
    title,
}: {
    onBack?: () => void;
    title?: string;
}) {
    return (
        <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
                {onBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={{ fontSize: 20, marginRight: 6 }}>🏋️</Text>
                )}
                <Text style={styles.topBarTitle}>
                    {title ?? 'Forge & Flora'}
                </Text>
            </View>
            <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpIcon}>?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        height: 64,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    topBarTitle: {
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 1.5,
        color: C.onSurface,
        textTransform: 'uppercase',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: C.surfaceVariant,
        marginRight: 4,
    },
    backArrow: {
        fontSize: 18,
        color: C.onSurface,
    },
    helpButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: C.surfaceVariant,
    },
    helpIcon: {
        fontSize: 15,
        color: C.onSurfaceVariant,
        fontWeight: '600',
    },
});