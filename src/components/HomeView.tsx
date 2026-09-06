import React, { useState } from 'react';
import { TabType } from '../types';
import { HERO_IMAGE } from '../data/mockData';

interface HomeViewProps {
  onNavigate: (tab: TabType, extra?: string) => void;
  onOpenRecordModal: (recordId: string) => void;
  onOpenRescheduleModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenRecordModal,
  onOpenRescheduleModal,
}) => {
  const [activeSubView, setActiveSubView] = useState<'dashboard' | 'portal'>('dashboard');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* View Switcher Pill to seamlessly view both screenshots */}
      <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant px-2 hidden sm:inline">
            Screen View:
          </span>
          <button
            onClick={() => setActiveSubView('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubView === 'dashboard'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            id="view-toggle-dashboard"
          >
            Patient Dashboard (Arjun)
          </button>
          <button
            onClick={() => setActiveSubView('portal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubView === 'portal'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            id="view-toggle-portal"
          >
            Portal Landing Overview
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-secondary font-medium px-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>PHC Network Live</span>
        </div>
      </div>

      {activeSubView === 'dashboard' ? (
        /* SCREEN 1: Patient Dashboard */
        <div className="space-y-8">
          {/* Greeting */}
          <section className="pt-2">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
              Good morning, Arjun.
            </h1>
            <p className="text-base text-on-surface-variant">
              Here is your health overview for today.
            </p>
          </section>

          {/* Status Overview (Bento Grid Style) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Card 1: Next Appointment */}
            <div 
              onClick={() => onNavigate('bookings')}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-surface-container-high rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">event_upcoming</span>
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-semibold">
                  Confirmed
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-on-surface-variant mb-1">Next Appointment</h3>
                <p className="text-xl font-bold text-on-surface">2:00 PM today</p>
                <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  Primary Health Centre, Village Ramgarh
                </p>
              </div>
            </div>

            {/* Card 2: Queue Status */}
            <div 
              onClick={() => onNavigate('bookings', 'queue')}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-surface-container-high rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>
                <span className="bg-surface-container text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                  Token #T-142
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-on-surface-variant mb-1">Queue Status</h3>
                <p className="text-xl font-bold text-on-surface">3 people ahead</p>
                <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                  Estimated wait: ~45 mins
                </p>
              </div>
            </div>

            {/* Card 3: New Record */}
            <div 
              onClick={() => onOpenRecordModal('rec-2')}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-surface-container-high rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">lab_profile</span>
                </div>
                <span className="bg-primary-container text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                  New
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-on-surface-variant mb-1">New Record</h3>
                <p className="text-xl font-bold text-on-surface">Blood Test</p>
                <button className="text-xs font-semibold text-primary mt-2 flex items-center gap-1 group-hover:underline">
                  View Results <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => onNavigate('bookings')}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low hover:border-primary transition-all shadow-sm min-h-[110px] group"
                id="quick-action-book"
              >
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px]">calendar_add_on</span>
                </div>
                <span className="text-sm font-semibold text-on-surface text-center">
                  Book<br />Appointment
                </span>
              </button>

              <button
                onClick={() => onNavigate('find-centres')}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low hover:border-primary transition-all shadow-sm min-h-[110px] group"
                id="quick-action-find"
              >
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px]">search</span>
                </div>
                <span className="text-sm font-semibold text-on-surface text-center">
                  Find<br />Centre
                </span>
              </button>

              <button
                onClick={() => onNavigate('records')}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low hover:border-primary transition-all shadow-sm min-h-[110px] group"
                id="quick-action-records"
              >
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px]">folder_open</span>
                </div>
                <span className="text-sm font-semibold text-on-surface text-center">
                  Health<br />Records
                </span>
              </button>

              <button
                onClick={() => onNavigate('emergency')}
                className="bg-error-container border border-error/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-error/15 transition-all shadow-sm min-h-[110px] group"
                id="quick-action-emergency"
              >
                <div className="p-2 rounded-xl bg-error/15 text-error group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px] fill">emergency</span>
                </div>
                <span className="text-sm font-bold text-on-error-container text-center">
                  Emergency<br />Help
                </span>
              </button>
            </div>
          </section>

          {/* Bottom 2-column: Recent Activity Timeline & Upcoming Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity Timeline */}
            <section className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center justify-between">
                <span>Recent Activity</span>
                <span className="text-xs font-normal text-on-surface-variant">Last 7 days</span>
              </h2>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-outline-variant before:via-outline-variant before:to-transparent">
                {/* Event 1 */}
                <div className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary-fixed text-primary shadow-sm shrink-0 z-10">
                    <span className="material-symbols-outlined text-[20px]">prescriptions</span>
                  </div>
                  <div 
                    onClick={() => onOpenRecordModal('rec-1')}
                    className="flex-1 p-4 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm hover:border-primary/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-bold text-on-surface">Prescription Added</div>
                      <time className="text-xs text-on-surface-variant font-medium">Yesterday</time>
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      Dr. Sharma added a new prescription for Paracetamol and Telmisartan.
                    </div>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-secondary-container text-on-secondary-container shadow-sm shrink-0 z-10">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  </div>
                  <div className="flex-1 p-4 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-bold text-on-surface">Appointment Completed</div>
                      <time className="text-xs text-on-surface-variant font-medium">Oct 12</time>
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      General Checkup at District Hospital. Vitals and ECG verified.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Upcoming Follow-up Highlight */}
            <section className="flex flex-col">
              <h2 className="text-xl font-bold text-on-surface mb-6">Upcoming Follow-up</h2>
              <div className="bg-primary text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg flex-1 flex flex-col justify-between">
                {/* Background Watermark */}
                <div className="absolute top-2 right-2 p-2 opacity-15 pointer-events-none">
                  <span className="material-symbols-outlined text-[110px]">vital_signs</span>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="inline-block bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    Reminder
                  </div>
                  <h3 className="text-2xl font-bold">Routine Blood Pressure Check</h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Scheduled with ASHA Worker Sunita Devi at your home / local wellness post.
                  </p>
                  
                  <div className="flex items-center gap-3 text-sm font-semibold bg-white/15 p-3 rounded-xl backdrop-blur-md w-max border border-white/20">
                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                    <span>Thursday, Oct 26 • 10:00 AM</span>
                  </div>
                </div>

                <div className="relative z-10 pt-6">
                  <button 
                    onClick={onOpenRescheduleModal}
                    className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-surface-container-lowest active:scale-95 transition-all"
                    id="reschedule-followup-btn"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        /* SCREEN 3: Portal Landing Overview */
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-low rounded-3xl p-6 md:p-10 shadow-sm border border-surface-variant">
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                Better healthcare, made simple.
              </h1>
              <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                Connect with nearby health centres, book appointments, manage medical records, and get timely support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onNavigate('find-centres')}
                  className="bg-primary text-white font-semibold text-sm py-3 px-6 rounded-full shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                  id="portal-find-healthcare-btn"
                >
                  <span className="material-symbols-outlined text-lg fill">search</span>
                  Find Healthcare
                </button>
                <button
                  onClick={() => onNavigate('bookings')}
                  className="bg-transparent border-2 border-primary text-primary font-semibold text-sm py-3 px-6 rounded-full hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
                  id="portal-book-appointment-btn"
                >
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  Book Appointment
                </button>
              </div>
            </div>

            <div className="flex-1 w-full h-64 md:h-80 rounded-2xl overflow-hidden relative shadow-md border border-surface-variant">
              <img
                src={HERO_IMAGE}
                alt="Doctor conducting health checkup with patient"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs">
                Accessible Health Services across Rural India
              </div>
            </div>
          </section>

          {/* Quick Actions 6-Card Grid */}
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <button
                onClick={() => onNavigate('find-centres')}
                className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-outline-variant hover:bg-surface-container-high hover:border-primary transition-all min-h-[130px] group"
              >
                <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-110 transition-transform">
                  local_hospital
                </span>
                <span className="font-semibold text-sm text-on-surface text-center">
                  Find Health Centre
                </span>
              </button>

              <button
                onClick={() => onNavigate('bookings')}
                className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-outline-variant hover:bg-surface-container-high hover:border-primary transition-all min-h-[130px] group"
              >
                <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-110 transition-transform">
                  event_available
                </span>
                <span className="font-semibold text-sm text-on-surface text-center">
                  Book Appointment
                </span>
              </button>

              <button
                onClick={() => onNavigate('records')}
                className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-outline-variant hover:bg-surface-container-high hover:border-primary transition-all min-h-[130px] group"
              >
                <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-110 transition-transform">
                  folder_shared
                </span>
                <span className="font-semibold text-sm text-on-surface text-center">
                  Medical Records
                </span>
              </button>

              <button
                onClick={() => onNavigate('bookings')}
                className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-outline-variant hover:bg-surface-container-high hover:border-primary transition-all min-h-[130px] group"
              >
                <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-110 transition-transform">
                  date_range
                </span>
                <span className="font-semibold text-sm text-on-surface text-center">
                  My Appointments
                </span>
              </button>

              <button
                onClick={() => onNavigate('bookings', 'queue')}
                className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-outline-variant hover:bg-surface-container-high hover:border-primary transition-all min-h-[130px] group"
              >
                <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-110 transition-transform">
                  moving
                </span>
                <span className="font-semibold text-sm text-on-surface text-center">
                  Track Referral
                </span>
              </button>

              <button
                onClick={() => onNavigate('find-centres', 'medicine')}
                className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-outline-variant hover:bg-surface-container-high hover:border-primary transition-all min-h-[130px] group"
              >
                <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-110 transition-transform">
                  medication
                </span>
                <span className="font-semibold text-sm text-on-surface text-center">
                  Medicine Availability
                </span>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
