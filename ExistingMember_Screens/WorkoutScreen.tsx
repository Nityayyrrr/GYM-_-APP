import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Image,
    Modal,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// ─── LOCAL EXERCISE IMAGES ───────────────────────────────────────────────────
const LOCAL_IMAGES = {
    // Mon
    chestFly: require('../assets/images/chest_fly.png'),
    chestPress: require('../assets/images/chest_press.png'),
    tricepPushdown: require('../assets/images/tricep_pushdown.png'),
    // Tue
    latPulldown: require('../assets/images/lat_pulldown.png'),
    seatedCableRow: require('../assets/images/seated_cable_row.png'),
    bicepCurl: require('../assets/images/bicep_curl.png'),
    // Wed
    shoulderPress: require('../assets/images/shoulder_press.png'),
    cableLateralRaise: require('../assets/images/cable_lateral_raise.png'),
    crunchMachine: require('../assets/images/crunch_machine.png'),
    // Thu
    legPress: require('../assets/images/leg_press.png'),
    legExtension: require('../assets/images/leg_extension.png'),
    legCurl: require('../assets/images/leg_curl.png'),
    // Sat
    backExtension: require('../assets/images/back_extension.png'),
    calfRaise: require('../assets/images/calf_raise.png'),
};

interface Exercise {
    name: string;
    machine: string;
    setsReps: string;
    // imageUri is now optional — use imageSource (local require) when available
    imageUri?: string;
    imageSource?: ReturnType<typeof require>;
    instructions: string[];
}

interface WorkoutDayPlan {
    focus: string;
    icon: string;
    accent: string;
    bgTheme: string;
    exercises: Exercise[];
}

const DAYS: { key: DayKey; label: string; short: string }[] = [
    { key: 'mon', label: 'Monday', short: 'MON' },
    { key: 'tue', label: 'Tuesday', short: 'TUE' },
    { key: 'wed', label: 'Wednesday', short: 'WED' },
    { key: 'thu', label: 'Thursday', short: 'THU' },
    { key: 'fri', label: 'Friday', short: 'FRI' },
    { key: 'sat', label: 'Saturday', short: 'SAT' },
    { key: 'sun', label: 'Sunday', short: 'SUN' },
];

const JS_TO_KEY: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const todayKey = JS_TO_KEY[new Date().getDay()];

// ─── COMPREHENSIVE WORKOUT PLANS DATA MAP ────────────────────────────────────
const WORKOUT_PLANS: Record<DayKey, WorkoutDayPlan> = {
    mon: {
        focus: 'Chest & Triceps Push',
        icon: '💪',
        accent: '#2563eb',
        bgTheme: '#eff6ff',
        exercises: [
            {
                name: 'Machine Chest Fly',
                machine: 'Pec Deck / Butterfly Machine',
                setsReps: '3 Sets x 12-15 Reps',
                imageSource: LOCAL_IMAGES.chestFly,          // ← local image
                instructions: [
                    'Adjust seat height so handles sit level with your mid-chest.',
                    'Keep your spine completely flat against the pad and plant your feet firmly.',
                    'Exhale as you press handles together in a wide, controlled arc.',
                    'Squeeze your chest at the peak before slowly returning to the start.'
                ]
            },
            {
                name: 'Chest Press Machine',
                machine: 'Seated Chest Press',
                setsReps: '4 Sets x 10 Reps',
                imageSource: LOCAL_IMAGES.chestPress,        // ← local image
                instructions: [
                    'Position your grip comfortably on the handles just wider than shoulder width.',
                    'Drive the weight upward explosively along the pre-guided machine track.',
                    'Keep your shoulders retracted back against the frame to isolate pectoral fibers.',
                    'Lower under full tension until the handles hover just off chest level.'
                ]
            },
            {
                name: 'Tricep Pushdown',
                machine: 'Cable Tower Station',
                setsReps: '4 Sets x 12 Reps',
                imageSource: LOCAL_IMAGES.tricepPushdown,    // ← local image
                instructions: [
                    'Attach a bar or rope setup to the top pulley configuration.',
                    'Face toward the stack, pinning your elbow units close to your torso frame.',
                    'Extend your arms down completely, squeezing your triceps at the bottom.',
                    'Allow the cable bar to return up smoothly until hands cross chest level.'
                ]
            }
        ]
    },
    tue: {
        focus: 'Back & Biceps Pull',
        icon: '📐',
        accent: '#059669',
        bgTheme: '#ecfdf5',
        exercises: [
            {
                name: 'Wide-Grip Lat Pulldown',
                machine: 'Lat Pulldown Station',
                setsReps: '4 Sets x 10-12 Reps',
                imageSource: LOCAL_IMAGES.latPulldown,       // ← local image
                instructions: [
                    'Lock your knees firmly beneath the padded stabilization roller rods.',
                    'Grasp the long bar outside shoulder width with a solid overhand grip.',
                    'Depress your scapula and pull down forcefully towards your upper chest.',
                    'Control the upward release path to maximize your lat eccentric stretching.'
                ]
            },
            {
                name: 'Seated Cable Row',
                machine: 'Low Pulley Row Unit',
                setsReps: '3 Sets x 12 Reps',
                imageSource: LOCAL_IMAGES.seatedCableRow,    // ← local image
                instructions: [
                    'Place feet on structural footplates, keeping a soft bend in your knee line.',
                    'Pull the handles back towards your navel while keeping your spine straight.',
                    'Squeeze your shoulder blades together hard at the back of the movement.',
                    'Extend your arms forward under tension, avoiding excessive lower back leaning.'
                ]
            },
            {
                name: 'Bicep Curls',
                machine: 'Isolated Cable Station',
                setsReps: '4 Sets x 12 Reps',
                imageSource: LOCAL_IMAGES.bicepCurl,         // ← local image
                instructions: [
                    'Grasp the handle setup with an underhand grip at hip height.',
                    'Pin your elbow units close to your torso frame throughout the movement.',
                    'Squeeze handles upward smoothly to contract your biceps.',
                    'Lower slowly back into a full extension without dropping the weight stack.'
                ]
            }
        ]
    },
    wed: {
        focus: 'Shoulders & Core Power',
        icon: '🦅',
        accent: '#7c3aed',
        bgTheme: '#f5f3ff',
        exercises: [
            {
                name: 'Machine Shoulder Press',
                machine: 'Overhead Press Machine',
                setsReps: '3 Sets x 10 Reps',
                imageSource: LOCAL_IMAGES.shoulderPress,
                instructions: [
                    'Set seat base height so the handle grips align at lower jaw level.',
                    'Keep your core tight and head straight against the back pad structure.',
                    'Press handles vertically upward until arms are extended but not hyperextended.',
                    'Lower under eccentric control to terminal shoulder baseline depth.'
                ]
            },
            {
                name: 'Cable Lateral Raise',
                machine: 'Low Cable Pulley Unit',
                setsReps: '4 Sets x 15 Reps',
                imageSource: LOCAL_IMAGES.cableLateralRaise,
                instructions: [
                    'Stand sideways to the machine cable track, gripping handle across your body line.',
                    'Raise your arm outward laterally to the side in a wide mechanical arc.',
                    'Lead the upward path with your elbow to target the lateral deltoid head.',
                    'Lower smoothly back to the structural starting point to keep active tension.'
                ]
            },
            {
                name: 'Crunch Machine Focus',
                machine: 'Abdominal Isolation Machine',
                setsReps: '3 Sets x 15 Reps',
                imageSource: LOCAL_IMAGES.crunchMachine,
                instructions: [
                    'Select a light to moderate resistance weight setting.',
                    'Position your upper back safely against the padded roller lever setup.',
                    'Contract your abdominal core fibers tightly to flex your torso forward.',
                    'Return down under steady structural eccentric tracking control.'
                ]
            }
        ]
    },
    thu: {
        focus: 'Leg Day Hypertrophy',
        icon: '🦵',
        accent: '#dc2626',
        bgTheme: '#fef2f2',
        exercises: [
            {
                name: 'Leg Press Sled',
                machine: 'Linear Leg Press Machine',
                setsReps: '4 Sets x 12 Reps',
                imageSource: LOCAL_IMAGES.legPress,
                instructions: [
                    'Place feet shoulder-width apart in the center of the sled matrix plate.',
                    'Release safety latches cleanly while holding weight up firmly.',
                    'Lower the heavy sled carriage toward your torso to an angle of 90 degrees.',
                    'Drive upward through your mid-foot and heels; avoid locking out knees.'
                ]
            },
            {
                name: 'Seated Leg Extension',
                machine: 'Quadriceps Isolation Machine',
                setsReps: '3 Sets x 15 Reps',
                imageSource: LOCAL_IMAGES.legExtension,
                instructions: [
                    'Align your knee joint directly with the machine structural rotation axis.',
                    'Hook your feet comfortably beneath the padded lower cylindrical roller bar.',
                    'Contract your quadriceps fully to extend your legs straight forward.',
                    'Hold for one second at peak contraction before lowering slowly.'
                ]
            },
            {
                name: 'Leg Curl Machine',
                machine: 'Hamstring Isolation Unit',
                setsReps: '4 Sets x 12 Reps',
                imageSource: LOCAL_IMAGES.legCurl,
                instructions: [
                    'Sit or lie prone on the bench matrix, aligning knees with the machine pivot.',
                    'Position lower pad roller directly over your lower Achilles tendon line.',
                    'Curl your heels back in an explosive, smooth movement.',
                    'Control the lower path to keep continuous workload across hamstrings.'
                ]
            }
        ]
    },
    fri: {
        focus: 'Arms Hypertrophy Burn',
        icon: '🔥',
        accent: '#db2777',
        bgTheme: '#fdf2f8',
        exercises: [
            {
                name: 'Cable Bicep Curl',
                machine: 'Dual Cable Straight Bar Unit',
                setsReps: '4 Sets x 12 Reps',
                imageSource: LOCAL_IMAGES.bicepCurl,         // ← reuse local image
                instructions: [
                    'Grasp the straight metal cable bar attachment with an underhand grip.',
                    'Keep your elbows pinned into your side ribs to avoid mechanical swinging.',
                    'Curl the bar upward toward your collarbone, squeezing your biceps hard.',
                    'Slowly extend back down under full, controlled arm length.'
                ]
            },
            {
                name: 'Tricep Pushdown',
                machine: 'Cable Station Straight Bar',
                setsReps: '4 Sets x 12 Reps',
                imageSource: LOCAL_IMAGES.tricepPushdown,    // ← reuse local image
                instructions: [
                    'Grasp the bar handle setup with an overhand grip at chest height.',
                    'Pin your elbow units close to your torso frame throughout the movement.',
                    'Extend your arms down completely, squeezing your triceps at the bottom.',
                    'Allow the cable bar to return up smoothly until hands cross chest level.'
                ]
            }
        ]
    },
    sat: {
        focus: 'Posterior Chain & Calves',
        icon: '🏃',
        accent: '#d97706',
        bgTheme: '#fffbeb',
        exercises: [
            {
                name: 'Back Extension',
                machine: 'Hyper-Extension 45° Bench',
                setsReps: '3 Sets x 15 Reps',
                imageSource: LOCAL_IMAGES.backExtension,
                instructions: [
                    'Lock your ankles behind the roller pads and rest your hips flat on the pads.',
                    'Hinge forward from your hips smoothly, lowering your upper body.',
                    'Raise your torso up back until your spine forms a straight line.',
                    'Squeeze your glutes and lower back muscles tightly; avoid overextending backward.'
                ]
            },
            {
                name: 'Seated Calf Raise',
                machine: 'Calf Press Unit',
                setsReps: '4 Sets x 20 Reps',
                imageSource: LOCAL_IMAGES.calfRaise,
                instructions: [
                    'Place your toes on the bottom edge of the footplate with your heels hanging off.',
                    'Drop your heels down fully to achieve a deep calf muscle stretch.',
                    'Drive up forcefully onto your toes, holding peak contraction for a second.',
                    'Return smoothly under weight resistance control.'
                ]
            }
        ]
    },
    sun: {
        focus: 'System Recovery Rest',
        icon: '😴',
        accent: '#6b7280',
        bgTheme: '#f9fafb',
        exercises: []
    }
};

// ─── HELPER: resolve image source (local require OR remote uri) ───────────────
function getImageSource(ex: Exercise) {
    if (ex.imageSource) return ex.imageSource;
    if (ex.imageUri) return { uri: ex.imageUri };
    return undefined;
}

export default function WorkoutScreen() {
    const insets = useSafeAreaInsets();
    const [selDay, setSelDay] = useState<DayKey>(todayKey);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

    const dayAnimations = useRef(DAYS.map(() => new Animated.Value(0))).current;
    const cardsFadeAnim = useRef(new Animated.Value(0)).current;

    const currentPlan = WORKOUT_PLANS[selDay];

    useEffect(() => {
        const entryGroup = dayAnimations.map((anim, i) =>
            Animated.spring(anim, { toValue: 1, tension: 45, friction: 7, delay: i * 35, useNativeDriver: true })
        );
        Animated.parallel(entryGroup).start();
    }, []);

    useEffect(() => {
        cardsFadeAnim.setValue(0);
        Animated.timing(cardsFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }, [selDay]);

    const selectExerciseCard = (ex: Exercise) => {
        setActiveExercise(ex);
        setModalVisible(true);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* HEADER ZONE */}
            <View style={styles.header}>
                <Text style={styles.eyebrow}>ROUTINE SCHEDULE</Text>
                <Text style={styles.title}>Weekly Exercises</Text>
            </View>

            {/* SEGMENTED DAY CHIPS SELECTOR */}
            <View style={styles.dayWrap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayInner}>
                    {DAYS.map((d, index) => {
                        const isActive = d.key === selDay;
                        const scaleIn = dayAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1]
                        });
                        return (
                            <Animated.View key={d.key} style={{ transform: [{ scale: scaleIn }] }}>
                                <TouchableOpacity
                                    onPress={() => setSelDay(d.key)}
                                    activeOpacity={0.75}
                                    style={[
                                        styles.dayChip,
                                        isActive && { backgroundColor: currentPlan.accent }
                                    ]}
                                >
                                    <Text style={[styles.dayChipTxt, isActive && styles.dayChipTxtOn]}>{d.short}</Text>
                                    {isActive && <View style={styles.activeIndicatorDot} />}
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </ScrollView>
            </View>

            {/* DYNAMIC CARD SCROLL LIST */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>

                {/* FOCUS HEADLINE BADGE */}
                <View style={[styles.focusHeadlineBox, { backgroundColor: currentPlan.bgTheme, borderLeftColor: currentPlan.accent }]}>
                    <Text style={styles.focusIcon}>{currentPlan.icon}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.focusLabelText, { color: currentPlan.accent }]}>TODAY'S TARGET FOCUS</Text>
                        <Text style={styles.focusTitleText}>{currentPlan.focus}</Text>
                    </View>
                </View>

                {currentPlan.exercises.length === 0 ? (
                    <View style={styles.restDayContainer}>
                        <Text style={styles.restEmoji}>🧘‍♂️</Text>
                        <Text style={styles.restTitle}>Scheduled Rest Day</Text>
                        <Text style={styles.restSubtitle}>Muscles grow when resting. Prioritize hydration and your nutritional profile targets today.</Text>
                    </View>
                ) : (
                    <Animated.View style={{ opacity: cardsFadeAnim, paddingHorizontal: 16, gap: 14 }}>
                        {currentPlan.exercises.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                activeOpacity={0.9}
                                onPress={() => selectExerciseCard(item)}
                                style={styles.exCard}
                            >
                                <View style={styles.imageCardContainer}>
                                    <Image
                                        source={getImageSource(item)!}
                                        style={styles.exCardImage}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View style={styles.exCardContent}>
                                    <Text style={styles.exCardName}>{item.name}</Text>
                                    <Text style={styles.exCardMachine} numberOfLines={1}>{item.machine}</Text>
                                    <View style={styles.setsRepsBadge}>
                                        <Text style={styles.setsRepsText}>{item.setsReps}</Text>
                                    </View>
                                    <Text style={[styles.clickPromptText, { color: currentPlan.accent }]}>Tap to see instructions ➔</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                )}
            </ScrollView>

            {/* INTERACTIVE INSTRUCTION EXPANSION MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheetContainer}>
                        {activeExercise && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.modalHeaderRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.modalTitle}>{activeExercise.name}</Text>
                                        <Text style={styles.modalSubtitle}>{activeExercise.machine}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.closeModalButton}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.closeButtonCrossText}>✕</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.modalHeroImageContainer}>
                                    <Image
                                        source={getImageSource(activeExercise)!}
                                        style={styles.modalHeroImage}
                                        resizeMode="contain"
                                    />
                                </View>

                                <Text style={styles.instructionsSectionHeader}>How to Execute Form Correctly</Text>

                                <View style={styles.instructionsListContainer}>
                                    {activeExercise.instructions.map((step, idx) => (
                                        <View key={idx} style={styles.stepRowItem}>
                                            <View style={[styles.stepNumberBadge, { backgroundColor: currentPlan.accent }]}>
                                                <Text style={styles.stepNumberText}>{idx + 1}</Text>
                                            </View>
                                            <Text style={styles.stepBodyText}>{step}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
    eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: '#94a3b8' },
    title: { fontSize: 24, fontWeight: '900', color: '#1e293b', marginTop: 2 },

    dayWrap: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    dayInner: { paddingHorizontal: 16, gap: 10 },
    dayChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', position: 'relative', minWidth: 55 },
    dayChipTxt: { fontSize: 11, fontWeight: '800', color: '#64748b' },
    dayChipTxtOn: { color: '#fff' },
    activeIndicatorDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff', marginTop: 4 },

    focusHeadlineBox: { margin: 16, padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 3, elevation: 1 },
    focusIcon: { fontSize: 28 },
    focusLabelText: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
    focusTitleText: { fontSize: 16, fontWeight: '900', color: '#1e293b', marginTop: 1 },

    exCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, alignItems: 'center', gap: 14 },
    imageCardContainer: { width: 95, height: 95, backgroundColor: '#ffffff', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
    exCardImage: { width: '100%', height: '100%' },
    exCardContent: { flex: 1, justifyContent: 'center' },
    exCardName: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
    exCardMachine: { fontSize: 12, color: '#64748b', marginTop: 2, fontWeight: '600' },
    setsRepsBadge: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 6 },
    setsRepsText: { fontSize: 11, fontWeight: '800', color: '#475569' },
    clickPromptText: { fontSize: 11, fontWeight: '700', marginTop: 8 },

    restDayContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
    restEmoji: { fontSize: 54 },
    restTitle: { fontSize: 18, fontWeight: '800', color: '#334155', marginTop: 12 },
    restSubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20, marginTop: 6 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
    modalSheetContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderColor: '#f1f5f9', paddingBottom: 14 },
    modalTitle: { fontSize: 18, fontWeight: '900', color: '#1e293b' },
    modalSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: '600' },
    closeModalButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    closeButtonCrossText: { fontSize: 12, fontWeight: '800', color: '#64748b' },
    modalHeroImageContainer: { width: '100%', height: 230, backgroundColor: '#ffffff', marginVertical: 16, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
    modalHeroImage: { width: '100%', height: '100%' },
    instructionsSectionHeader: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 14, letterSpacing: 0.3 },
    instructionsListContainer: { gap: 12, paddingBottom: 20 },
    stepRowItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    stepNumberBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
    stepNumberText: { fontSize: 11, fontWeight: '800', color: '#fff' },
    stepBodyText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 19, fontWeight: '500' }
});