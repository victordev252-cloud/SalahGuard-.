import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Volume2, Moon } from 'lucide-react';

interface AndroidStatusBarProps {
  isFocusMode?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ isFocusMode = false }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-medium tracking-tight select-none transition-colors ${
        isFocusMode ? 'bg-[#080d17] text-slate-400' : 'bg-[#0b111e] text-slate-300'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-semibold tracking-normal text-slate-200">{timeStr || '12:00'}</span>
        {isFocusMode && (
          <span className="flex items-center text-amber-400/80 gap-0.5 text-[9px] px-1 bg-amber-500/10 rounded">
            <Moon className="w-2.5 h-2.5" />
            <span>DND</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Volume2 className="w-3 h-3 text-slate-400" />
        <Wifi className="w-3 h-3 text-slate-300" />
        <Signal className="w-3 h-3 text-slate-300" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] text-slate-300">94%</span>
          <div className="w-4 h-2 border border-slate-300 rounded-[2px] p-[1px] flex items-center">
            <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
