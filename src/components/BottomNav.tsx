import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const items: { tab: TabType; label: string; icon: string; isSOS?: boolean }[] = [
    { tab: 'home', label: 'Home', icon: 'home' },
    { tab: 'find-centres', label: 'Find', icon: 'search' },
    { tab: 'bookings', label: 'Bookings', icon: 'event' },
    { tab: 'records', label: 'Records', icon: 'folder_shared' },
    { tab: 'emergency', label: 'SOS', icon: 'emergency', isSOS: true },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 pb-safe bg-surface shadow-[0_-2px_12px_rgba(0,40,142,0.08)] border-t border-outline-variant/30 rounded-t-2xl z-50 touch-manipulation"
      id="mobile-bottom-nav"
    >
      {items.map((item) => {
        const isActive = currentTab === item.tab;

        if (item.isSOS) {
          return (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isActive ? 'bg-error-container text-error font-bold scale-105' : 'text-error hover:bg-error-container/30'
              }`}
              id={`bottom-nav-${item.tab}`}
            >
              <span className="material-symbols-outlined text-2xl fill">emergency</span>
              <span className="text-[11px] font-bold mt-0.5">SOS</span>
            </button>
          );
        }

        return (
          <button
            key={item.tab}
            onClick={() => onSelectTab(item.tab)}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
              isActive
                ? 'bg-primary-container text-white font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            id={`bottom-nav-${item.tab}`}
          >
            <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
