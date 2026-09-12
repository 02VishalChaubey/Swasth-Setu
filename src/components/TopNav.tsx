import React, { useState } from 'react';
import { TabType, Language } from '../types';
import { Bell, Globe, User, Check, X, PhoneCall } from 'lucide-react';

interface TopNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  onSelectLanguage,
  unreadCount,
  onOpenNotifications,
  onOpenProfile
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const langNames: Record<Language, string> = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    bn: 'বাংলা (Bengali)'
  };

  const navItems: { tab: TabType; label: string; isEmergency?: boolean }[] = [
    { tab: 'home', label: 'Home' },
    { tab: 'find-centres', label: 'Find Centres' },
    { tab: 'bookings', label: 'Bookings' },
    { tab: 'records', label: 'Records' },
    { tab: 'emergency', label: 'Emergency', isEmergency: true },
  ];

  return (
    <header className="bg-surface text-primary border-b border-outline-variant shadow-sm sticky top-0 z-50 w-full">
      <div className="hidden md:flex justify-between items-center w-full px-6 lg:px-12 py-3.5 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 text-left focus:outline-none group"
            id="brand-logo-btn"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="material-symbols-outlined text-xl fill">local_hospital</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-primary">Swasthya Rekha</span>
              <span className="hidden xl:inline-block ml-2 px-2 py-0.5 text-xs bg-primary-fixed text-on-primary-fixed rounded-full font-medium">
                Rural Health Portal
              </span>
            </div>
          </button>

          <nav className="flex items-center gap-2 lg:gap-4">
            {navItems.map((item) => {
              const isActive = currentTab === item.tab;
              if (item.isEmergency) {
                return (
                  <button
                    key={item.tab}
                    onClick={() => onSelectTab(item.tab)}
                    className={`font-semibold text-sm px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'text-error font-bold border-b-2 border-error bg-error-container/40'
                        : 'text-error hover:bg-error-container/30'
                    }`}
                    id={`nav-${item.tab}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">emergency</span>
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.tab}
                  onClick={() => onSelectTab(item.tab)}
                  className={`font-semibold text-sm px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-primary font-bold border-b-2 border-primary pb-1'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                  }`}
                  id={`nav-${item.tab}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high px-3 py-1.5 rounded-lg transition-all border border-outline-variant/60"
              id="language-selector-btn"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span>{langNames[language].split(' ')[0]}</span>
              <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
            </button>

            {langMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant py-2 z-50 animate-in fade-in slide-in-from-top-1"
                id="language-menu-dropdown"
              >
                {(['en', 'hi', 'bn'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onSelectLanguage(lang);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-surface-container-high transition-colors ${
                      language === lang ? 'text-primary font-bold bg-primary-fixed/40' : 'text-on-surface'
                    }`}
                  >
                    <span>{langNames[lang]}</span>
                    {language === lang && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant relative"
            title="Notifications"
            id="notifications-bell-btn"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface"></span>
            )}
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="p-1.5 rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant flex items-center gap-2 pl-2 pr-3 bg-surface-container-low border border-outline-variant/40"
            id="user-profile-btn"
          >
            <div className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
              RK
            </div>
            <span className="text-xs font-semibold text-on-surface hidden lg:inline-block">Rajesh K.</span>
          </button>
        </div>
      </div>
    </header>
  );
};
