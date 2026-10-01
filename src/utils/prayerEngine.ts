import { CalculationMethod, Madhhab, HighLatitudeRule, CalculatedPrayerTimes, NextPrayerInfo, PrayerName } from '../types';

export interface CityPreset {
  name: string;
  nameSo: string;
  nameAr: string;
  country: string;
  countrySo: string;
  countryAr: string;
  latitude: number;
  longitude: number;
  timezoneOffset?: number;
}

export const POPULAR_CITIES: CityPreset[] = [
  { name: 'Mogadishu', nameSo: 'Muqdisho', nameAr: 'مقديشو', country: 'Somalia', countrySo: 'Soomaaliya', countryAr: 'الصومال', latitude: 2.0469, longitude: 45.3182 },
  { name: 'Hargeisa', nameSo: 'Hargeysa', nameAr: 'هرجيسا', country: 'Somalia', countrySo: 'Soomaaliya', countryAr: 'الصومال', latitude: 9.5624, longitude: 44.0770 },
  { name: 'Makkah', nameSo: 'Makka Al-mukarrama', nameAr: 'مكة المكرمة', country: 'Saudi Arabia', countrySo: 'Sucuudiga', countryAr: 'السعودية', latitude: 21.4225, longitude: 39.8262 },
  { name: 'Madinah', nameSo: 'Madiina Al-munawwara', nameAr: 'المدينة المنورة', country: 'Saudi Arabia', countrySo: 'Sucuudiga', countryAr: 'السعودية', latitude: 24.5247, longitude: 39.5692 },
  { name: 'Cairo', nameSo: 'Qaahira', nameAr: 'القاهرة', country: 'Egypt', countrySo: 'Masar', countryAr: 'مصر', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Minneapolis', nameSo: 'Minneapolis', nameAr: 'مينيابوليس', country: 'United States', countrySo: 'Maraykanka', countryAr: 'أمريكا', latitude: 44.9778, longitude: -93.2650 },
  { name: 'London', nameSo: 'London', nameAr: 'لندن', country: 'United Kingdom', countrySo: 'Boqortooyada Midowday', countryAr: 'بريطانيا', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Nairobi', nameSo: 'Nayroobi', nameAr: 'نيروبي', country: 'Kenya', countrySo: 'Kiinya', countryAr: 'كينيا', latitude: -1.2921, longitude: 36.8219 },
  { name: 'Djibouti', nameSo: 'Jabuuti', nameAr: 'جيبوتي', country: 'Djibouti', countrySo: 'Jabuuti', countryAr: 'جيبوتي', latitude: 11.5721, longitude: 43.1456 },
  { name: 'Dubai', nameSo: 'Dubay', nameAr: 'دبي', country: 'United Arab Emirates', countrySo: 'Imaaraadka', countryAr: 'الإمارات', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Istanbul', nameSo: 'Istanbuul', nameAr: 'إسطنبول', country: 'Turkey', countrySo: 'Turkiga', countryAr: 'تركيا', latitude: 41.0082, longitude: 28.9784 },
  { name: 'Toronto', nameSo: 'Toronto', nameAr: 'تورونتو', country: 'Canada', countrySo: 'Kanada', countryAr: 'كندا', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Kuala Lumpur', nameSo: 'Kuala Lumpur', nameAr: 'كوالالمبور', country: 'Malaysia', countrySo: 'Maleeshiya', countryAr: 'ماليزيا', latitude: 3.1390, longitude: 101.6869 },
];

// Helper Trigonometry in Degrees
const d2r = (deg: number) => (deg * Math.PI) / 180.0;
const r2d = (rad: number) => (rad * 180.0) / Math.PI;
const sinD = (d: number) => Math.sin(d2r(d));
const cosD = (d: number) => Math.cos(d2r(d));
const tanD = (d: number) => Math.tan(d2r(d));
const asinD = (x: number) => r2d(Math.asin(x));
const acosD = (x: number) => r2d(Math.acos(Math.max(-1, Math.min(1, x))));
const atan2D = (y: number, x: number) => r2d(Math.atan2(y, x));

function fixHour(hour: number): number {
  let a = hour - 24.0 * Math.floor(hour / 24.0);
  return a < 0 ? a + 24.0 : a;
}

// Astronomical Solar Parameters
function sunPosition(julianDay: number) {
  const D = julianDay - 2451545.0;
  const g = fixHour(357.529 + 0.98560028 * D);
  const q = fixHour(280.459 + 0.98564736 * D);
  const L = fixHour(q + 1.915 * sinD(g) + 0.02 * sinD(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = fixHour(atan2D(cosD(e) * sinD(L), cosD(L)) / 15.0);
  const d = asinD(sinD(e) * sinD(L));
  const EqT = q / 15.0 - RA;
  return { declination: d, equationOfTime: EqT };
}

function julian(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Compute Hour Angle
function hourAngle(altitude: number, lat: number, declination: number): number {
  const cosH = (sinD(altitude) - sinD(lat) * sinD(declination)) / (cosD(lat) * cosD(declination));
  if (cosH > 1) return 0; // Sun never reaches this altitude
  if (cosH < -1) return 180;
  return acosD(cosH);
}

// Parameters for Calculation Methods
function getMethodAngles(method: CalculationMethod): { fajrAngle: number; ishaAngle: number; ishaInterval?: number } {
  switch (method) {
    case 'MWL':
      return { fajrAngle: 18, ishaAngle: 17 };
    case 'ISNA':
      return { fajrAngle: 15, ishaAngle: 15 };
    case 'EGYPT':
      return { fajrAngle: 19.5, ishaAngle: 17.5 };
    case 'MAKKAH':
      return { fajrAngle: 18.5, ishaAngle: 0, ishaInterval: 90 };
    case 'KARACHI':
      return { fajrAngle: 18, ishaAngle: 18 };
    case 'DUBAI':
      return { fajrAngle: 18.2, ishaAngle: 18.2 };
    case 'MOONSIGHT':
      return { fajrAngle: 18, ishaAngle: 18 };
    default:
      return { fajrAngle: 18, ishaAngle: 17 };
  }
}

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  method: CalculationMethod = 'MWL',
  madhhab: Madhhab = 'STANDARD',
  highLatRule: HighLatitudeRule = 'ANGLE_BASED'
): CalculatedPrayerTimes {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60; // Local timezone offset in hours

  const jd = julian(year, month, day);
  const sun = sunPosition(jd);

  // Solar Noon (Dhuhr)
  const transit = 12 + timezoneOffsetHours - lng / 15.0 - sun.equationOfTime;

  // Sunrise and Sunset (approx -0.833° for refraction and sun radius)
  const sunriseSunAltitude = -0.8333;
  const sunH = hourAngle(sunriseSunAltitude, lat, sun.declination) / 15.0;
  const sunriseHour = transit - sunH;
  const sunsetHour = transit + sunH;

  const { fajrAngle, ishaAngle, ishaInterval } = getMethodAngles(method);

  // Fajr
  let fajrH = hourAngle(-fajrAngle, lat, sun.declination) / 15.0;
  // High latitude adjustment if needed
  if (highLatRule === 'ANGLE_BASED' && isNaN(fajrH)) {
    fajrH = (fajrAngle / 60.0) * (transit - sunriseHour);
  }
  let fajrHour = transit - fajrH;

  // Asr
  const shadowFactor = madhhab === 'HANAFI' ? 2 : 1;
  const asrAlt = r2d(Math.atan(1 / (shadowFactor + tanD(Math.abs(lat - sun.declination)))));
  const asrH = hourAngle(asrAlt, lat, sun.declination) / 15.0;
  const asrHour = transit + asrH;

  // Maghrib
  const maghribHour = sunsetHour;

  // Isha
  let ishaHour: number;
  if (ishaInterval) {
    ishaHour = maghribHour + ishaInterval / 60.0;
  } else {
    let ishaH = hourAngle(-ishaAngle, lat, sun.declination) / 15.0;
    if (highLatRule === 'ANGLE_BASED' && isNaN(ishaH)) {
      ishaH = (ishaAngle / 60.0) * (sunsetHour - transit);
    }
    ishaHour = transit + ishaH;
  }

  // Convert decimal hours to Date objects
  const toDate = (hours: number): Date => {
    const fixed = fixHour(hours);
    const d = new Date(year, month - 1, day);
    const h = Math.floor(fixed);
    const m = Math.floor((fixed - h) * 60);
    const s = Math.round(((fixed - h) * 60 - m) * 60);
    d.setHours(h, m, s, 0);
    return d;
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${year}-${pad(month)}-${pad(day)}`;

  return {
    date: dateStr,
    fajr: toDate(fajrHour),
    sunrise: toDate(sunriseHour),
    dhuhr: toDate(transit + 2 / 60), // Add 2 min safety for Dhuhr zawal
    asr: toDate(asrHour),
    maghrib: toDate(maghribHour + 2 / 60), // Add 2 min safety for Maghrib
    isha: toDate(ishaHour),
    hijriDate: calculateHijriDate(date),
  };
}

// Precise Algorithmic Hijri Date Converter (Kuwaiti algorithm)
export function calculateHijriDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  let bJD = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    bJD = jd + 1 + a - Math.floor(a / 4);
  } else {
    bJD = jd;
  }

  const bb = bJD + 1524;
  const cc = Math.floor((bb - 122.1) / 365.25);
  const dd = Math.floor(365.25 * cc);
  const ee = Math.floor((bb - dd) / 30.6001);

  const julianDay = bb - dd - Math.floor(30.6001 * ee);
  let epoch = jd - 1948440 + 10632;
  const n = Math.floor((epoch - 1) / 10631);
  epoch = epoch - 10631 * n + 354;
  const j = (Math.floor((10985 - epoch) / 5316)) * (Math.floor((50 * epoch) / 17719)) + (Math.floor(epoch / 5670)) * (Math.floor((43 * epoch) / 15238));
  epoch = epoch - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  
  const hMonth = Math.floor((24 * epoch) / 709);
  const hDay = epoch - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  const islamicMonthsEn = [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];

  const islamicMonthsAr = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const islamicMonthsSo = [
    'Muxarram', 'Safar', 'Rabii\'ul Awal', 'Rabii\'ul Aakhir',
    'Jumaadul Uulaa', 'Jumaadul Aakhira', 'Rajab', 'Shacbaan',
    'Ramadaan', 'Shawaal', 'Dul-Qacda', 'Dul-Xijja'
  ];

  const mIndex = Math.max(0, Math.min(11, hMonth - 1));

  return {
    day: Math.max(1, Math.min(30, hDay)),
    month: islamicMonthsEn[mIndex],
    monthArabic: islamicMonthsAr[mIndex],
    monthSomali: islamicMonthsSo[mIndex],
    year: hYear,
  };
}

// Calculate Next Prayer and Remaining Time
export function getNextPrayer(times: CalculatedPrayerTimes, now: Date = new Date()): NextPrayerInfo {
  const schedule: { name: PrayerName; time: Date }[] = [
    { name: 'fajr', time: times.fajr },
    { name: 'sunrise', time: times.sunrise },
    { name: 'dhuhr', time: times.dhuhr },
    { name: 'asr', time: times.asr },
    { name: 'maghrib', time: times.maghrib },
    { name: 'isha', time: times.isha },
  ];

  const currentMs = now.getTime();

  // Check if we are currently within prayer time window (up to 30 mins after prayer starts)
  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    if (item.name === 'sunrise') continue; // Sunrise is not an obligatory prayer
    const prayerMs = item.time.getTime();
    const diff = currentMs - prayerMs;
    // If prayer started between 0 and 20 mins ago, it is ONGOING
    if (diff >= 0 && diff < 20 * 60 * 1000) {
      const remainingSeconds = Math.max(0, Math.floor((20 * 60 * 1000 - diff) / 1000));
      return {
        name: item.name,
        time: item.time,
        timeString: formatTime(item.time, false),
        timeRemainingSeconds: remainingSeconds,
        isOngoingPrayer: true,
      };
    }
  }

  // Find next upcoming prayer
  for (const item of schedule) {
    if (item.time.getTime() > currentMs) {
      const remainingSeconds = Math.floor((item.time.getTime() - currentMs) / 1000);
      return {
        name: item.name,
        time: item.time,
        timeString: formatTime(item.time, false),
        timeRemainingSeconds: remainingSeconds,
        isOngoingPrayer: false,
      };
    }
  }

  // If past Isha, next prayer is tomorrow's Fajr
  const tomorrowFajr = new Date(times.fajr.getTime() + 24 * 60 * 60 * 1000);
  const remainingSeconds = Math.floor((tomorrowFajr.getTime() - currentMs) / 1000);
  return {
    name: 'fajr',
    time: tomorrowFajr,
    timeString: formatTime(tomorrowFajr, false),
    timeRemainingSeconds: remainingSeconds,
    isOngoingPrayer: false,
  };
}

// Calculate Qibla Bearing from anywhere in the world towards Kaaba (21.4225° N, 39.8262° E)
export function calculateQibla(latitude: number, longitude: number): { bearing: number; distanceKm: number } {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const lat1 = d2r(latitude);
  const lat2 = d2r(kaabaLat);
  const deltaLng = d2r(kaabaLng - longitude);

  const y = Math.sin(deltaLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLng);
  let qiblaBearing = r2d(Math.atan2(y, x));
  qiblaBearing = (qiblaBearing + 360) % 360;

  // Haversine formula for distance in km
  const R = 6371; // Earth's radius in km
  const deltaLat = lat2 - lat1;
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return {
    bearing: Math.round(qiblaBearing * 10) / 10,
    distanceKm,
  };
}

export function formatTime(date: Date, is12h: boolean = false): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (is12h) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    return `${pad(hours)}:${pad(minutes)} ${ampm}`;
  }

  return `${pad(hours)}:${pad(minutes)}`;
}

export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}
