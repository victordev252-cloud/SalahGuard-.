import React, { useState, useEffect } from 'react';
import {
  Flame,
  Check,
  Circle,
  Clock,
  Volume2,
  Calendar,
  Compass,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import {
  UserProfile,
  CalculatedPrayerTimes,
  NextPrayerInfo,
  PrayerRecord,
  PrayerName,
  PrayerSettings,
} from '../types';
import { getTranslation, formatPrayerName } from '../utils/i18n';
import { formatTime, formatRemainingTime } from '../utils/prayerEngine';

interface HomeScreenProps {
  userProfile: UserProfile;
  settings: PrayerSettings;
  prayerTimes: CalculatedPrayerTimes;
  nextPrayer: NextPrayerInfo;
  todayRecords: PrayerRecord[];
  currentStreak: number;
  onOpenFocusMode: (prayer: PrayerName) => void;
  onQuickTogglePrayer: (prayer: PrayerName) => void;
  onNavigateTab: (tab: 'prayers' | 'history' | 'dhikr' | 'settings') => void;
  onOpenQibla: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  settings,
  prayerTimes,
  nextPrayer,
  todayRecords,
  currentStreak,
  onOpenFocusMode,
  onQuickTogglePrayer,
  onNavigateTab,
  onOpenQibla,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(nextPrayer.timeRemainingSeconds);
  const t = getTranslation(userProfile.language);

  // Live timer tick
  useEffect(() => {
    setSecondsRemaining(nextPrayer.timeRemainingSeconds);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer.timeRemainingSeconds]);

  // Greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return t.goodMorning;
    if (hour >= 12 && hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  // Gregorian date formatted (e.g. Thursday, October 1)
  const gregorianDateStr = new Intl.DateTimeFormat(
    userProfile.language === 'ar' ? 'ar-SA' : userProfile.language === 'so' ? 'so-SO' : 'en-US',
    { weekday: 'long', month: 'long', day: 'numeric' }
  ).format(new Date());

  // Hijri date string
  const hijriStr =
    userProfile.language === 'ar'
      ? `${prayerTimes.hijriDate.day} ${prayerTimes.hijriDate.monthArabic} ${prayerTimes.hijriDate.year} هـ`
      : userProfile.language === 'so'
      ? `${prayerTimes.hijriDate.day} ${prayerTimes.hijriDate.monthSomali} ${prayerTimes.hijriDate.year} H`
      : `${prayerTimes.hijriDate.day} ${prayerTimes.hijriDate.month} ${prayerTimes.hijriDate.year} AH`;

  // 5 prayers list
  const prayerList: { name: PrayerName; time: Date }[] = [
    { name: 'fajr', time: prayerTimes.fajr },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'isha', time: prayerTimes.isha },
  ];

  // Count completed
  const completedCount = prayerList.filter((p) => {
    const rec = todayRecords.find((r) => r.prayerName === p.name);
    return rec?.status === 'completed';
  }).length;

  const allFiveCompleted = completedCount >= 5;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-5 max-w-md mx-auto w-full select-none pb-24">
      {/* Top Header: Greeting, Dates */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              {t.assalamuAlaikum}
              {userProfile.name ? `, ${userProfile.name}` : ''}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{getGreeting()}</p>
        </div>

        {/* Gregorian & Hijri Date Header */}
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-200">{gregorianDateStr}</div>
          <div className="text-[11px] font-serif text-amber-300/90">{hijriStr}</div>
        </div>
      </div>

      {/* Hero Section: All Done State OR Next Prayer Hero */}
      {allFiveCompleted ? (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#142338] to-[#0e1726] border border-amber-500/30 shadow-xl shadow-black/40 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 mx-auto mb-3">
            <span className="text-2xl">🌙</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {t.allPrayersCompletedTitle}
          </h2>
          <p className="text-xs text-slate-300 mb-4 font-normal">
            {t.allPrayersCompletedDesc}
          </p>

          <div className="inline-flex items-center gap-3 py-1.5 px-4 bg-[#0a101c] rounded-full border border-slate-800 text-xs mb-3">
            <span className="text-emerald-400 font-bold font-mono">5 / 5</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {currentStreak} {t.currentStreak}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            {t.allDoneNextTomorrow.replace('{time}', formatTime(prayerTimes.fajr, userProfile.timeFormat12h))}
          </div>
        </div>
      ) : (
        /* Standard Next Prayer Hero */
        <div className="p-5 rounded-2xl bg-[#111928] border border-slate-800/90 shadow-xl shadow-black/40 relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono tracking-wider text-amber-400 uppercase font-semibold">
              {t.nextPrayer}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              {userProfile.city}
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                {formatPrayerName(nextPrayer.name, userProfile.language)}
              </h2>
              <div className="text-lg font-mono font-medium text-slate-300">
                {formatTime(nextPrayer.time, userProfile.timeFormat12h)}
              </div>
            </div>

            {/* Remaining Countdown Box */}
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono tracking-wide text-slate-500">
                {t.remaining}
              </div>
              <div className="text-2xl font-mono font-bold text-amber-300 tracking-wider">
                {formatRemainingTime(secondsRemaining)}
              </div>
            </div>
          </div>

          {/* Quick Enter Focus Mode Action */}
          <button
            onClick={() => onOpenFocusMode(nextPrayer.name)}
            className="w-full py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>{t.focusMode}</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}

      {/* Today's 5 Prayers List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.navPrayers}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {userProfile.calculationMethod} · {userProfile.madhhab === 'HANAFI' ? 'Hanafi' : 'Standard'}
          </span>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden">
          {prayerList.map((item) => {
            const record = todayRecords.find((r) => r.prayerName === item.name);
            const isCompleted = record?.status === 'completed';
            const isMissed = record?.status === 'missed';
            const isNext = nextPrayer.name === item.name && !isCompleted;

            return (
              <div
                key={item.name}
                onClick={() => onOpenFocusMode(item.name)}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                  isNext
                    ? 'bg-amber-500/5'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Status Indicator Icon Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickTogglePrayer(item.name);
                    }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isMissed
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : isNext
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'border border-slate-700 text-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : isMissed ? (
                      <span className="text-xs font-bold">×</span>
                    ) : isNext ? (
                      <span className="text-[9px] font-bold font-mono">NEXT</span>
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isNext ? 'text-amber-200' : 'text-slate-200'}`}>
                        {formatPrayerName(item.name, userProfile.language)}
                      </span>
                      {settings.adhanEnabled && (
                        <Volume2 className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                    {record?.note && (
                      <span className="text-[10px] text-slate-500">
                        {record.note.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-medium ${isNext ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                    {formatTime(item.time, userProfile.timeFormat12h)}
                  </span>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : isMissed
                        ? 'bg-rose-500/10 text-rose-300'
                        : isNext
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {isCompleted ? t.completedTag : isMissed ? t.missedTag : isNext ? 'NEXT' : '○'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Progress Bar */}
      <div className="p-4 bg-[#101726] border border-slate-800 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">{t.todaysProgress}</span>
          <span className="font-mono font-bold text-slate-200">
            {completedCount} / 5 prayers
          </span>
        </div>

        {/* Clean Material 3 progress bar */}
        <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Streak Card */}
      <div className="p-4 bg-[#101726] border border-slate-800 rounded-2xl flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-0.5">
            {t.currentStreak}
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{currentStreak} {t.currentStreak}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{t.streakKeepGoing}</p>
        </div>

        <button
          onClick={() => onNavigateTab('history')}
          className="p-2.5 rounded-xl bg-[#142238] border border-slate-800 text-amber-300 hover:text-amber-200 transition-colors"
          title={t.prayerHistory}
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Actions (Qibla, Dhikr, History, Focus) */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <button
          onClick={onOpenQibla}
          className="p-3 bg-[#101726] hover:bg-[#142033] border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
        >
          <Compass className="w-5 h-5 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">{t.qiblaCompass}</span>
        </button>

        <button
          onClick={() => onNavigateTab('dhikr')}
          className="p-3 bg-[#101726] hover:bg-[#142033] border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
        >
          <Sparkles className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">{t.dhikrCounter}</span>
        </button>

        <button
          onClick={() => onNavigateTab('history')}
          className="p-3 bg-[#101726] hover:bg-[#142033] border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
        >
          <Calendar className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">{t.prayerHistory}</span>
        </button>
      </div>
    </div>
  );
};
