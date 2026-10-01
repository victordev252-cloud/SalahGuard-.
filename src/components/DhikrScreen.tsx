import React, { useState } from 'react';
import { RotateCcw, Plus, Sparkles, Volume2, Check } from 'lucide-react';
import { UserProfile, DhikrRecord } from '../types';
import { getTranslation } from '../utils/i18n';
import { playGentleTapSound, playHapticFeedback } from '../utils/audioPlayer';

interface DhikrScreenProps {
  userProfile: UserProfile;
  dhikrRecords: DhikrRecord[];
  onUpdateDhikr: (records: DhikrRecord[]) => void;
}

export const DhikrScreen: React.FC<DhikrScreenProps> = ({
  userProfile,
  dhikrRecords,
  onUpdateDhikr,
}) => {
  const [selectedType, setSelectedType] = useState<DhikrRecord['type']>('subhanallah');
  const [customTargetInput, setCustomTargetInput] = useState<string>('');
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);

  const t = getTranslation(userProfile.language);

  const dhikrOptions: { type: DhikrRecord['type']; label: string; arabic: string }[] = [
    { type: 'subhanallah', label: t.subhanallah, arabic: t.subhanallahAr },
    { type: 'alhamdulillah', label: t.alhamdulillahDhikr, arabic: t.alhamdulillahAr },
    { type: 'allahu_akbar', label: t.allahuAkbar, arabic: t.allahuAkbarAr },
    { type: 'astaghfirullah', label: t.astaghfirullah, arabic: t.astaghfirullahAr },
    { type: 'la_ilaha_illallah', label: t.laIlahaIllallah, arabic: t.laIlahaIllallahAr },
    { type: 'salawat', label: t.salawat, arabic: t.salawatAr },
  ];

  const currentItem =
    dhikrRecords.find((r) => r.type === selectedType) || {
      id: selectedType,
      date: new Date().toISOString().split('T')[0],
      type: selectedType,
      count: 0,
      target: 33,
    };

  const handleIncrement = () => {
    playGentleTapSound();
    playHapticFeedback([25]);

    const updated = [...dhikrRecords];
    const idx = updated.findIndex((r) => r.type === selectedType);
    const newCount = currentItem.count + 1;

    if (newCount === currentItem.target) {
      // Haptic celebration when target reached
      playHapticFeedback([40, 50, 40]);
    }

    if (idx >= 0) {
      updated[idx] = { ...updated[idx], count: newCount };
    } else {
      updated.push({
        id: selectedType,
        date: new Date().toISOString().split('T')[0],
        type: selectedType,
        count: newCount,
        target: currentItem.target,
      });
    }
    onUpdateDhikr(updated);
  };

  const handleReset = () => {
    playHapticFeedback([50]);
    const updated = [...dhikrRecords];
    const idx = updated.findIndex((r) => r.type === selectedType);
    if (idx >= 0) {
      updated[idx] = { ...updated[idx], count: 0 };
    }
    onUpdateDhikr(updated);
  };

  const handleSetTarget = (target: number) => {
    const updated = [...dhikrRecords];
    const idx = updated.findIndex((r) => r.type === selectedType);
    if (idx >= 0) {
      updated[idx] = { ...updated[idx], target };
    } else {
      updated.push({
        id: selectedType,
        date: new Date().toISOString().split('T')[0],
        type: selectedType,
        count: 0,
        target,
      });
    }
    onUpdateDhikr(updated);
    setIsEditingCustom(false);
  };

  const totalDhikrToday = dhikrRecords.reduce((acc, curr) => acc + curr.count, 0);
  const activeOption = dhikrOptions.find((o) => o.type === selectedType) || dhikrOptions[0];

  const progressPercent = Math.min(100, (currentItem.count / currentItem.target) * 100);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-5 max-w-md mx-auto w-full select-none pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.dhikrTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {t.todaysDhikrCount}: <span className="font-mono text-amber-300 font-bold">{totalDhikrToday}</span>
          </p>
        </div>
      </div>

      {/* Dhikr Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#101726] border border-slate-800 rounded-2xl">
        {dhikrOptions.map((opt) => {
          const isSelected = selectedType === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => setSelectedType(opt.type)}
              className={`p-2 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[11px] truncate">{opt.label}</div>
              <div className="text-[10px] font-serif opacity-70 truncate" dir="rtl">
                {opt.arabic}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Big Tactile Ring Button */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="text-center mb-6">
          <p className="text-2xl font-serif text-amber-300 mb-1" dir="rtl">
            {activeOption.arabic}
          </p>
          <p className="text-sm font-semibold text-slate-200">{activeOption.label}</p>
        </div>

        {/* Circular Tactile Tap Counter */}
        <button
          onClick={handleIncrement}
          className="relative w-56 h-56 rounded-full bg-gradient-to-b from-[#162235] to-[#0e1624] border-4 border-slate-800/80 hover:border-amber-500/40 active:scale-95 active:border-amber-400 transition-all flex flex-col items-center justify-center shadow-2xl shadow-black/60 group cursor-pointer"
        >
          {/* Circular progress track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          <span className="text-5xl font-mono font-extrabold text-white tracking-tight">
            {currentItem.count}
          </span>
          <span className="text-xs font-mono text-slate-500 mt-1">
            / {currentItem.target}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/80 mt-3 group-hover:text-amber-300">
            TAP TO COUNT
          </span>
        </button>

        {/* Target Presets & Reset Controls */}
        <div className="flex items-center gap-2 mt-8">
          {[33, 100].map((tVal) => (
            <button
              key={tVal}
              onClick={() => handleSetTarget(tVal)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                currentItem.target === tVal
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-[#121c2d] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tVal}
            </button>
          ))}

          <button
            onClick={() => setIsEditingCustom(!isEditingCustom)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
              isEditingCustom || ![33, 100].includes(currentItem.target)
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-[#121c2d] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {![33, 100].includes(currentItem.target) ? `${currentItem.target}` : t.customTarget}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-[#142238] border border-slate-800 text-slate-400 hover:text-rose-300 transition-colors ml-2"
            title={t.btnReset}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Custom Target Input Drawer */}
        {isEditingCustom && (
          <div className="flex items-center gap-2 mt-3 animate-fadeIn">
            <input
              type="number"
              value={customTargetInput}
              onChange={(e) => setCustomTargetInput(e.target.value)}
              placeholder="e.g. 50"
              className="w-24 px-3 py-1.5 bg-[#121c2d] border border-slate-800 rounded-lg text-xs font-mono text-white text-center focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => {
                const val = parseInt(customTargetInput, 10);
                if (val && val > 0) handleSetTarget(val);
              }}
              className="px-3 py-1.5 bg-amber-500 text-slate-950 font-semibold rounded-lg text-xs"
            >
              Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
