import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// ─────────────────────────────────────────────────────────────
// IMPORT SCREENS
// ─────────────────────────────────────────────────────────────

import WelcomeScreen from './WelcomeScreen';

import LoginScreen from './ExistingMember_Screens/LoginScreen';
import HomeScreen from './ExistingMember_Screens/HomeScreen';
import DietScreen from './ExistingMember_Screens/DietScreen';
import WorkoutScreen from './ExistingMember_Screens/WorkoutScreen'; // Added Workout Screen Import

import GymInfoScreen from './NewMember_Screens/GymInfoScreen';
import MachineryScreen from './NewMember_Screens/MachineryScreen';
import PlansScreen from './NewMember_Screens/PlansScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type AuthScreen = 'welcome' | 'login';

export type AppScreen =
  | 'auth'
  | 'home'
  | 'newmember';

export type NewMemberTab =
  | 'gyminfo'
  | 'machinery'
  | 'plans';

export type ExistingTab =
  | 'dashboard'
  | 'diet'
  | 'workout'; // Added workout tab literal type

// ─────────────────────────────────────────────────────────────
// ANIMATED TAB SCREEN
// ─────────────────────────────────────────────────────────────

function AnimatedTabScreen({
  isActive,
  direction,
  children,
}: {
  isActive: boolean;
  direction: 'left' | 'right' | 'none';
  children: React.ReactNode;
}) {
  const opacity = useRef(
    new Animated.Value(isActive ? 1 : 0)
  ).current;

  const translateX = useRef(
    new Animated.Value(isActive ? 0 : SCREEN_WIDTH)
  ).current;

  const scale = useRef(
    new Animated.Value(isActive ? 1 : 0.96)
  ).current;

  useEffect(() => {
    if (isActive) {
      translateX.setValue(
        direction === 'right'
          ? SCREEN_WIDTH * 0.22
          : direction === 'left'
            ? -SCREEN_WIDTH * 0.22
            : 0
      );

      scale.setValue(0.95);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),

        Animated.spring(translateX, {
          toValue: 0,
          speed: 16,
          bounciness: 5,
          useNativeDriver: true,
        }),

        Animated.spring(scale, {
          toValue: 1,
          speed: 18,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),

        Animated.timing(translateX, {
          toValue:
            direction === 'right'
              ? -SCREEN_WIDTH * 0.12
              : SCREEN_WIDTH * 0.12,

          duration: 200,
          useNativeDriver: true,
        }),

        Animated.timing(scale, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  return (
    <Animated.View
      pointerEvents={isActive ? 'auto' : 'none'}
      style={[
        StyleSheet.absoluteFillObject,
        {
          opacity,
          transform: [{ translateX }, { scale }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB TYPES
// ─────────────────────────────────────────────────────────────

type TabDef = {
  key: string;
  label: string;
  icon: string;
  activeIcon: string;
  accent: string;
};

// ─────────────────────────────────────────────────────────────
// BOTTOM NAVIGATION
// ─────────────────────────────────────────────────────────────

function BottomNav({
  tabs,
  tabOrder,
  activeTab,
  onTabPress,
}: {
  tabs: TabDef[];
  tabOrder: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
}) {
  const insets = useSafeAreaInsets();

  const activeIndex = tabOrder.indexOf(activeTab);
  const tabWidth = SCREEN_WIDTH / tabs.length;

  const pillAnim = useRef(
    new Animated.Value(activeIndex * tabWidth)
  ).current;

  const iconScales = useRef(
    tabs.map((_, i) =>
      new Animated.Value(i === activeIndex ? 1.18 : 1)
    )
  ).current;

  const labelOpacities = useRef(
    tabs.map((_, i) =>
      new Animated.Value(i === activeIndex ? 1 : 0.45)
    )
  ).current;

  const dotScales = useRef(
    tabs.map((_, i) =>
      new Animated.Value(i === activeIndex ? 1 : 0)
    )
  ).current;

  useEffect(() => {
    const newIndex = tabOrder.indexOf(activeTab);

    Animated.spring(pillAnim, {
      toValue: newIndex * tabWidth,
      speed: 22,
      bounciness: 9,
      useNativeDriver: true,
    }).start();

    tabs.forEach((_, i) => {
      const isNew = i === newIndex;

      Animated.timing(iconScales[i], {
        toValue: isNew ? 1.18 : 1,
        duration: 180,
        useNativeDriver: true,
      }).start();

      Animated.timing(labelOpacities[i], {
        toValue: isNew ? 1 : 0.45,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.spring(dotScales[i], {
        toValue: isNew ? 1 : 0,
        speed: 24,
        bounciness: 10,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab]);

  return (
    <View
      style={[
        navStyles.navBar,
        { paddingBottom: insets.bottom + 4 },
      ]}
    >
      <View style={navStyles.navTopBorder} />

      <Animated.View
        style={[
          navStyles.navSlidingPill,
          {
            width: tabWidth - 16,
            transform: [
              {
                translateX: Animated.add(
                  pillAnim,
                  new Animated.Value(8)
                ),
              },
            ],
          },
        ]}
      />

      <View style={navStyles.navInner}>
        {tabs.map((tab, i) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={navStyles.navTab}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.75}
            >
              <Animated.View
                style={[
                  navStyles.navDot,
                  { backgroundColor: tab.accent },
                  {
                    transform: [
                      { scaleX: dotScales[i] },
                      { scaleY: dotScales[i] },
                    ],
                  },
                ]}
              />

              <Animated.Text
                style={[
                  navStyles.navIcon,
                  {
                    transform: [{ scale: iconScales[i] }],
                  },
                ]}
              >
                {isActive
                  ? tab.activeIcon
                  : tab.icon}
              </Animated.Text>

              <Animated.Text
                style={[
                  navStyles.navLabel,
                  isActive && {
                    color: tab.accent,
                    fontWeight: '800',
                    borderColor: 'transparent',
                  },
                  {
                    opacity: labelOpacities[i],
                  },
                ]}
              >
                {tab.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// EXISTING MEMBER APP
// ─────────────────────────────────────────────────────────────

const EXISTING_TABS: TabDef[] = [
  {
    key: 'dashboard',
    label: 'Home',
    icon: '🏠',
    activeIcon: '🏡',
    accent: '#800000',
  },
  {
    key: 'diet',
    label: 'Diet',
    icon: '🥗',
    activeIcon: '🍱',
    accent: '#1a6b3c',
  },
  {
    key: 'workout',
    label: 'Workout',
    icon: '🏋️‍♂️',
    activeIcon: '💪',
    accent: '#3b82f6', // Sports blue theme accent matched to workout configs
  },
];

const EXISTING_ORDER = [
  'dashboard',
  'diet',
  'workout',
];

function ExistingMemberApp({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] =
    useState<ExistingTab>('dashboard');

  const handleTabPress = (tab: string) => {
    if (tab === activeTab) return;

    setActiveTab(tab as ExistingTab);
  };

  const getDir = (
    tab: string
  ): 'left' | 'right' | 'none' => {
    const curr = EXISTING_ORDER.indexOf(activeTab);
    const self = EXISTING_ORDER.indexOf(tab);

    if (tab === activeTab) return 'none';

    return self < curr ? 'left' : 'right';
  };

  return (
    <View style={appStyles.appContainer}>
      <View style={appStyles.screenArea}>
        <AnimatedTabScreen
          isActive={activeTab === 'dashboard'}
          direction={getDir('dashboard')}
        >
          <HomeScreen onLogout={onLogout} />
        </AnimatedTabScreen>

        <AnimatedTabScreen
          isActive={activeTab === 'diet'}
          direction={getDir('diet')}
        >
          <DietScreen
            onBack={() =>
              handleTabPress('dashboard')
            }
          />
        </AnimatedTabScreen>

        {/* Added Layout Layer for Workout Execution Tab */}
        <AnimatedTabScreen
          isActive={activeTab === 'workout'}
          direction={getDir('workout')}
        >
          <WorkoutScreen />
        </AnimatedTabScreen>
      </View>

      <BottomNav
        tabs={EXISTING_TABS}
        tabOrder={EXISTING_ORDER}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// NEW MEMBER APP
// ─────────────────────────────────────────────────────────────

const NEW_TABS: TabDef[] = [
  {
    key: 'gyminfo',
    label: 'About',
    icon: '🏛️',
    activeIcon: '🏋️',
    accent: '#800000',
  },

  {
    key: 'machinery',
    label: 'Equipment',
    icon: '⚙️',
    activeIcon: '🏗️',
    accent: '#800000',
  },

  {
    key: 'plans',
    label: 'Plans',
    icon: '📋',
    activeIcon: '⭐',
    accent: '#800000',
  },
];

const NEW_ORDER: NewMemberTab[] = [
  'gyminfo',
  'machinery',
  'plans',
];

function NewMemberApp({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] =
    useState<NewMemberTab>('gyminfo');

  const handleTabPress = (
    tab: NewMemberTab
  ) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
  };

  const getDir = (
    tab: string
  ): 'left' | 'right' | 'none' => {
    const curr = NEW_ORDER.indexOf(activeTab);

    const self = NEW_ORDER.indexOf(
      tab as NewMemberTab
    );

    if (tab === activeTab) return 'none';

    return self < curr ? 'left' : 'right';
  };

  return (
    <View style={appStyles.appContainer}>
      <View style={appStyles.screenArea}>
        <AnimatedTabScreen
          isActive={activeTab === 'gyminfo'}
          direction={getDir('gyminfo')}
        >
          <GymInfoScreen
            onBack={onLogout}
            onNext={() =>
              handleTabPress('machinery')
            }
          />
        </AnimatedTabScreen>

        <AnimatedTabScreen
          isActive={activeTab === 'machinery'}
          direction={getDir('machinery')}
        >
          <MachineryScreen
            onBack={() =>
              handleTabPress('gyminfo')
            }
            onNext={() =>
              handleTabPress('plans')
            }
          />
        </AnimatedTabScreen>

        <AnimatedTabScreen
          isActive={activeTab === 'plans'}
          direction={getDir('plans')}
        >
          <PlansScreen
            onBack={() =>
              handleTabPress('machinery')
            }
            onJoin={() =>
              handleTabPress('gyminfo')
            }
          />
        </AnimatedTabScreen>
      </View>

      <BottomNav
        tabs={NEW_TABS}
        tabOrder={NEW_ORDER}
        activeTab={activeTab}
        onTabPress={(t) =>
          handleTabPress(t as NewMemberTab)
        }
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────

function RootApp() {
  const [appScreen, setAppScreen] =
    useState<AppScreen>('auth');

  const [authScreen, setAuthScreen] =
    useState<AuthScreen>('welcome');

  if (appScreen === 'auth') {
    if (authScreen === 'welcome') {
      return (
        <WelcomeScreen
          onNewMember={() =>
            setAppScreen('newmember')
          }
          onExistingMember={() =>
            setAuthScreen('login')
          }
        />
      );
    }

    return (
      <LoginScreen
        onBack={() =>
          setAuthScreen('welcome')
        }
        onSuccess={() =>
          setAppScreen('home')
        }
      />
    );
  }

  if (appScreen === 'home') {
    return (
      <ExistingMemberApp
        onLogout={() => {
          setAuthScreen('welcome');
          setAppScreen('auth');
        }}
      />
    );
  }

  return (
    <NewMemberApp
      onLogout={() => {
        setAuthScreen('welcome');
        setAppScreen('auth');
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────

export default function App() {
  return (
    <SafeAreaProvider>
      <RootApp />
    </SafeAreaProvider>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const appStyles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff8f3',
  },

  screenArea: {
    flex: 1,
    position: 'relative',
  },
});

const navStyles = StyleSheet.create({
  navBar: {
    backgroundColor: '#ffffff',
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
});