import React from 'react';
import { Bug, X, Bell, Volume2, ShieldCheck, Flame, RotateCcw } from 'lucide-react';
import { PrayerName, UserProfile, CalculatedPrayerTimes } from '../types';
import { getTranslation, formatPrayerName } from '../utils/i18n';
import { showSystemNotification } from '../utils/notifications';
import { formatTime } from '../utils/prayerEngine';

interface DebugSimulatorModalProps {
  userProfile: UserProfile;
  prayerTimes: CalculatedPrayerTimes;
  onSimulatePrayer: (prayer: PrayerName) => void;
  onSimulateStreakBroken: () => void;
  onResetDatabase: () => void;
  onClose: () => void;
}

export const DebugSimulatorModal: React.FC<DebugSimulatorModalProps> = ({
  userProfile,
  prayerTimes,
  onSimulatePrayer,
  onSimulateStreakBroken,
  onResetDatabase,
  onClose,
}) => {
  const t = getTranslation(userProfile.language);

  const testTrigger = (prayer: PrayerName) => {
    showSystemNotification(`🕌 ${formatPrayerName(prayer, userProfile.language).toUpperCase()} TIME`, {
      body: 'Prayer time has begun. Pause distractions and enter Focus Mode.',
    });
    onSimulatePrayer(prayer);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060a12]/95 backdrop-blur-md text-slate-100 flex flex-col justify-between p-6 select-none overflow-y-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-mono">
            <Bug className="w-5 h-5 text-amber-400" />
            <span>Developer Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Android Testing & Validation Console
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-400 hover:text-slate-200 bg-[#101726] border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Simulator Controls */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-6 space-y-4">
        <div className="p-3.5 bg-[#0f1726] border border-slate-800 rounded-2xl text-xs space-y-1">
          <span className="font-semibold text-slate-200 block">Test Real-Time Alarm & Focus Mode:</span>
          <p className="text-slate-400 text-[11px]">
            Tapping any prayer will instantly invoke Android-equivalent heads-up alert, play synthesized adhan, and transition into Prayer Focus Mode.
          </p>
        </div>

        <div className="space-y-2">
          {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerName[]).map((prayer) => (
            <button
              key={prayer}
              onClick={() => testTrigger(prayer)}
              className="w-full py-3 px-4 bg-[#142033] hover:bg-[#1b2b45] border border-slate-800 rounded-xl text-xs font-semibold text-amber-200 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="capitalize">Simulate {formatPrayerName(prayer, userProfile.language)}</span>
              </div>
              <span className="font-mono text-slate-400">
                {formatTime((prayerTimes as any)[prayer], userProfile.timeFormat12h)}
              </span>
            </button>
          ))}
        </div>

        <div className="pt-2 space-y-2">
          <button
            onClick={onSimulateStreakBroken}
            className="w-full py-2.5 px-4 bg-[#1b1928] hover:bg-[#252037] border border-slate-800 text-rose-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Flame className="w-4 h-4" />
            <span>Simulate Broken Streak (Streak Reset to 0)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset database to clean fresh state?')) {
                onResetDatabase();
                onClose();
              }
            }}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Database</span>
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-500 font-mono">
        SalahGuard · Android Foreground Alarm Simulator
      </div>
    </div>
  );
};
