import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './ExistingMember_Screens/LoginScreen';
import HomeScreen from './ExistingMember_Screens/HomeScreen';
import GymInfoScreen from './NewMember_Screens/GymInfoScreen';
import MachineryScreen from './NewMember_Screens/MachineryScreen';
import PlansScreen from './NewMember_Screens/PlansScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────
export type AuthScreen = 'welcome' | 'login';
export type AppScreen = 'auth' | 'home' | 'newmember';
export type MainTab = 'gyminfo' | 'machinery' | 'plans';

const TAB_ORDER: MainTab[] = ['gyminfo', 'machinery', 'plans'];

const TABS: { key: MainTab; label: string; icon: string; activeIcon: string }[] = [
  { key: 'gyminfo', label: 'About', icon: '🏛️', activeIcon: '🏋️' },
  { key: 'machinery', label: 'Equipment', icon: '⚙️', activeIcon: '🏗️' },
  { key: 'plans', label: 'Plans', icon: '📋', activeIcon: '⭐' },
];

// ─── Animated Tab Screen ──────────────────────────────────────────────────────
function AnimatedTabScreen({
  isActive,
  direction,
  children,
}: {
  isActive: boolean;
  direction: 'left' | 'right' | 'none';
  children: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const translateX = useRef(new Animated.Value(isActive ? 0 : SCREEN_WIDTH)).current;
  const scale = useRef(new Animated.Value(isActive ? 1 : 0.96)).current;

  useEffect(() => {
    if (isActive) {
      translateX.setValue(
        direction === 'right' ? SCREEN_WIDTH * 0.22
          : direction === 'left' ? -SCREEN_WIDTH * 0.22
            : 0
      );
      scale.setValue(0.95);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateX, { toValue: 0, speed: 16, bounciness: 5, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, speed: 18, bounciness: 4, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateX, {
          toValue: direction === 'right' ? -SCREEN_WIDTH * 0.12 : SCREEN_WIDTH * 0.12,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, { toValue: 0.95, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [isActive]);

  return (
    <Animated.View
      pointerEvents={isActive ? 'auto' : 'none'}
      style={[
        StyleSheet.absoluteFillObject,
        { opacity, transform: [{ translateX }, { scale }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// ─── Bottom Nav Bar ───────────────────────────────────────────────────────────
function BottomNav({
  activeTab,
  onTabPress,
}: {
  activeTab: MainTab;
  onTabPress: (tab: MainTab) => void;
}) {
  const insets = useSafeAreaInsets();
  const activeIndex = TAB_ORDER.indexOf(activeTab);
  const tabWidth = SCREEN_WIDTH / TABS.length;

  const pillAnim = useRef(new Animated.Value(activeIndex * tabWidth)).current;
  const iconScales = useRef(TABS.map((_, i) => new Animated.Value(i === activeIndex ? 1.18 : 1))).current;
  const labelOpacities = useRef(TABS.map((_, i) => new Animated.Value(i === activeIndex ? 1 : 0.45))).current;
  const dotScales = useRef(TABS.map((_, i) => new Animated.Value(i === activeIndex ? 1 : 0))).current;

  useEffect(() => {
    const newIndex = TAB_ORDER.indexOf(activeTab);

    Animated.spring(pillAnim, { toValue: newIndex * tabWidth, speed: 22, bounciness: 9, useNativeDriver: true }).start();

    TABS.forEach((_, i) => {
      const isNew = i === newIndex;
      if (isNew) {
        Animated.sequence([
          Animated.timing(iconScales[i], { toValue: 1.4, duration: 110, useNativeDriver: true }),
          Animated.spring(iconScales[i], { toValue: 1.18, speed: 22, bounciness: 7, useNativeDriver: true }),
        ]).start();
      } else {
        Animated.timing(iconScales[i], { toValue: 1, duration: 180, useNativeDriver: true }).start();
      }
      Animated.timing(labelOpacities[i], { toValue: isNew ? 1 : 0.45, duration: 200, useNativeDriver: true }).start();
      Animated.spring(dotScales[i], { toValue: isNew ? 1 : 0, speed: 24, bounciness: 10, useNativeDriver: true }).start();
    });
  }, [activeTab]);

  return (
    <View style={[styles.navBar, { paddingBottom: insets.bottom + 4 }]}>
      <View style={styles.navTopBorder} />
      <Animated.View
        style={[
          styles.navSlidingPill,
          { width: tabWidth - 20, transform: [{ translateX: Animated.add(pillAnim, new Animated.Value(10)) }] },
        ]}
      />
      <View style={styles.navInner}>
        {TABS.map((tab, i) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.navTab} onPress={() => onTabPress(tab.key)} activeOpacity={0.75}>
              <Animated.View style={[styles.navDot, { transform: [{ scaleX: dotScales[i] }, { scaleY: dotScales[i] }] }]} />
              <Animated.Text style={[styles.navIcon, { transform: [{ scale: iconScales[i] }] }]}>
                {isActive ? tab.activeIcon : tab.icon}
              </Animated.Text>
              <Animated.Text style={[styles.navLabel, isActive && styles.navLabelActive, { opacity: labelOpacities[i] }]}>
                {tab.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── New Member App (tabbed) ──────────────────────────────────────────────────
function NewMemberApp({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<MainTab>('gyminfo');
  const [prevTab, setPrevTab] = useState<MainTab>('gyminfo');

  const handleTabPress = (tab: MainTab) => {
    if (tab === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const getDirection = (tab: MainTab): 'left' | 'right' | 'none' => {
    const curr = TAB_ORDER.indexOf(activeTab);
    const prev = TAB_ORDER.indexOf(prevTab);
    const self = TAB_ORDER.indexOf(tab);
    if (tab === activeTab) return curr > prev ? 'right' : 'left';
    return self < curr ? 'left' : 'right';
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.screenArea}>
        <AnimatedTabScreen isActive={activeTab === 'gyminfo'} direction={getDirection('gyminfo')}>
          <GymInfoScreen onBack={onLogout} onNext={() => handleTabPress('machinery')} />
        </AnimatedTabScreen>
        <AnimatedTabScreen isActive={activeTab === 'machinery'} direction={getDirection('machinery')}>
          <MachineryScreen onBack={() => handleTabPress('gyminfo')} onNext={() => handleTabPress('plans')} />
        </AnimatedTabScreen>
        <AnimatedTabScreen isActive={activeTab === 'plans'} direction={getDirection('plans')}>
          <PlansScreen onBack={() => handleTabPress('machinery')} onJoin={() => handleTabPress('gyminfo')} />
        </AnimatedTabScreen>
      </View>
      <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function RootApp() {
  const [appScreen, setAppScreen] = useState<AppScreen>('auth');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');

  // Auth flow
  if (appScreen === 'auth') {
    if (authScreen === 'welcome') {
      return (
        <WelcomeScreen
          onNewMember={() => setAppScreen('newmember')}
          onExistingMember={() => setAuthScreen('login')}
        />
      );
    }
    // authScreen === 'login'
    return (
      <LoginScreen
        onBack={() => setAuthScreen('welcome')}
        onSuccess={() => setAppScreen('home')}  // ← goes to HomeScreen
      />
    );
  }

  // Existing member dashboard
  if (appScreen === 'home') {
    return (
      <HomeScreen
        onLogout={() => {
          setAuthScreen('welcome');
          setAppScreen('auth');
        }}
      />
    );
  }

  // New member tabbed flow
  return (
    <NewMemberApp
      onLogout={() => {
        setAuthScreen('welcome');
        setAppScreen('auth');
      }}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <RootApp />
    </SafeAreaProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff8f3',
  },
  screenArea: {
    flex: 1,
    position: 'relative',
  },
  navBar: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 18,
  },
  navTopBorder: {
    height: 1,
    backgroundColor: '#e2bfb9',
    opacity: 0.45,
  },
  navSlidingPill: {
    position: 'absolute',
    top: 7,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#fff0eb',
    zIndex: 0,
  },
  navInner: {
    flexDirection: 'row',
    paddingTop: 6,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
    position: 'relative',
    zIndex: 1,
  },
  navDot: {
    position: 'absolute',
    top: -6,
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#800000',
  },
  navIcon: {
    fontSize: 22,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  navLabelActive: {
    color: '#800000',
    fontWeight: '800',
  },
});