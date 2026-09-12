import React, { useState } from 'react';
import { TabType, Language, HealthCentre, MedicalRecordItem } from './types';
import { TopNav } from './components/TopNav';
import { SideNav } from './components/SideNav';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { FindCentresView } from './components/FindCentresView';
import { BookingsView } from './components/BookingsView';
import { RecordsView } from './components/RecordsView';
import { EmergencyView } from './components/EmergencyView';
import { DigitalTriageModal } from './components/DigitalTriageModal';
import { ReportDetailModal, EmergencyCallModal, NotificationsDrawer, ProfileModal } from './components/Modals';
import { INITIAL_RECORDS } from './data/mockData';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedFacilityForBooking, setSelectedFacilityForBooking] = useState<HealthCentre | null>(null);
  const [initialBookingsSubTab, setInitialBookingsSubTab] = useState<'book' | 'queue'>('book');
  const [initialCentresFilter, setInitialCentresFilter] = useState<string | undefined>(undefined);

  // Modals state
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [activeReportRecord, setActiveReportRecord] = useState<MedicalRecordItem | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [emergencyCallData, setEmergencyCallData] = useState<{ isOpen: boolean; number: string; service: string }>({
    isOpen: false,
    number: '108',
    service: 'Emergency Ambulance Service'
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleNavigate = (tab: TabType, extra?: string) => {
    if (tab === 'bookings' && extra === 'queue') {
      setInitialBookingsSubTab('queue');
    } else if (tab === 'bookings') {
      setInitialBookingsSubTab('book');
    }

    if (tab === 'find-centres' && extra === 'medicine') {
      setInitialCentresFilter('medicine');
    } else {
      setInitialCentresFilter(undefined);
    }

    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEmergencyCall = (number = '108', service = 'Emergency Ambulance Service') => {
    setEmergencyCallData({ isOpen: true, number, service });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Header */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        language={language}
        onSelectLanguage={(lang) => {
          setLanguage(lang);
          showToast(`Language switched to ${lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी (Hindi)' : 'বাংলা (Bengali)'}`);
        }}
        unreadCount={2}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        {/* Desktop Side Navigation */}
        <SideNav
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          onEmergencyCall={() => handleOpenEmergencyCall('108', 'Emergency Ambulance Service')}
          onOpenSettings={() => showToast('Swasthya Rekha Preferences: Notifications enabled, Low-data mode active.')}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:pl-72 pb-24 md:pb-12 max-w-full overflow-x-hidden">
          {/* Global Toast Notification */}
          {toastMessage && (
            <div className="mb-6 p-3.5 bg-primary text-white text-xs font-semibold rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">info</span>
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/20 rounded">
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
          )}

          {/* View Routing */}
          {currentTab === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              onOpenRecordModal={(recordId) => {
                const rec = INITIAL_RECORDS.find((r) => r.id === recordId) || INITIAL_RECORDS[0];
                setActiveReportRecord(rec);
              }}
              onOpenRescheduleModal={() => {
                showToast('Follow-up request sent to ASHA Worker Sunita Devi.');
              }}
            />
          )}

          {currentTab === 'find-centres' && (
            <FindCentresView
              onNavigate={handleNavigate}
              onSelectFacilityForBooking={(facility) => {
                setSelectedFacilityForBooking(facility);
                setInitialBookingsSubTab('book');
              }}
              onOpenTriage={() => setIsTriageOpen(true)}
              initialFilter={initialCentresFilter}
            />
          )}

          {currentTab === 'bookings' && (
            <BookingsView
              initialSubTab={initialBookingsSubTab}
              selectedFacility={selectedFacilityForBooking}
              onNavigateToRecords={() => setCurrentTab('records')}
            />
          )}

          {currentTab === 'records' && (
            <RecordsView
              onOpenReportModal={(record) => setActiveReportRecord(record)}
            />
          )}

          {currentTab === 'emergency' && (
            <EmergencyView
              onNavigateToFindCentres={() => setCurrentTab('find-centres')}
              onOpenEmergencyCallModal={handleOpenEmergencyCall}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleNavigate}
      />

      {/* Global Modals */}
      <DigitalTriageModal
        isOpen={isTriageOpen}
        onClose={() => setIsTriageOpen(false)}
        onNavigate={handleNavigate}
        onEmergencyCall={() => {
          setIsTriageOpen(false);
          handleOpenEmergencyCall('108', 'Emergency Ambulance Service');
        }}
      />

      <ReportDetailModal
        record={activeReportRecord}
        onClose={() => setActiveReportRecord(null)}
      />

      <EmergencyCallModal
        isOpen={emergencyCallData.isOpen}
        number={emergencyCallData.number}
        serviceName={emergencyCallData.service}
        onClose={() => setEmergencyCallData((d) => ({ ...d, isOpen: false }))}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectTab={handleNavigate}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default App;
