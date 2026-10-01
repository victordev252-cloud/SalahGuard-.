import React, { useState, useEffect } from 'react';
import { Compass, X, AlertCircle, Navigation, Info } from 'lucide-react';
import { UserProfile } from '../types';
import { getTranslation } from '../utils/i18n';
import { calculateQibla } from '../utils/prayerEngine';

interface QiblaModalProps {
  userProfile: UserProfile;
  onClose: () => void;
}

export const QiblaModal: React.FC<QiblaModalProps> = ({ userProfile, onClose }) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState<boolean>(false);
  const t = getTranslation(userProfile.language);

  const { bearing, distanceKm } = calculateQibla(userProfile.latitude, userProfile.longitude);

  useEffect(() => {
    // Listen for device orientation on Android / mobile devices
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Android uses event.alpha; webkitCompassHeading on iOS
      let heading: number | null = null;
      if ('webkitCompassHeading' in event && typeof (event as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
        heading = (event as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (event.alpha !== null) {
        heading = (360 - event.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
        setSensorAvailable(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  // Compass needle rotation: if sensor available, rotate relative to heading
  const needleRotation = deviceHeading !== null ? bearing - deviceHeading : bearing;

  return (
    <div className="fixed inset-0 z-50 bg-[#070c16]/95 backdrop-blur-md text-slate-100 flex flex-col justify-between p-6 select-none overflow-y-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400" />
            <span>{t.qiblaTitle}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {userProfile.city} ({userProfile.latitude.toFixed(2)}°, {userProfile.longitude.toFixed(2)}°)
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-400 hover:text-slate-200 bg-[#101726] border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Dial */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-8">
        <div className="relative w-64 h-64 rounded-full bg-[#0d1522] border-4 border-slate-800 flex items-center justify-center shadow-2xl shadow-black/80">
          {/* Degree markers */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="absolute top-2 text-[10px] font-mono font-bold text-slate-400">N (0°)</span>
            <span className="absolute right-3 text-[10px] font-mono font-bold text-slate-500">E (90°)</span>
            <span className="absolute bottom-2 text-[10px] font-mono font-bold text-slate-500">S (180°)</span>
            <span className="absolute left-3 text-[10px] font-mono font-bold text-slate-500">W (270°)</span>
          </div>

          {/* Compass Needle pointing to Qibla */}
          <div
            className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${needleRotation}deg)` }}
          >
            {/* Kaaba Golden Needle */}
            <div className="w-3 h-24 bg-gradient-to-t from-transparent via-amber-400 to-amber-300 rounded-t-full flex items-start justify-center -translate-y-12">
              <span className="text-xs -translate-y-4">🕋</span>
            </div>
            {/* South Tail */}
            <div className="w-1.5 h-16 bg-slate-700/80 rounded-b-full translate-y-10" />
          </div>

          {/* Center Hub */}
          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center z-10 shadow">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
        </div>

        {/* Bearing readout */}
        <div className="mt-8 text-center">
          <div className="text-3xl font-mono font-extrabold text-white">
            {bearing}°
          </div>
          <div className="text-xs text-amber-300 font-medium mt-0.5">
            {t.qiblaTowardsMakkah}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            {t.distanceToMakkah}: <span className="text-slate-200 font-semibold">{distanceKm.toLocaleString()} km</span>
          </div>
        </div>
      </div>

      {/* Sensor Status / Android guidance */}
      <div className="p-3.5 bg-[#101726] border border-slate-800 rounded-2xl text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-medium">
          {sensorAvailable ? (
            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {t.sensorActive} ({deviceHeading}° heading)
            </span>
          ) : (
            <span className="text-amber-400/90 flex items-center gap-1 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              Sensor Notice
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {sensorAvailable ? t.rotatePhoneGuidance : t.sensorUnavailable}
        </p>
      </div>
    </div>
  );
};
