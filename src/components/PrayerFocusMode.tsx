import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Check,
  Clock,
  X,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Building,
  Home,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  PrayerName,
  PrayerRecord,
  PrayerCompletionNote,
  PrayerMissedReason,
  UserProfile,
  PrayerSettings,
} from '../types';
import { getTranslation, formatPrayerName, formatNote, formatReason } from '../utils/i18n';
import { playAdhan, stopAdhan, playHapticFeedback } from '../utils/audioPlayer';

interface PrayerFocusModeProps {
  prayer: PrayerName;
  scheduledTime: string;
  userProfile: UserProfile;
  settings: PrayerSettings;
  todaysCompletedCount: number;
  currentStreak: number;
  onConfirmPrayed: (prayer: PrayerName, note?: PrayerCompletionNote, customNote?: string) => void;
  onMarkMissed: (prayer: PrayerName, reason?: PrayerMissedReason) => void;
  onRemindLater: (prayer: PrayerName) => void;
  onClose: () => void;
}

export const PrayerFocusMode: React.FC<PrayerFocusModeProps> = ({
  prayer,
  scheduledTime,
  userProfile,
  settings,
  todaysCompletedCount,
  currentStreak,
  onConfirmPrayed,
  onMarkMissed,
  onRemindLater,
  onClose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60); // 15:00 focus timer
  const [subState, setSubState] = useState<'focus' | 'confirmed' | 'did_not_pray' | 'missed_reason'>('focus');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(settings.adhanEnabled);
  const [selectedNote, setSelectedNote] = useState<PrayerCompletionNote | undefined>(undefined);
  const [customNoteText, setCustomNoteText] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<PrayerMissedReason | undefined>(undefined);
  const [showAndroidGuidance, setShowAndroidGuidance] = useState<boolean>(false);

  const t = getTranslation(userProfile.language);
  const prayerDisplay = formatPrayerName(prayer, userProfile.language);

  // Focus Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Adhan Playback
  useEffect(() => {
    if (settings.adhanEnabled) {
      playAdhan(settings.adhanSound, () => setIsPlayingAudio(false));
    }
    return () => {
      stopAdhan();
    };
  }, [settings.adhanEnabled, settings.adhanSound]);

  const toggleAdhan = () => {
    if (isPlayingAudio) {
      stopAdhan();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      playAdhan(settings.adhanSound, () => setIsPlayingAudio(false));
    }
  };

  const handlePrayedClick = () => {
    playHapticFeedback([40, 60, 40]);
    stopAdhan();
    setIsPlayingAudio(false);
    setSubState('confirmed');
  };

  const handleSaveConfirmation = () => {
    onConfirmPrayed(prayer, selectedNote, customNoteText);
    onClose();
  };

  const handleMissedClick = () => {
    stopAdhan();
    setIsPlayingAudio(false);
    setSubState('did_not_pray');
  };

  const handleProceedMarkMissed = () => {
    setSubState('missed_reason');
  };

  const handleSaveMissed = () => {
    onMarkMissed(prayer, selectedReason);
    onClose();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070c16] text-slate-100 flex flex-col justify-between p-6 select-none overflow-y-auto">
      {/* Top Bar with Quiet Controls */}
      <div className="w-full flex items-center justify-between pt-2">
        <button
          onClick={toggleAdhan}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            isPlayingAudio
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-[#101726] border-slate-800 text-slate-400'
          }`}
          title="Toggle Adhan Audio"
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>Adhan Active</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Muted</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAndroidGuidance(!showAndroidGuidance)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-200 bg-[#101726] border border-slate-800"
            title="Focus Mode Info"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-200 bg-[#101726] border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Android Limitation Guidance Card */}
      {showAndroidGuidance && (
        <div className="my-3 p-4 bg-[#111928] border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2 animate-fadeIn">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{t.appLockTitle}</span>
          </div>
          <p className="leading-relaxed text-slate-400">{t.appLockAndroidLimitation}</p>
          <button
            onClick={() => setShowAndroidGuidance(false)}
            className="text-[11px] text-amber-400 font-medium hover:underline pt-1"
          >
            Dismiss note
          </button>
        </div>
      )}

      {/* SUB-STATE 1: MAIN FOCUS MODE */}
      {subState === 'focus' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8">
          {/* Calm Mosque / Crescent Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 shadow-lg shadow-black/60">
            <span className="text-3xl font-serif">🕌</span>
          </div>

          {/* Prayer Name & Status */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase mb-1">
            {prayerDisplay}
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-400/90 font-medium mb-1">
            {t.focusModeTag}
          </p>
          <p className="text-base font-mono text-slate-400 mb-6">
            {scheduledTime}
          </p>

          {/* Time Remaining Timer */}
          <div className="py-3 px-6 rounded-2xl bg-[#0f1726] border border-slate-800/80 mb-8 inline-flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-0.5">
              {t.remaining}
            </span>
            <span className="text-2xl font-mono font-bold text-amber-300 tracking-wider">
              {formatTimer(secondsRemaining)}
            </span>
          </div>

          {/* Respectful Centering Quote */}
          <p className="text-slate-300 text-sm max-w-xs font-normal leading-relaxed whitespace-pre-line mb-8 italic">
            "{t.focusModeQuote}"
          </p>

          {/* Three Primary Action Buttons */}
          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={handlePrayedClick}
              className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 transition-all transform active:scale-[0.99]"
            >
              <span>{t.btnIPrayed}</span>
            </button>

            <button
              onClick={() => onRemindLater(prayer)}
              className="w-full py-3 px-4 bg-[#121c2d] hover:bg-[#18253b] border border-slate-800 text-slate-300 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.btnRemindLater}</span>
            </button>

            <button
              onClick={handleMissedClick}
              className="w-full py-2.5 px-4 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
            >
              {t.btnDidNotPray}
            </button>
          </div>
        </div>
      )}

      {/* SUB-STATE 2: CONFIRMATION ("ALHAMDULILLAH") */}
      {subState === 'confirmed' && (
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              {t.alhamdulillah}
            </h2>
            <p className="text-sm text-slate-300">
              {t.prayerCompletedSuccess.replace('{prayer}', prayerDisplay)}
            </p>
          </div>

          {/* Progress & Streak Card */}
          <div className="p-4 bg-[#101726] border border-slate-800 rounded-2xl mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{t.todaysProgress}</span>
              <span className="text-emerald-400 font-bold font-mono">
                {Math.min(5, todaysCompletedCount + 1)} / 5
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((todaysCompletedCount + 1) / 5) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-amber-300 font-medium pt-1 flex items-center gap-1.5">
              <span>{t.streakMaintained}</span>
              <span className="text-slate-400 font-normal">({currentStreak} days)</span>
            </div>
          </div>

          {/* Optional Note Tagging */}
          <div className="space-y-3 mb-8">
            <label className="text-xs font-medium text-slate-400 block">
              {t.addNoteOptional}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedNote(selectedNote === 'at_mosque' ? undefined : 'at_mosque')}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                  selectedNote === 'at_mosque'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-[#121c2d] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>{t.noteAtMosque}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNote(selectedNote === 'at_home' ? undefined : 'at_home')}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                  selectedNote === 'at_home'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-[#121c2d] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>{t.noteAtHome}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNote(selectedNote === 'with_congregation' ? undefined : 'with_congregation')}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                  selectedNote === 'with_congregation'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-[#121c2d] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t.noteWithCongregation}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNote(selectedNote === 'on_time' ? undefined : 'on_time')}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                  selectedNote === 'on_time'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-[#121c2d] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.noteOnTime}</span>
              </button>
            </div>

            <input
              type="text"
              value={customNoteText}
              onChange={(e) => setCustomNoteText(e.target.value)}
              placeholder="Custom note (optional)..."
              className="w-full px-3 py-2 bg-[#121c2d] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <button
            onClick={handleSaveConfirmation}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors"
          >
            {t.btnClose}
          </button>
        </div>
      )}

      {/* SUB-STATE 3: "DID NOT PRAY" GENTLE FLOW */}
      {subState === 'did_not_pray' && (
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 mb-4 mx-auto">
            <Clock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {t.dontGiveUpTitle}
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed mb-8">
            {t.dontGiveUpDesc}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setSubState('focus')}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors"
            >
              {t.btnPrayNow}
            </button>

            <button
              onClick={() => onRemindLater(prayer)}
              className="w-full py-3 px-4 bg-[#121c2d] hover:bg-[#18253b] border border-slate-800 text-slate-200 font-medium rounded-xl text-xs transition-colors"
            >
              {t.btnRemindLater}
            </button>

            <button
              onClick={handleProceedMarkMissed}
              className="w-full py-3 px-4 text-slate-400 hover:text-rose-300 text-xs font-medium transition-colors"
            >
              {t.btnMarkMissed}
            </button>
          </div>
        </div>
      )}

      {/* SUB-STATE 4: MARK AS MISSED WITH REASON & SCHOLARLY NOTE */}
      {subState === 'missed_reason' && (
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-6">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="text-center mb-5">
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">
              {t.missedRecordedTitle}
            </h2>
            <p className="text-xs text-slate-400">
              "{t.missedRecordedDesc}"
            </p>
          </div>

          {/* Optional reason */}
          <div className="mb-5">
            <label className="text-xs font-medium text-slate-400 block mb-2">
              {t.missedReasonQuestion}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedReason('forgot')}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                  selectedReason === 'forgot'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                    : 'bg-[#121c2d] border-slate-800 text-slate-400'
                }`}
              >
                {t.reasonForgot}
              </button>
              <button
                type="button"
                onClick={() => setSelectedReason('overslept')}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                  selectedReason === 'overslept'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                    : 'bg-[#121c2d] border-slate-800 text-slate-400'
                }`}
              >
                {t.reasonOverslept}
              </button>
              <button
                type="button"
                onClick={() => setSelectedReason('busy')}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                  selectedReason === 'busy'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                    : 'bg-[#121c2d] border-slate-800 text-slate-400'
                }`}
              >
                {t.reasonBusy}
              </button>
              <button
                type="button"
                onClick={() => setSelectedReason('travel')}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                  selectedReason === 'travel'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                    : 'bg-[#121c2d] border-slate-800 text-slate-400'
                }`}
              >
                {t.reasonTravel}
              </button>
            </div>
          </div>

          {/* Neutral Scholarly Guidance */}
          <div className="p-3 bg-[#101726] border border-slate-800 rounded-xl mb-6 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300 block mb-0.5">Note:</span>
            {t.scholarAdviceNote}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSaveMissed}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Record & Finish
            </button>
            <button
              onClick={() => setSubState('focus')}
              className="w-full py-2 text-slate-500 hover:text-slate-300 text-xs font-medium"
            >
              I will pray now instead
            </button>
          </div>
        </div>
      )}

      {/* Subtle Footer */}
      <div className="w-full text-center py-2 text-[10px] text-slate-600 font-mono">
        SalahGuard · Offline Room Database
      </div>
    </div>
  );
};
