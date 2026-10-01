import {
  UserProfile,
  PrayerRecord,
  PrayerSettings,
  StreakRecord,
  DhikrRecord,
  DailyGoal,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'salahguard_user_profile',
  PRAYER_RECORDS: 'salahguard_prayer_records',
  SETTINGS: 'salahguard_settings',
  STREAKS: 'salahguard_streaks',
  DHIKR: 'salahguard_dhikr',
  GOALS: 'salahguard_goals',
};

// Default initial user profile (Somali default, Mogadishu)
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_1',
  name: '',
  language: 'so', // Somali as requested in prompt
  theme: 'dark',
  city: 'Muqdisho',
  country: 'Somalia',
  latitude: 2.0469,
  longitude: 45.3182,
  calculationMethod: 'MWL',
  madhhab: 'STANDARD',
  highLatitudeRule: 'ANGLE_BASED',
  timeFormat12h: false,
  streakRuleAllFive: true,
  hasCompletedOnboarding: false,
  createdAt: Date.now(),
};

export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = {
  id: 'settings_1',
  fajrEnabled: true,
  dhuhrEnabled: true,
  asrEnabled: true,
  maghribEnabled: true,
  ishaEnabled: true,
  reminderEnabled: true,
  reminderMinutes: 10,
  maxReminders: 2,
  adhanEnabled: true,
  adhanSound: 'makkah',
  fullScreenAlertEnabled: true,
  batteryOptimizedWarningDismissed: false,
  focusModePresetMinutes: 20,
};

// Seed realistic initial streak (12 days as requested in prompt)
export function generateInitialStreakHistory(todayStr: string): { records: PrayerRecord[]; streak: number } {
  const records: PrayerRecord[] = [];
  const prayers: ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const today = new Date(todayStr);

  // Generate 12 previous consecutive days of 5/5 completed prayers
  for (let i = 12; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    for (const prayer of prayers) {
      records.push({
        id: `${dateStr}-${prayer}`,
        date: dateStr,
        prayerName: prayer,
        scheduledTime: '12:00',
        status: 'completed',
        completedAt: d.getTime() + 3600000,
        note: i % 3 === 0 ? 'at_mosque' : 'on_time',
        createdAt: d.getTime(),
      });
    }
  }

  // For today: Fajr and Dhuhr completed, Asr upcoming (3/5 today progress as shown in prompt)
  records.push({
    id: `${todayStr}-fajr`,
    date: todayStr,
    prayerName: 'fajr',
    scheduledTime: '04:52',
    status: 'completed',
    completedAt: Date.now() - 3600000 * 6,
    note: 'at_mosque',
    createdAt: Date.now() - 3600000 * 6,
  });

  records.push({
    id: `${todayStr}-dhuhr`,
    date: todayStr,
    prayerName: 'dhuhr',
    scheduledTime: '12:15',
    status: 'completed',
    completedAt: Date.now() - 3600000 * 2,
    note: 'with_congregation',
    createdAt: Date.now() - 3600000 * 2,
  });

  return { records, streak: 12 };
}

// Database API
export class SalahGuardDatabase {
  static getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER_PROFILE;
  }

  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  static getSettings(): PrayerSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PRAYER_SETTINGS;
  }

  static saveSettings(settings: PrayerSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  static getPrayerRecords(): PrayerRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRAYER_RECORDS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  static savePrayerRecords(records: PrayerRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.PRAYER_RECORDS, JSON.stringify(records));
  }

  static getPrayerRecord(date: string, prayerName: string): PrayerRecord | undefined {
    const records = this.getPrayerRecords();
    return records.find((r) => r.date === date && r.prayerName === prayerName);
  }

  static upsertPrayerRecord(record: PrayerRecord): void {
    const records = this.getPrayerRecords();
    const index = records.findIndex((r) => r.date === record.date && r.prayerName === record.prayerName);
    if (index >= 0) {
      records[index] = { ...records[index], ...record };
    } else {
      records.push(record);
    }
    this.savePrayerRecords(records);
  }

  // Calculate current and longest streaks
  static calculateStreaks(): { currentStreak: number; longestStreak: number } {
    const records = this.getPrayerRecords();
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    // Group completed counts by date
    const dayMap = new Map<string, number>();
    for (const r of records) {
      if (r.status === 'completed' && prayers.includes(r.prayerName)) {
        dayMap.set(r.date, (dayMap.get(r.date) || 0) + 1);
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let currentStreak = 0;
    let checkDate = new Date();

    // Check yesterday first for ongoing streak continuity
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If today is complete (5/5), start from today. Else if yesterday was complete, start from yesterday
    const todayCount = dayMap.get(todayStr) || 0;
    const yesterdayCount = dayMap.get(yesterdayStr) || 0;

    let startDate: Date;
    if (todayCount >= 5) {
      startDate = new Date();
    } else if (yesterdayCount >= 5) {
      startDate = yesterday;
    } else {
      // Streak broken unless today still has prayers left to complete
      startDate = yesterday;
    }

    // Trace backwards day by day
    checkDate = new Date(startDate);
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      const count = dayMap.get(dStr) || 0;
      if (count >= 5) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Longest streak across all recorded days
    const sortedDates = Array.from(dayMap.keys()).sort();
    let longestStreak = currentStreak;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    for (const dStr of sortedDates) {
      const count = dayMap.get(dStr) || 0;
      const currD = new Date(dStr);

      if (count >= 5) {
        if (!prevDate) {
          tempStreak = 1;
        } else {
          const diffDays = Math.round((currD.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        }
        prevDate = currD;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
        prevDate = null;
      }
    }

    return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
  }

  // Dhikr Records
  static getDhikrRecords(): DhikrRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DHIKR);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', date: new Date().toISOString().split('T')[0], type: 'subhanallah', count: 33, target: 33 },
      { id: '2', date: new Date().toISOString().split('T')[0], type: 'alhamdulillah', count: 33, target: 33 },
      { id: '3', date: new Date().toISOString().split('T')[0], type: 'allahu_akbar', count: 34, target: 34 },
      { id: '4', date: new Date().toISOString().split('T')[0], type: 'astaghfirullah', count: 100, target: 100 },
      { id: '5', date: new Date().toISOString().split('T')[0], type: 'la_ilaha_illallah', count: 100, target: 100 },
    ];
  }

  static saveDhikrRecords(records: DhikrRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.DHIKR, JSON.stringify(records));
  }

  // Daily Goals
  static getDailyGoals(date: string): DailyGoal[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.GOALS}_${date}`);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: `${date}_1`, date, goalType: 'all_prayers', completed: false },
      { id: `${date}_2`, date, goalType: 'quran', completed: false },
      { id: `${date}_3`, date, goalType: 'dhikr', completed: true },
      { id: `${date}_4`, date, goalType: 'sadaqah', completed: false },
      { id: `${date}_5`, date, goalType: 'parents', completed: true },
      { id: `${date}_6`, date, goalType: 'help_someone', completed: false },
    ];
  }

  static saveDailyGoals(date: string, goals: DailyGoal[]): void {
    localStorage.setItem(`${STORAGE_KEYS.GOALS}_${date}`, JSON.stringify(goals));
  }

  // Export Data as CSV
  static exportCsv(): string {
    const records = this.getPrayerRecords();
    const headers = ['id', 'date', 'prayerName', 'scheduledTime', 'status', 'completedAt', 'note', 'missedReason'];
    const rows = records.map((r) => [
      r.id,
      r.date,
      r.prayerName,
      r.scheduledTime,
      r.status,
      r.completedAt ? new Date(r.completedAt).toISOString() : '',
      r.note || '',
      r.missedReason || '',
    ]);

    return [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
  }

  // Export Data as JSON
  static exportJson(): string {
    const data = {
      profile: this.getUserProfile(),
      settings: this.getSettings(),
      prayers: this.getPrayerRecords(),
      dhikr: this.getDhikrRecords(),
      exportedAt: new Date().toISOString(),
      app: 'SalahGuard — صلاتي أولاً',
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  }

  // Reset all application data
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PRAYER_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STREAKS);
    localStorage.removeItem(STORAGE_KEYS.DHIKR);
    // Remove goals
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEYS.GOALS)) {
        localStorage.removeItem(key);
      }
    }
  }
}
