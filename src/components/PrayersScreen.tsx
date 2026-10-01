import React, { useState } from 'react';
import { Clock, Sun, Moon, Volume2, Check, Circle, AlertCircle, ChevronRight } from 'lucide-react';
import { UserProfile, CalculatedPrayerTimes, PrayerRecord, PrayerName, PrayerSettings } from '../types';
import { getTranslation, formatPrayerName } from '../utils/i18n';
import { formatTime, calculatePrayerTimes } from '../utils/prayerEngine';

interface PrayersScreenProps {
  userProfile: UserProfile;
  settings: PrayerSettings;
  todayTimes: CalculatedPrayerTimes;
  todayRecords: PrayerRecord[];
  onOpenFocusMode: (prayer: PrayerName) => void;
  onQuickTogglePrayer: (prayer: PrayerName) => void;
}

export const PrayersScreen: React.FC<PrayersScreenProps> = ({
  userProfile,
  settings,
  todayTimes,
  todayRecords,
  onOpenFocusMode,
  onQuickTogglePrayer,
}) => {
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const t = getTranslation(userProfile.language);

  // Compute tomorrow's prayer times
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = calculatePrayerTimes(
    tomorrow,
    userProfile.latitude,
    userProfile.longitude,
    userProfile.calculationMethod,
    userProfile.madhhab,
    userProfile.highLatitudeRule
  );

  const activeTimes = selectedDay === 'today' ? todayTimes : tomorrowTimes;

  const prayers: { name: PrayerName; time: Date; isObligatory: boolean }[] = [
    { name: 'fajr', time: activeTimes.fajr, isObligatory: true },
    { name: 'sunrise', time: activeTimes.sunrise, isObligatory: false },
    { name: 'dhuhr', time: activeTimes.dhuhr, isObligatory: true },
    { name: 'asr', time: activeTimes.asr, isObligatory: true },
    { name: 'maghrib', time: activeTimes.maghrib, isObligatory: true },
    { name: 'isha', time: activeTimes.isha, isObligatory: true },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-5 max-w-md mx-auto w-full select-none pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.navPrayers}
          </h1>
          <p className="text-xs text-slate-400">
            {userProfile.city} · {userProfile.calculationMethod}
          </p>
        </div>

        {/* Today / Tomorrow Switcher */}
        <div className="flex items-center p-1 bg-[#121c2d] rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedDay('today')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedDay === 'today'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.today}
          </button>
          <button
            onClick={() => setSelectedDay('tomorrow')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedDay === 'tomorrow'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.tomorrow}
          </button>
        </div>
      </div>

      {/* Prayers List */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden">
        {prayers.map((item) => {
          const record = selectedDay === 'today' ? todayRecords.find((r) => r.prayerName === item.name) : undefined;
          const isCompleted = record?.status === 'completed';
          const isMissed = record?.status === 'missed';

          return (
            <div
              key={item.name}
              onClick={() => item.isObligatory && onOpenFocusMode(item.name)}
              className={`p-4 flex items-center justify-between transition-colors ${
                item.isObligatory ? 'cursor-pointer hover:bg-slate-800/40' : 'bg-slate-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.isObligatory ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedDay === 'today') onQuickTogglePrayer(item.name);
                    }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isMissed
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'border border-slate-700 text-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : isMissed ? (
                      <span className="text-xs font-bold">×</span>
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                  </button>
                ) : (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-400/60 bg-amber-400/5">
                    <Sun className="w-4 h-4" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">
                      {formatPrayerName(item.name, userProfile.language)}
                    </span>
                    {!item.isObligatory && (
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                        (Sunnah / Non-obligatory)
                      </span>
                    )}
                  </div>
                  {record?.note && (
                    <span className="text-[10px] text-slate-400">
                      {record.note.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-medium text-slate-200">
                  {formatTime(item.time, userProfile.timeFormat12h)}
                </span>
                {item.isObligatory && (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Astronomical & Sun Position Info Card */}
      <div className="p-4 bg-[#101726] border border-slate-800 rounded-2xl text-xs space-y-2 text-slate-400">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          <span>Astronomical Guidelines</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          Fajr begins at true dawn, Dhuhr at solar zenith (zawal), Asr according to the selected shadow rule ({userProfile.madhhab === 'HANAFI' ? '2x shadow' : '1x shadow'}), Maghrib at sunset, and Isha when twilight fades.
        </p>
      </div>
    </div>
  );
};
