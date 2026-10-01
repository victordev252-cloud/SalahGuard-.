import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  PrayerSettings,
  PrayerRecord,
  PrayerName,
  PrayerCompletionNote,
  PrayerMissedReason,
  DhikrRecord,
} from './types';
import {
  SalahGuardDatabase,
  DEFAULT_USER_PROFILE,
  DEFAULT_PRAYER_SETTINGS,
  generateInitialStreakHistory,
} from './data/database';
import { calculatePrayerTimes, getNextPrayer } from './utils/prayerEngine';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar, NavTab } from './components/AndroidNavBar';
import { HomeScreen } from './components/HomeScreen';
import { PrayersScreen } from './components/PrayersScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { DhikrScreen } from './components/DhikrScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { PrayerFocusMode } from './components/PrayerFocusMode';
import { QiblaModal } from './components/QiblaModal';
import { DebugSimulatorModal } from './components/DebugSimulatorModal';
import { AndroidCodeViewerModal } from './components/AndroidCodeViewerModal';
import { Smartphone, Monitor, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';
import { showSystemNotification } from './utils/notifications';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => SalahGuardDatabase.getUserProfile());
  const [settings, setSettings] = useState<PrayerSettings>(() => SalahGuardDatabase.getSettings());
  const [records, setRecords] = useState<PrayerRecord[]>(() => {
    const existing = SalahGuardDatabase.getPrayerRecords();
    if (existing.length === 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const initial = generateInitialStreakHistory(todayStr);
      SalahGuardDatabase.savePrayerRecords(initial.records);
      return initial.records;
    }
    return existing;
  });
  const [dhikrList, setDhikrList] = useState<DhikrRecord[]>(() => SalahGuardDatabase.getDhikrRecords());

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeFocusPrayer, setActiveFocusPrayer] = useState<PrayerName | null>(null);
  const [showQibla, setShowQibla] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showAndroidCode, setShowAndroidCode] = useState<boolean>(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  // Sync RTL and language on document element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = profile.language;
      document.documentElement.dir = profile.language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [profile.language]);

  // Save profile & settings on change
  useEffect(() => {
    SalahGuardDatabase.saveUserProfile(profile);
  }, [profile]);

  useEffect(() => {
    SalahGuardDatabase.saveSettings(settings);
  }, [settings]);

  // Today string
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Today's prayer records
  const todayRecords = useMemo(() => {
    return records.filter((r) => r.date === todayStr);
  }, [records, todayStr]);

  // Calculate current & longest streaks
  const { currentStreak, longestStreak } = useMemo(() => {
    return SalahGuardDatabase.calculateStreaks();
  }, [records]);

  // Astronomical prayer times calculation for today
  const prayerTimes = useMemo(() => {
    return calculatePrayerTimes(
      new Date(),
      profile.latitude,
      profile.longitude,
      profile.calculationMethod,
      profile.madhhab,
      profile.highLatitudeRule
    );
  }, [profile.latitude, profile.longitude, profile.calculationMethod, profile.madhhab, profile.highLatitudeRule]);

  // Next prayer
  const nextPrayer = useMemo(() => {
    return getNextPrayer(prayerTimes);
  }, [prayerTimes]);

  // Handlers for prayer confirmation and missed records
  const handleConfirmPrayed = (prayer: PrayerName, note?: PrayerCompletionNote, customNote?: string) => {
    const updated = [...records];
    const recId = `${todayStr}-${prayer}`;
    const idx = updated.findIndex((r) => r.id === recId || (r.date === todayStr && r.prayerName === prayer));

    const newRecord: PrayerRecord = {
      id: recId,
      date: todayStr,
      prayerName: prayer,
      scheduledTime: (prayerTimes as any)[prayer]
        ? new Date((prayerTimes as any)[prayer]).toTimeString().slice(0, 5)
        : '12:00',
      status: 'completed',
      completedAt: Date.now(),
      note,
      customNote,
      createdAt: Date.now(),
    };

    if (idx >= 0) {
      updated[idx] = newRecord;
    } else {
      updated.push(newRecord);
    }

    setRecords(updated);
    SalahGuardDatabase.savePrayerRecords(updated);
    setActiveFocusPrayer(null);
  };

  const handleMarkMissed = (prayer: PrayerName, reason?: PrayerMissedReason) => {
    const updated = [...records];
    const recId = `${todayStr}-${prayer}`;
    const idx = updated.findIndex((r) => r.id === recId || (r.date === todayStr && r.prayerName === prayer));

    const newRecord: PrayerRecord = {
      id: recId,
      date: todayStr,
      prayerName: prayer,
      scheduledTime: (prayerTimes as any)[prayer]
        ? new Date((prayerTimes as any)[prayer]).toTimeString().slice(0, 5)
        : '12:00',
      status: 'missed',
      missedReason: reason,
      createdAt: Date.now(),
    };

    if (idx >= 0) {
      updated[idx] = newRecord;
    } else {
      updated.push(newRecord);
    }

    setRecords(updated);
    SalahGuardDatabase.savePrayerRecords(updated);
    setActiveFocusPrayer(null);
  };

  const handleQuickTogglePrayer = (prayer: PrayerName) => {
    const rec = todayRecords.find((r) => r.prayerName === prayer);
    if (!rec || rec.status !== 'completed') {
      handleConfirmPrayed(prayer, 'on_time');
    } else {
      // Toggle back to pending
      const updated = records.filter((r) => !(r.date === todayStr && r.prayerName === prayer));
      setRecords(updated);
      SalahGuardDatabase.savePrayerRecords(updated);
    }
  };

  const handleRemindLater = (prayer: PrayerName) => {
    showSystemNotification(`⏰ REMINDER: ${prayer.toUpperCase()}`, {
      body: 'Your prayer is still waiting. Take a moment if you can.',
    });
    setActiveFocusPrayer(null);
  };

  const handleResetApp = () => {
    SalahGuardDatabase.clearAllData();
    setProfile(DEFAULT_USER_PROFILE);
    setSettings(DEFAULT_PRAYER_SETTINGS);
    setRecords([]);
    setDhikrList(SalahGuardDatabase.getDhikrRecords());
    setCurrentTab('home');
  };

  const handleSimulateStreakBroken = () => {
    // Mark yesterday as missed to simulate a broken streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];

    const updated = records.map((r) => {
      if (r.date === yStr && r.prayerName === 'asr') {
        return { ...r, status: 'missed' as const };
      }
      return r;
    });
    setRecords(updated);
    SalahGuardDatabase.savePrayerRecords(updated);
  };

  // If onboarding is not completed, show the 8-screen onboarding flow
  if (!profile.hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-[#060a12] text-slate-100 flex items-center justify-center p-2">
        <OnboardingFlow
          initialProfile={profile}
          onComplete={(updated) => {
            setProfile(updated);
            SalahGuardDatabase.saveUserProfile(updated);
          }}
        />
      </div>
    );
  }

  // Active Screen Renderer
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            userProfile={profile}
            settings={settings}
            prayerTimes={prayerTimes}
            nextPrayer={nextPrayer}
            todayRecords={todayRecords}
            currentStreak={currentStreak}
            onOpenFocusMode={(prayer) => setActiveFocusPrayer(prayer)}
            onQuickTogglePrayer={handleQuickTogglePrayer}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenQibla={() => setShowQibla(true)}
          />
        );
      case 'prayers':
        return (
          <PrayersScreen
            userProfile={profile}
            settings={settings}
            todayTimes={prayerTimes}
            todayRecords={todayRecords}
            onOpenFocusMode={(prayer) => setActiveFocusPrayer(prayer)}
            onQuickTogglePrayer={handleQuickTogglePrayer}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            userProfile={profile}
            allRecords={records}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />
        );
      case 'dhikr':
        return (
          <DhikrScreen
            userProfile={profile}
            dhikrRecords={dhikrList}
            onUpdateDhikr={(updated) => {
              setDhikrList(updated);
              SalahGuardDatabase.saveDhikrRecords(updated);
            }}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            userProfile={profile}
            settings={settings}
            onUpdateProfile={setProfile}
            onUpdateSettings={setSettings}
            onOpenDebug={() => setShowDebug(true)}
            onOpenAndroidCode={() => setShowAndroidCode(true)}
            onResetApp={handleResetApp}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col items-center justify-start md:py-6 md:px-4">
      {/* Top Device View Toggle Bar for Desktop Previewers */}
      <header className="hidden md:flex items-center justify-between w-full max-w-md mb-3 px-3 py-1.5 bg-[#0f1726]/80 backdrop-blur rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">SalahGuard — صلاتي أولاً</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAndroidCode(true)}
            className="px-2 py-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-md transition-colors"
          >
            Kotlin Code
          </button>
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={deviceFrameMode ? 'Expand to Full Viewport' : 'Show in Phone Bezel'}
          >
            {deviceFrameMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Android Device Shell Container */}
      <main
        className={`w-full max-w-md bg-[#0b111e] flex flex-col relative transition-all duration-300 overflow-hidden ${
          deviceFrameMode
            ? 'md:rounded-[38px] md:border-[7px] md:border-[#182234] md:shadow-2xl md:shadow-black/90 md:min-h-[840px] md:max-h-[92vh]'
            : 'min-h-screen'
        }`}
      >
        {/* Android Punch-hole Camera Cutout */}
        {deviceFrameMode && (
          <div className="hidden md:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-50 w-4 h-4 bg-black rounded-full border border-slate-800 items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#111927]" />
          </div>
        )}

        {/* Android Status Bar */}
        <AndroidStatusBar isFocusMode={activeFocusPrayer !== null} />

        {/* Screen Viewport with smooth scroll */}
        <div className="flex-1 flex flex-col overflow-y-auto relative">
          {renderTabContent()}
        </div>

        {/* Material 3 Bottom Navigation Bar */}
        <AndroidNavBar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          language={profile.language}
        />

        {/* Prayer Focus Mode (Full-Screen Overlay) */}
        {activeFocusPrayer && (
          <PrayerFocusMode
            prayer={activeFocusPrayer}
            scheduledTime={
              (prayerTimes as any)[activeFocusPrayer]
                ? new Date((prayerTimes as any)[activeFocusPrayer]).toTimeString().slice(0, 5)
                : '18:42'
            }
            userProfile={profile}
            settings={settings}
            todaysCompletedCount={todayRecords.filter((r) => r.status === 'completed').length}
            currentStreak={currentStreak}
            onConfirmPrayed={handleConfirmPrayed}
            onMarkMissed={handleMarkMissed}
            onRemindLater={handleRemindLater}
            onClose={() => setActiveFocusPrayer(null)}
          />
        )}

        {/* Qibla Modal */}
        {showQibla && (
          <QiblaModal
            userProfile={profile}
            onClose={() => setShowQibla(false)}
          />
        )}

        {/* Debug Simulator Modal */}
        {showDebug && (
          <DebugSimulatorModal
            userProfile={profile}
            prayerTimes={prayerTimes}
            onSimulatePrayer={(prayer) => {
              setActiveFocusPrayer(prayer);
              setShowDebug(false);
            }}
            onSimulateStreakBroken={handleSimulateStreakBroken}
            onResetDatabase={handleResetApp}
            onClose={() => setShowDebug(false)}
          />
        )}

        {/* Android Native Kotlin Code Viewer */}
        {showAndroidCode && (
          <AndroidCodeViewerModal onClose={() => setShowAndroidCode(false)} />
        )}
      </main>
    </div>
  );
}
