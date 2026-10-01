import React, { useState } from 'react';
import {
  Globe,
  Bell,
  Volume2,
  Shield,
  FileDown,
  Trash2,
  Info,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Code2,
  Bug,
  AlertTriangle,
  Play,
  Square,
} from 'lucide-react';
import {
  UserProfile,
  PrayerSettings,
  Language,
  CalculationMethod,
  Madhhab,
} from '../types';
import { getTranslation } from '../utils/i18n';
import { POPULAR_CITIES } from '../utils/prayerEngine';
import { playAdhan, stopAdhan } from '../utils/audioPlayer';
import { SalahGuardDatabase } from '../data/database';

interface SettingsScreenProps {
  userProfile: UserProfile;
  settings: PrayerSettings;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateSettings: (settings: PrayerSettings) => void;
  onOpenDebug: () => void;
  onOpenAndroidCode: () => void;
  onResetApp: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  userProfile,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onOpenDebug,
  onOpenAndroidCode,
  onResetApp,
}) => {
  const [isPlayingTestAdhan, setIsPlayingTestAdhan] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const t = getTranslation(userProfile.language);

  const handleTestAdhan = () => {
    if (isPlayingTestAdhan) {
      stopAdhan();
      setIsPlayingTestAdhan(false);
    } else {
      setIsPlayingTestAdhan(true);
      playAdhan(settings.adhanSound, () => setIsPlayingTestAdhan(false));
    }
  };

  const handleExportCsv = () => {
    const csvData = SalahGuardDatabase.exportCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SalahGuard_PrayerHistory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const jsonData = SalahGuardDatabase.exportJson();
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SalahGuard_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-5 max-w-md mx-auto w-full select-none pb-28">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.settingsTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {t.aboutAppName}
          </p>
        </div>
      </div>

      {/* 1. Language & Theme */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>{t.sectionLanguageTheme}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['so', 'ar', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onUpdateProfile({ ...userProfile, language: lang })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                userProfile.language === lang
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-[#121c2d] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'so' ? 'Somali' : lang === 'ar' ? 'العربية' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Prayer Calculation & Location */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3.5">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span>{t.sectionPrayerTimes}</span>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">City / Location</label>
          <select
            value={userProfile.city}
            onChange={(e) => {
              const selected = POPULAR_CITIES.find(
                (c) =>
                  c.name === e.target.value ||
                  c.nameSo === e.target.value ||
                  c.nameAr === e.target.value
              );
              if (selected) {
                onUpdateProfile({
                  ...userProfile,
                  city:
                    userProfile.language === 'ar'
                      ? selected.nameAr
                      : userProfile.language === 'so'
                      ? selected.nameSo
                      : selected.name,
                  country:
                    userProfile.language === 'ar'
                      ? selected.countryAr
                      : userProfile.language === 'so'
                      ? selected.countrySo
                      : selected.country,
                  latitude: selected.latitude,
                  longitude: selected.longitude,
                });
              }
            }}
            className="w-full px-3 py-2 bg-[#121c2d] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.country})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Calculation Authority</label>
          <select
            value={userProfile.calculationMethod}
            onChange={(e) =>
              onUpdateProfile({
                ...userProfile,
                calculationMethod: e.target.value as CalculationMethod,
              })
            }
            className="w-full px-3 py-2 bg-[#121c2d] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="MWL">Muslim World League</option>
            <option value="EGYPT">Egyptian General Authority</option>
            <option value="MAKKAH">Umm al-Qura University, Makkah</option>
            <option value="ISNA">Islamic Society of North America</option>
            <option value="KARACHI">University of Islamic Sciences, Karachi</option>
            <option value="DUBAI">Dubai Islamic Affairs</option>
            <option value="MOONSIGHT">Moonsighting Committee</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">{t.madhhabLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateProfile({ ...userProfile, madhhab: 'STANDARD' })}
              className={`p-2 rounded-xl border text-xs text-left transition-all ${
                userProfile.madhhab === 'STANDARD'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 font-semibold'
                  : 'bg-[#121c2d] border-slate-800 text-slate-400'
              }`}
            >
              Standard (1x shadow)
            </button>
            <button
              onClick={() => onUpdateProfile({ ...userProfile, madhhab: 'HANAFI' })}
              className={`p-2 rounded-xl border text-xs text-left transition-all ${
                userProfile.madhhab === 'HANAFI'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 font-semibold'
                  : 'bg-[#121c2d] border-slate-800 text-slate-400'
              }`}
            >
              Hanafi (2x shadow)
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notifications & Adhan */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3.5">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>{t.sectionNotifications}</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-slate-200">{t.enableAdhan}</span>
          <input
            type="checkbox"
            checked={settings.adhanEnabled}
            onChange={(e) => onUpdateSettings({ ...settings, adhanEnabled: e.target.checked })}
            className="w-4 h-4 accent-amber-500 cursor-pointer"
          />
        </div>

        {settings.adhanEnabled && (
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <label className="text-xs text-slate-400 block">{t.adhanSoundLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'makkah', label: t.soundMakkah },
                { id: 'madinah', label: t.soundMadinah },
                { id: 'quds', label: t.soundQuds },
                { id: 'gentle_chime', label: t.soundGentleChime },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => onUpdateSettings({ ...settings, adhanSound: s.id as any })}
                  className={`p-2 rounded-xl border text-xs text-left transition-all ${
                    settings.adhanSound === s.id
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 font-semibold'
                      : 'bg-[#121c2d] border-slate-800 text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleTestAdhan}
              className={`w-full mt-2 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isPlayingTestAdhan
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              {isPlayingTestAdhan ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>{t.btnStopAdhan}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{t.btnPreviewAdhan}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 4. Native Android Source Code & Project Files */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>Android Kotlin Jetpack Compose Stack</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Inspect the complete native Kotlin project tree, Room entities, AlarmManager receivers, and Compose files ready for Android Studio.
        </p>
        <button
          onClick={onOpenAndroidCode}
          className="w-full py-2.5 px-3 bg-[#132034] hover:bg-[#182942] border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
        >
          <Code2 className="w-4 h-4 text-amber-400" />
          <span>View Native Android Source (Kotlin/Compose)</span>
        </button>
      </div>

      {/* 5. Data & Privacy (Export, Reset) */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>{t.sectionDataPrivacy}</span>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {t.privacyNotice}
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportCsv}
            className="py-2.5 px-3 bg-[#121c2d] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.exportDataCsv}</span>
          </button>
          <button
            onClick={handleExportJson}
            className="py-2.5 px-3 bg-[#121c2d] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.exportDataJson}</span>
          </button>
        </div>

        <div className="pt-2">
          {showDeleteConfirm ? (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
              <p className="text-xs text-rose-300 font-medium">
                {t.deleteDataConfirm}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetApp();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  {t.btnConfirmDelete}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  {t.btnCancel}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800/80 hover:border-rose-500/40 text-rose-400/90 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.deleteDataLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* 6. Developer Simulator Button */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Bug className="w-4 h-4 text-slate-500" />
          <span>{t.sectionDeveloper}</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Simulate prayer alarms, adhan events, countdowns, and broken streak behavior for test validation.
        </p>
        <button
          onClick={onOpenDebug}
          className="w-full py-2.5 px-3 bg-[#131c2c] hover:bg-[#182338] border border-slate-800 rounded-xl text-xs font-mono text-amber-400/90 flex items-center justify-center gap-2 transition-colors"
        >
          <Bug className="w-3.5 h-3.5" />
          <span>Launch Prayer Simulator</span>
        </button>
      </div>

      {/* App Version Info */}
      <div className="text-center pt-2 text-[11px] text-slate-500 font-mono space-y-0.5">
        <div>{t.aboutAppName}</div>
        <div>{t.appVersion}</div>
      </div>
    </div>
  );
};
