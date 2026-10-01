import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X, Flame, BarChart2 } from 'lucide-react';
import { UserProfile, PrayerRecord, PrayerName } from '../types';
import { getTranslation, formatPrayerName, formatNote, formatReason } from '../utils/i18n';

interface HistoryScreenProps {
  userProfile: UserProfile;
  allRecords: PrayerRecord[];
  currentStreak: number;
  longestStreak: number;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  userProfile,
  allRecords,
  currentStreak,
  longestStreak,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string>(new Date().toISOString().split('T')[0]);

  const t = getTranslation(userProfile.language);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation between months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Month Name
  const monthName = new Intl.DateTimeFormat(
    userProfile.language === 'ar' ? 'ar-SA' : userProfile.language === 'so' ? 'so-SO' : 'en-US',
    { month: 'long', year: 'numeric' }
  ).format(currentDate);

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Shift so Monday is 0 (European/Islamic standard week) or Sunday based
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group records by date
  const recordsByDate = new Map<string, PrayerRecord[]>();
  for (const r of allRecords) {
    if (!recordsByDate.has(r.date)) {
      recordsByDate.set(r.date, []);
    }
    recordsByDate.get(r.date)!.push(r);
  }

  // Get day status: 'complete' (5/5), 'partial' (1-4/5), 'missed' (has missed), 'empty'
  const getDayStatus = (dateStr: string): 'complete' | 'partial' | 'missed' | 'empty' => {
    const dayRecs = recordsByDate.get(dateStr) || [];
    if (dayRecs.length === 0) return 'empty';
    const completed = dayRecs.filter((r) => r.status === 'completed').length;
    const missed = dayRecs.filter((r) => r.status === 'missed').length;

    if (completed >= 5) return 'complete';
    if (missed > 0 && completed === 0) return 'missed';
    return 'partial';
  };

  // Factual Statistics calculations
  const totalLogged = allRecords.length;
  const totalCompleted = allRecords.filter((r) => r.status === 'completed').length;
  const totalMissed = allRecords.filter((r) => r.status === 'missed').length;
  const completionPercentage = totalLogged > 0 ? Math.round((totalCompleted / (totalCompleted + totalMissed || 1)) * 100) : 0;

  // Prayer consistency counts
  const prayerCounts: Record<PrayerName, { completed: number; total: number }> = {
    fajr: { completed: 0, total: 0 },
    sunrise: { completed: 0, total: 0 },
    dhuhr: { completed: 0, total: 0 },
    asr: { completed: 0, total: 0 },
    maghrib: { completed: 0, total: 0 },
    isha: { completed: 0, total: 0 },
  };

  for (const r of allRecords) {
    if (prayerCounts[r.prayerName]) {
      prayerCounts[r.prayerName].total++;
      if (r.status === 'completed') {
        prayerCounts[r.prayerName].completed++;
      }
    }
  }

  const obligatory: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  let mostConsistent: PrayerName = 'fajr';
  let leastConsistent: PrayerName = 'asr';
  let highestRatio = -1;
  let lowestRatio = 2;

  for (const p of obligatory) {
    const item = prayerCounts[p];
    if (item.total > 0) {
      const ratio = item.completed / item.total;
      if (ratio > highestRatio) {
        highestRatio = ratio;
        mostConsistent = p;
      }
      if (ratio < lowestRatio) {
        lowestRatio = ratio;
        leastConsistent = p;
      }
    }
  }

  // Selected Day records
  const selectedDayRecs = recordsByDate.get(selectedDayStr) || [];
  const selectedDateObj = new Date(selectedDayStr);
  const selectedDayFormatted = new Intl.DateTimeFormat(
    userProfile.language === 'ar' ? 'ar-SA' : userProfile.language === 'so' ? 'so-SO' : 'en-US',
    { weekday: 'long', month: 'short', day: 'numeric' }
  ).format(selectedDateObj);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-5 max-w-md mx-auto w-full select-none pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.calendarTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {allRecords.length} {t.totalPrayersLogged}
          </p>
        </div>
      </div>

      {/* Monthly Calendar View */}
      <div className="p-4 bg-[#101726] border border-slate-800 rounded-2xl">
        {/* Month Selector */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-[#142238] border border-slate-800 text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-slate-100">{monthName}</span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-[#142238] border border-slate-800 text-slate-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-500 mb-2">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const padMonth = (month + 1).toString().padStart(2, '0');
            const padDay = dayNum.toString().padStart(2, '0');
            const dateStr = `${year}-${padMonth}-${padDay}`;
            const status = getDayStatus(dateStr);
            const isSelected = selectedDayStr === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDayStr(dateStr)}
                className={`h-9 rounded-lg flex flex-col items-center justify-center text-xs relative transition-all ${
                  isSelected
                    ? 'border-2 border-amber-400 bg-amber-500/20 text-white font-bold'
                    : 'border border-slate-800/80 bg-[#121c2d] hover:border-slate-700'
                }`}
              >
                <span className="text-[11px]">{dayNum}</span>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {status === 'complete' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  {status === 'partial' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  {status === 'missed' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Complete (5/5)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Missed</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      <div className="p-4 bg-[#101726] border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-xs font-semibold text-slate-200">{selectedDayFormatted}</span>
          <span className="text-[11px] font-mono text-amber-300">
            {selectedDayRecs.filter((r) => r.status === 'completed').length} / 5
          </span>
        </div>

        {obligatory.map((prayer) => {
          const rec = selectedDayRecs.find((r) => r.prayerName === prayer);
          const isDone = rec?.status === 'completed';
          const isMissed = rec?.status === 'missed';

          return (
            <div key={prayer} className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-300 font-medium capitalize">
                {formatPrayerName(prayer, userProfile.language)}
              </span>

              <div className="flex items-center gap-2">
                {rec?.note && (
                  <span className="text-[10px] text-slate-500">{rec.note.replace('_', ' ')}</span>
                )}
                {rec?.missedReason && (
                  <span className="text-[10px] text-rose-400/80">({rec.missedReason})</span>
                )}
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isMissed
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : isMissed ? '×' : '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Factual Statistics Section */}
      <div className="p-4 bg-[#101726] border border-slate-800 rounded-2xl space-y-3">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-amber-400" />
          <span>{t.statsTitle}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-[#121c2d] border border-slate-800/80 rounded-xl">
            <span className="text-[10px] text-slate-500 block">{t.completionRate}</span>
            <span className="text-base font-bold font-mono text-emerald-400">{completionPercentage}%</span>
          </div>

          <div className="p-3 bg-[#121c2d] border border-slate-800/80 rounded-xl">
            <span className="text-[10px] text-slate-500 block">{t.longestStreak}</span>
            <span className="text-base font-bold font-mono text-amber-300">{longestStreak} Days</span>
          </div>

          <div className="p-3 bg-[#121c2d] border border-slate-800/80 rounded-xl">
            <span className="text-[10px] text-slate-500 block">{t.mostConsistentPrayer}</span>
            <span className="text-xs font-semibold text-slate-200 capitalize">
              {formatPrayerName(mostConsistent, userProfile.language)}
            </span>
          </div>

          <div className="p-3 bg-[#121c2d] border border-slate-800/80 rounded-xl">
            <span className="text-[10px] text-slate-500 block">{t.leastConsistentPrayer}</span>
            <span className="text-xs font-semibold text-slate-200 capitalize">
              {formatPrayerName(leastConsistent, userProfile.language)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
