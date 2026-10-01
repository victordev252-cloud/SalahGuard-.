import React from 'react';
import { Home, Clock, Calendar, Sparkles, Settings } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';

export type NavTab = 'home' | 'prayers' | 'history' | 'dhikr' | 'settings';

interface AndroidNavBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  currentTab,
  onSelectTab,
  language,
}) => {
  const t = getTranslation(language);

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'prayers', label: t.navPrayers, icon: Clock },
    { id: 'history', label: t.navHistory, icon: Calendar },
    { id: 'dhikr', label: t.navDhikr, icon: Sparkles },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a101b]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1 max-w-md mx-auto select-none">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-amber-500/15' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
