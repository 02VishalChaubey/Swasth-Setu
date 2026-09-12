import React from 'react';
import { TabType } from '../types';

interface SideNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onEmergencyCall: () => void;
  onOpenSettings: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  currentTab,
  onSelectTab,
  onEmergencyCall,
  onOpenSettings,
}) => {
  const navItems = [
    { tab: 'home' as TabType, label: 'Home', icon: 'home' },
    { tab: 'find-centres' as TabType, label: 'Find Centres', icon: 'location_on' },
    { tab: 'bookings' as TabType, label: 'Bookings', icon: 'calendar_month' },
    { tab: 'records' as TabType, label: 'Records', icon: 'description' },
    { tab: 'emergency' as TabType, label: 'Emergency', icon: 'medical_services', isEmergency: true },
  ];

  return (
    <aside 
      className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-surface-container-low border-r border-outline-variant p-6 gap-2 z-40 pt-20"
      id="desktop-side-nav"
    >
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
            <span className="material-symbols-outlined text-lg fill">local_hospital</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary tracking-tight">Swasthya Rekha</h2>
            <p className="text-xs text-on-surface-variant font-medium">Rural Health Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          if (item.isEmergency) {
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all text-left ${
                  isActive
                    ? 'bg-error text-white shadow-sm'
                    : 'text-error hover:bg-error-container/40'
                }`}
                id={`side-nav-${item.tab}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill' : ''}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          }

          return (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all text-left ${
                isActive
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'
              }`}
              id={`side-nav-${item.tab}`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill' : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1.5 border-t border-outline-variant pt-4">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant rounded-xl text-sm font-medium transition-colors text-left"
          id="side-nav-settings"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Settings
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to log out of your Swasthya Rekha session?')) {
              window.location.reload();
            }
          }}
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant rounded-xl text-sm font-medium transition-colors text-left"
          id="side-nav-logout"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Logout
        </button>

        <button
          onClick={onEmergencyCall}
          className="mt-2 w-full bg-error text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#a01616] transition-colors shadow-md active:scale-98"
          id="side-nav-emergency-call"
        >
          <span className="material-symbols-outlined text-[20px] fill">emergency</span>
          Emergency Call
        </button>
      </div>
    </aside>
  );
};
