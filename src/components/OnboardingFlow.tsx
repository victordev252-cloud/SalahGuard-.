import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Bell,
  Clock,
  ShieldAlert,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Search,
} from 'lucide-react';
import { UserProfile, CalculationMethod, Madhhab, HighLatitudeRule } from '../types';
import { getTranslation } from '../utils/i18n';
import { POPULAR_CITIES, calculatePrayerTimes, formatTime } from '../utils/prayerEngine';
import { requestNotificationPermission } from '../utils/notifications';

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ initialProfile, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [citySearch, setCitySearch] = useState<string>('');
  const [notificationGranted, setNotificationGranted] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [batteryNoticeOpened, setBatteryNoticeOpened] = useState<boolean>(false);

  const t = getTranslation(profile.language);

  const handleNext = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      onComplete({ ...profile, hasCompletedOnboarding: true });
    }
  };

  const handleUseLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setProfile((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            city: 'My Location',
            country: 'GPS Detected',
          }));
          setIsLocating(false);
          setStep(4);
        },
        () => {
          setIsLocating(false);
        },
        { timeout: 7000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSelectCity = (city: typeof POPULAR_CITIES[0]) => {
    setProfile((prev) => ({
      ...prev,
      city: profile.language === 'ar' ? city.nameAr : profile.language === 'so' ? city.nameSo : city.name,
      country: profile.language === 'ar' ? city.countryAr : profile.language === 'so' ? city.countrySo : city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    }));
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationGranted(granted);
    setTimeout(() => {
      setStep(6);
    }, 400);
  };

  const previewTimes = calculatePrayerTimes(
    new Date(),
    profile.latitude,
    profile.longitude,
    profile.calculationMethod,
    profile.madhhab,
    profile.highLatitudeRule
  );

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.nameSo.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.nameAr.includes(citySearch) ||
      c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b111e] text-slate-100 flex flex-col justify-between p-6 max-w-md mx-auto relative select-none">
      {/* Top Indicator */}
      <div className="w-full flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'w-6 bg-amber-400'
                  : i + 1 < step
                  ? 'w-2 bg-slate-600'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-mono text-slate-400">{step}/8</span>
      </div>

      {/* Screen 1: Welcome & Identity */}
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8">
          {/* Logo Crescent */}
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl animate-pulse" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#182337] to-[#101726] border border-amber-500/30 flex items-center justify-center shadow-lg shadow-black/40">
              <span className="text-3xl text-amber-400 font-serif">☪</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            {t.appName}
          </h1>
          <p className="text-lg font-serif text-amber-300/90 mb-4" dir="rtl">
            {t.appArabicName}
          </p>

          <p className="text-slate-300 text-sm max-w-xs font-medium leading-relaxed mb-2">
            "{t.tagline}"
          </p>
          <p className="text-slate-500 text-xs max-w-xs mb-8">
            {t.subTagline}
          </p>

          {/* Language selector right on first screen */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121c2d] rounded-xl border border-slate-800 mb-6">
            <button
              onClick={() => setProfile({ ...profile, language: 'so' })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                profile.language === 'so'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Somali
            </button>
            <button
              onClick={() => setProfile({ ...profile, language: 'ar' })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                profile.language === 'ar'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setProfile({ ...profile, language: 'en' })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                profile.language === 'en'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Name Input */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {t.onboardingTitle2}
          </h2>
          <p className="text-slate-400 text-xs mb-6">
            This name will be stored locally on your device to personalize your daily greetings.
          </p>

          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder={t.nameInputPlaceholder}
            className="w-full px-4 py-3.5 bg-[#121c2d] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors text-base"
            autoFocus
          />
        </div>
      )}

      {/* Screen 3: Location (GPS or Manual) */}
      {step === 3 && (
        <div className="flex-1 flex flex-col justify-center py-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {t.onboardingTitle3}
          </h2>
          <p className="text-slate-400 text-xs mb-5">
            Prayer times are calculated precisely from your astronomical latitude and longitude.
          </p>

          <button
            onClick={handleUseLocation}
            disabled={isLocating}
            className="w-full py-3.5 px-4 bg-[#142238] border border-sky-500/30 hover:border-sky-400/60 rounded-xl flex items-center justify-center gap-2 text-sky-300 font-medium text-sm transition-all mb-4"
          >
            <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting coordinates...' : t.btnDetectLocation}</span>
          </button>

          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search city (e.g. Muqdisho, Makkah, London)..."
              className="w-full pl-9 pr-3 py-2 bg-[#0e1624] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {filteredCities.map((c) => {
              const isSelected = profile.latitude === c.latitude && profile.longitude === c.longitude;
              const cityName = profile.language === 'ar' ? c.nameAr : profile.language === 'so' ? c.nameSo : c.name;
              const countryName = profile.language === 'ar' ? c.countryAr : profile.language === 'so' ? c.countrySo : c.country;
              return (
                <button
                  key={c.name}
                  onClick={() => handleSelectCity(c)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : 'bg-[#101726] border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{cityName}</div>
                    <div className="text-[10px] text-slate-400">{countryName}</div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Screen 4: Prayer Calculation Settings */}
      {step === 4 && (
        <div className="flex-1 flex flex-col justify-center py-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {t.onboardingTitle4}
          </h2>
          <p className="text-slate-400 text-xs mb-4">
            {t.calcMethodDesc}
          </p>

          <div className="space-y-4">
            {/* Calculation Method */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Authority / Calculation Method
              </label>
              <select
                value={profile.calculationMethod}
                onChange={(e) => setProfile({ ...profile, calculationMethod: e.target.value as CalculationMethod })}
                className="w-full px-3 py-2.5 bg-[#121c2d] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400/60"
              >
                <option value="MWL">Muslim World League (Fajr 18°, Isha 17°)</option>
                <option value="EGYPT">Egyptian General Authority (Fajr 19.5°, Isha 17.5°)</option>
                <option value="MAKKAH">Umm al-Qura University, Makkah (Fajr 18.5°, Isha 90m)</option>
                <option value="ISNA">Islamic Society of North America (Fajr 15°, Isha 15°)</option>
                <option value="KARACHI">Univ. of Islamic Sciences, Karachi (Fajr 18°, Isha 18°)</option>
                <option value="DUBAI">Dubai Islamic Affairs (Fajr 18.2°, Isha 18.2°)</option>
                <option value="MOONSIGHT">Moonsighting Committee (Fajr 18°, Isha 18°)</option>
              </select>
            </div>

            {/* Madhhab (Asr Method) */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.madhhabLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, madhhab: 'STANDARD' })}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                    profile.madhhab === 'STANDARD'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : 'bg-[#121c2d] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-[11px]">Standard (Shafi'i, Maliki, Hanbali)</div>
                  <div className="text-[10px] text-slate-500">Shadow ratio 1x</div>
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, madhhab: 'HANAFI' })}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                    profile.madhhab === 'HANAFI'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : 'bg-[#121c2d] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-[11px]">Hanafi</div>
                  <div className="text-[10px] text-slate-500">Shadow ratio 2x</div>
                </button>
              </div>
            </div>

            {/* Time Format */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.timeFormatLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, timeFormat12h: false })}
                  className={`p-2 rounded-lg border text-center text-xs transition-all ${
                    !profile.timeFormat12h
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 font-semibold'
                      : 'bg-[#121c2d] border-slate-800 text-slate-400'
                  }`}
                >
                  {t.timeFormat24}
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, timeFormat12h: true })}
                  className={`p-2 rounded-lg border text-center text-xs transition-all ${
                    profile.timeFormat12h
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 font-semibold'
                      : 'bg-[#121c2d] border-slate-800 text-slate-400'
                  }`}
                >
                  {t.timeFormat12}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 5: Notification Permissions */}
      {step === 5 && (
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
            <Bell className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {t.onboardingTitle5}
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed mb-6">
            {t.notificationDesc}
          </p>

          <div className="p-4 bg-[#121c2d] border border-slate-800 rounded-xl space-y-2 mb-6 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Timely prayer alert at adhan time</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Gentle reminder 10 minutes later if not logged</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Never spam, ads, or promotional messages</span>
            </div>
          </div>

          <button
            onClick={handleRequestNotifications}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>{notificationGranted ? 'Notifications Allowed ✓' : t.btnAllowNotifications}</span>
          </button>
        </div>
      )}

      {/* Screen 6: Full-Screen Alarm Permissions */}
      {step === 6 && (
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {t.onboardingTitle6}
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed mb-6">
            {t.fullScreenAlertDesc}
          </p>

          <div className="p-4 bg-[#121c2d] border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2 mb-6">
            <p>
              On Android 14 and newer, full-screen alarms ensure you see Prayer Focus Mode directly on your lock screen.
            </p>
            <p className="text-[11px] text-slate-500">
              Note: Android permissions differ by device manufacturer. If full-screen is not allowed by system policy, SalahGuard falls back to priority heads-up notifications.
            </p>
          </div>
        </div>
      )}

      {/* Screen 7: Battery Optimization Guidance */}
      {step === 7 && (
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
            <BatteryCharging className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {t.androidBatteryOptimizationTitle}
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed mb-6">
            "{t.androidBatteryNotice}"
          </p>

          <div className="p-4 bg-[#121c2d] border border-slate-800 rounded-xl space-y-2 mb-6 text-xs text-slate-400">
            <p>
              Android battery management may suppress alarms when your screen is locked.
            </p>
            <p className="text-amber-300/80 font-medium">
              We never secretly modify your system settings. You can grant exemption in your phone's Settings.
            </p>
          </div>

          <button
            onClick={() => setBatteryNoticeOpened(true)}
            className="w-full py-3.5 bg-[#172338] border border-amber-500/30 hover:border-amber-400 text-amber-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all mb-3"
          >
            <span>{batteryNoticeOpened ? 'Settings Opened (Exempted) ✓' : t.btnOpenBatterySettings}</span>
          </button>
        </div>
      )}

      {/* Screen 8: You're ready */}
      {step === 8 && (
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            {t.onboardingTitle8}
          </h2>
          <p className="text-slate-400 text-xs mb-5">
            {t.todaysPrayersReady}
          </p>

          {/* Today's prayer summary preview */}
          <div className="bg-[#121c2d] border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/80 mb-6">
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-medium text-slate-200">{t.fajr}</span>
              <span className="font-mono text-amber-300">{formatTime(previewTimes.fajr, profile.timeFormat12h)}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-medium text-slate-200">{t.dhuhr}</span>
              <span className="font-mono text-amber-300">{formatTime(previewTimes.dhuhr, profile.timeFormat12h)}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-medium text-slate-200">{t.asr}</span>
              <span className="font-mono text-amber-300">{formatTime(previewTimes.asr, profile.timeFormat12h)}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-medium text-slate-200">{t.maghrib}</span>
              <span className="font-mono text-amber-300">{formatTime(previewTimes.maghrib, profile.timeFormat12h)}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="font-medium text-slate-200">{t.isha}</span>
              <span className="font-mono text-amber-300">{formatTime(previewTimes.isha, profile.timeFormat12h)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="w-full pt-4 flex items-center justify-between gap-3">
        {step > 1 && step < 8 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          className="flex-1 max-w-[200px] ml-auto py-3.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all"
        >
          <span>
            {step === 1 ? t.btnGetStarted : step === 8 ? t.btnStartMyDay : t.btnNext}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
