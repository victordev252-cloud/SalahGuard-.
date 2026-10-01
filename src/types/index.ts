export type Language = 'so' | 'en' | 'ar';

export type CalculationMethod =
  | 'MWL'       // Muslim World League
  | 'ISNA'      // Islamic Society of North America
  | 'EGYPT'     // Egyptian General Authority of Survey
  | 'MAKKAH'    // Umm al-Qura University, Makkah
  | 'KARACHI'   // University of Islamic Sciences, Karachi
  | 'DUBAI'     // Dubai Islamic Affairs
  | 'MOONSIGHT' // Moonsighting Committee;

export type Madhhab = 'STANDARD' | 'HANAFI'; // Standard = Shafi'i, Maliki, Hanbali (Shadow 1); Hanafi (Shadow 2)

export type HighLatitudeRule = 'MIDDLE_OF_NIGHT' | 'SEVENTH_OF_NIGHT' | 'ANGLE_BASED' | 'NONE';

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type PrayerStatus = 'pending' | 'completed' | 'missed';

export type PrayerCompletionNote = 'at_mosque' | 'at_home' | 'with_congregation' | 'on_time' | 'late' | 'other';

export type PrayerMissedReason = 'forgot' | 'overslept' | 'busy' | 'travel' | 'other';

export interface UserProfile {
  id: string;
  name: string;
  language: Language;
  theme: 'dark' | 'light' | 'system';
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  calculationMethod: CalculationMethod;
  madhhab: Madhhab;
  highLatitudeRule: HighLatitudeRule;
  timeFormat12h: boolean;
  streakRuleAllFive: boolean; // default true: streak requires all 5
  hasCompletedOnboarding: boolean;
  createdAt: number;
}

export interface PrayerRecord {
  id: string; // e.g. "2026-10-01-asr"
  date: string; // YYYY-MM-DD
  prayerName: PrayerName;
  scheduledTime: string; // "15:42"
  status: PrayerStatus;
  completedAt?: number;
  note?: PrayerCompletionNote;
  customNote?: string;
  missedReason?: PrayerMissedReason;
  createdAt: number;
}

export interface PrayerSettings {
  id: string;
  fajrEnabled: boolean;
  dhuhrEnabled: boolean;
  asrEnabled: boolean;
  maghribEnabled: boolean;
  ishaEnabled: boolean;
  reminderEnabled: boolean;
  reminderMinutes: number; // e.g. 10 or 15 mins
  maxReminders: number; // e.g. 2
  adhanEnabled: boolean;
  adhanSound: 'makkah' | 'madinah' | 'quds' | 'gentle_chime';
  fullScreenAlertEnabled: boolean;
  batteryOptimizedWarningDismissed: boolean;
  focusModePresetMinutes: number; // default 20 min
}

export interface StreakRecord {
  id: string;
  date: string;
  completedCount: number;
  isComplete: boolean;
  streakValue: number;
}

export interface DhikrRecord {
  id: string;
  date: string;
  type: 'subhanallah' | 'alhamdulillah' | 'allahu_akbar' | 'astaghfirullah' | 'la_ilaha_illallah' | 'salawat';
  count: number;
  target: number;
}

export interface DailyGoal {
  id: string;
  date: string;
  goalType: 'all_prayers' | 'quran' | 'dhikr' | 'sadaqah' | 'parents' | 'help_someone';
  completed: boolean;
}

export interface CalculatedPrayerTimes {
  date: string;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  hijriDate: {
    day: number;
    month: string;
    monthArabic: string;
    monthSomali: string;
    year: number;
  };
}

export interface NextPrayerInfo {
  name: PrayerName;
  time: Date;
  timeString: string;
  timeRemainingSeconds: number;
  isOngoingPrayer: boolean;
}
