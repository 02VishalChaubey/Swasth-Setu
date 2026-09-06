import React, { useState } from 'react';
import { Doctor, HealthCentre, QueueInfo } from '../types';
import { DOCTORS, HEALTH_CENTRES, INITIAL_QUEUE, REFERRAL_TIMELINE, ROUTE_MAP_IMAGE } from '../data/mockData';

interface BookingsViewProps {
  initialSubTab?: 'book' | 'queue';
  selectedFacility?: HealthCentre | null;
  onNavigateToRecords: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  initialSubTab = 'book',
  selectedFacility,
  onNavigateToRecords,
}) => {
  const [subTab, setSubTab] = useState<'book' | 'queue'>(initialSubTab);

  // Booking Flow State
  const [facility, setFacility] = useState<HealthCentre>(selectedFacility || HEALTH_CENTRES[1]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState<string>('Today, 14 Oct');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:00 AM');
  const [bookingStep, setBookingStep] = useState<number>(3);
  const [isBookedSuccess, setIsBookedSuccess] = useState<boolean>(false);
  const [bookedReference, setBookedReference] = useState<string>('');

  // Care Status State
  const [queueInfo, setQueueInfo] = useState<QueueInfo>(INITIAL_QUEUE);
  const [isNotified, setIsNotified] = useState<boolean>(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const dates = [
    { label: 'Today', date: '14 Oct', id: 'Today, 14 Oct' },
    { label: 'Tue', date: '15 Oct', id: 'Tue, 15 Oct' },
    { label: 'Wed', date: '16 Oct', id: 'Wed, 16 Oct' },
    { label: 'Thu', date: '17 Oct', id: 'Thu, 17 Oct' },
  ];

  const timeSlots = [
    { time: '09:00 AM', disabled: false },
    { time: '09:30 AM', disabled: false },
    { time: '10:00 AM', disabled: false },
    { time: '10:30 AM', disabled: true },
    { time: '11:00 AM', disabled: false },
    { time: '11:30 AM', disabled: false },
  ];

  const handleConfirmBooking = () => {
    const randomRef = `SS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
    setBookedReference(randomRef);
    setIsBookedSuccess(true);
  };

  const handleNotifyMe = () => {
    setIsNotified(true);
    setNotificationBanner('🔔 SMS alert registered for +91 98310 44921! You will receive a chime when your token is within 2 people.');
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Subtabs Switcher */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => {
            setSubTab('book');
            setIsBookedSuccess(false);
          }}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            subTab === 'book'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
          id="tab-book-appointment"
        >
          <span className="material-symbols-outlined text-lg">edit_calendar</span>
          Book Appointment
        </button>

        <button
          onClick={() => setSubTab('queue')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 relative ${
            subTab === 'queue'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
          id="tab-care-status"
        >
          <span className="material-symbols-outlined text-lg">moving</span>
          My Care Status
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
        </button>
      </div>

      {subTab === 'book' ? (
        /* SCREEN 8: Book Appointment */
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">Book Appointment</h1>
            <p className="text-sm text-on-surface-variant">Step 3 of 5: Doctor Selection</p>
          </div>

          {/* 5-Step Stepper Bar */}
          <div className="flex items-center justify-between max-w-2xl bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px]">✓</span>
              <span>Facility</span>
            </div>
            <div className="h-0.5 w-6 md:w-12 bg-primary"></div>

            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px]">✓</span>
              <span>Specialty</span>
            </div>
            <div className="h-0.5 w-6 md:w-12 bg-primary"></div>

            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <span className="w-6 h-6 rounded-full bg-primary-container text-white flex items-center justify-center text-[11px] ring-2 ring-primary-fixed">3</span>
              <span>Doctor</span>
            </div>
            <div className="h-0.5 w-6 md:w-12 bg-outline-variant"></div>

            <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
              <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[11px]">4</span>
              <span>Time</span>
            </div>
            <div className="h-0.5 w-6 md:w-12 bg-outline-variant"></div>

            <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
              <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[11px]">5</span>
              <span>Confirm</span>
            </div>
          </div>

          {isBookedSuccess ? (
            /* Booking Confirmation Screen */
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-secondary shadow-lg max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-4xl">task_alt</span>
              </div>

              <div>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                  Booking Confirmed
                </span>
                <h2 className="text-2xl font-bold text-on-surface mt-3">Appointment Scheduled!</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Reference ID: <strong className="text-primary font-mono text-sm">{bookedReference}</strong>
                </p>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl text-left text-xs space-y-2 border border-outline-variant/40">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Patient:</span>
                  <span className="font-bold text-on-surface">Rajesh Kumar (SS-8492-49)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Doctor:</span>
                  <span className="font-bold text-on-surface">{selectedDoctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Health Centre:</span>
                  <span className="font-bold text-on-surface">{facility.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Date & Time:</span>
                  <span className="font-bold text-primary">{selectedDate} • {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between border-t border-outline-variant/40 pt-2">
                  <span className="text-on-surface-variant">Consultation Fee:</span>
                  <span className="font-bold text-secondary">₹0 (Free Health Scheme)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setSubTab('queue')}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container shadow-sm"
                >
                  View in My Care Status
                </button>
                <button
                  onClick={() => setIsBookedSuccess(false)}
                  className="py-3 px-4 border border-outline-variant rounded-xl font-semibold text-xs hover:bg-surface-container-high"
                >
                  Book Another Visit
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2-Columns: Selection Steps */}
              <div className="lg:col-span-2 space-y-6">
                {/* Selected Facility Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-5 border border-outline-variant shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">local_hospital</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-on-surface">{facility.name}</h3>
                        <span className="w-2 h-2 rounded-full bg-green-500" title="Open Now"></span>
                      </div>
                      <p className="text-xs text-on-surface-variant">{facility.address}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const next = HEALTH_CENTRES.find((c) => c.id !== facility.id) || HEALTH_CENTRES[0];
                      setFacility(next);
                    }}
                    className="text-xs font-bold text-primary hover:underline px-3 py-1.5 rounded-lg hover:bg-surface-container-high border border-outline-variant/40"
                  >
                    Change
                  </button>
                </div>

                {/* Doctor Selection */}
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">
                    Select Available Doctor
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DOCTORS.slice(0, 2).map((doc) => {
                      const isSelected = selectedDoctor.id === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoctor(doc)}
                          className={`bg-surface-container-lowest rounded-2xl p-4 border cursor-pointer transition-all flex items-start gap-4 ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/40 shadow-md bg-primary-fixed/15'
                              : 'border-outline-variant hover:border-primary/50 shadow-sm'
                          }`}
                        >
                          <img
                            src={doc.imageUrl}
                            alt={doc.name}
                            className="w-16 h-16 rounded-xl object-cover border border-outline-variant/40 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-bold text-sm text-on-surface truncate">{doc.name}</h4>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-1 ${
                                isSelected ? 'border-primary bg-primary' : 'border-outline'
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                              </div>
                            </div>

                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {doc.specialty} • {doc.experience}
                            </p>

                            <div className="mt-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                doc.isAvailableToday
                                  ? 'bg-[#e8f5e9] text-[#1b5e20]'
                                  : 'bg-[#fff3e0] text-[#e65100]'
                              }`}>
                                {doc.availability}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Schedule Visit: Date and Time Slots */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                    Schedule Visit
                  </h3>

                  {/* Horizontal Date Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-2">Select Date</label>
                    <div className="grid grid-cols-4 gap-2">
                      {dates.map((d) => {
                        const isSelected = selectedDate === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setSelectedDate(d.id)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-surface text-on-surface border-outline-variant hover:bg-surface-container-high'
                            }`}
                          >
                            <span className="block text-[11px] font-medium opacity-80">{d.label}</span>
                            <span className="block text-xs font-bold mt-0.5">{d.date}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Morning Slots */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-2">Available Slots (Morning)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.time && !slot.disabled;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={slot.disabled}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                              slot.disabled
                                ? 'bg-surface-container text-outline border-outline-variant/30 cursor-not-allowed line-through opacity-60'
                                : isSelected
                                ? 'bg-primary text-white border-primary shadow-sm font-bold'
                                : 'bg-surface text-on-surface border-outline-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Booking Summary Card */}
              <div className="lg:col-span-1">
                <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm sticky top-24 space-y-5">
                  <h3 className="font-bold text-base text-on-surface pb-3 border-b border-outline-variant">
                    Booking Summary
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">Patient</span>
                      <p className="font-bold text-sm text-on-surface mt-0.5">Rahul Kumar</p>
                      <p className="text-[11px] text-on-surface-variant">ABHA ID: SS-8492-49</p>
                    </div>

                    <div>
                      <span className="text-on-surface-variant block">Doctor</span>
                      <p className="font-bold text-sm text-on-surface mt-0.5">{selectedDoctor.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{selectedDoctor.specialty}</p>
                    </div>

                    <div>
                      <span className="text-on-surface-variant block">Health Centre</span>
                      <p className="font-bold text-sm text-on-surface mt-0.5">{facility.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{facility.address}</p>
                    </div>

                    <div>
                      <span className="text-on-surface-variant block">Date & Time</span>
                      <p className="font-bold text-sm text-primary mt-0.5">
                        {selectedDate} • {selectedTimeSlot}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-outline-variant flex items-center justify-between">
                      <span className="font-medium text-on-surface-variant">Consultation Fee</span>
                      <span className="font-bold text-secondary text-sm">FREE (Govt. PHC)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-all shadow-md active:scale-98"
                    id="confirm-booking-btn"
                  >
                    Confirm Booking
                  </button>

                  <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
                    By booking, you agree to receive SMS updates about your appointment and token queue.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* SCREEN 5: My Care Status (Queue & Referral Tracker) */
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">My Care Status</h1>
            <p className="text-sm text-on-surface-variant">
              Live updates on your ongoing hospital visits, referrals, and queue positions.
            </p>
          </div>

          {notificationBanner && (
            <div className="bg-primary text-white p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md animate-in fade-in">
              <span>{notificationBanner}</span>
              <button onClick={() => setNotificationBanner(null)} className="p-1 hover:bg-white/20 rounded">
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 cols): Active Queue & Facility Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Active Queue Card */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Active Queue</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface bg-surface-container px-2.5 py-1 rounded-md">
                    Token #{queueInfo.tokenNumber}
                  </span>
                </div>

                {/* Big Bold Position Box */}
                <div className="bg-primary-fixed/40 border border-primary/20 rounded-2xl p-6 text-center">
                  <span className="text-xs font-bold text-on-primary-fixed uppercase tracking-wider">
                    YOUR POSITION
                  </span>
                  <div className="text-5xl md:text-6xl font-extrabold text-primary my-2 font-mono tracking-tight">
                    {queueInfo.position}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs font-semibold text-on-surface-variant mt-3 pt-3 border-t border-primary/10">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">group</span>
                      {queueInfo.peopleAhead} People Ahead
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                      ~{queueInfo.estimatedWaitMinutes} mins wait
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleNotifyMe}
                  disabled={isNotified}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isNotified
                      ? 'bg-secondary-container text-on-secondary-container border border-secondary cursor-default'
                      : 'bg-primary text-white hover:bg-primary-container shadow-sm'
                  }`}
                  id="queue-notify-btn"
                >
                  <span className="material-symbols-outlined text-base">
                    {isNotified ? 'notifications_active' : 'notification_add'}
                  </span>
                  {isNotified ? 'Notification Alert Enabled' : "Notify me when I'm next"}
                </button>

                <p className="text-[11px] text-on-surface-variant text-center">
                  Last updated 1 min ago • Auto-refreshing queue server
                </p>
              </div>

              {/* Facility Information Card */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-on-surface">Facility Information</h3>
                  <button
                    onClick={() => alert(`Directions mapped to ${queueInfo.facility}. Follow Hospital Block A signs.`)}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">directions</span>
                    Directions
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-on-surface text-sm">{queueInfo.facility}</p>
                  <p className="text-on-surface-variant">{queueInfo.department}</p>
                  <p className="text-on-surface-variant">Attending Doctor: <strong>{queueInfo.doctor}</strong></p>
                </div>

                {/* Directions Route Map Preview Image */}
                <div className="rounded-2xl overflow-hidden border border-outline-variant h-40 relative group">
                  <img
                    src={ROUTE_MAP_IMAGE}
                    alt="Hospital Directions Route Map"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-[11px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">navigation</span>
                      Follow signage for Block A • Elevator to 3rd Floor
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Referral Timeline */}
            <div className="lg:col-span-7">
              <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">Referral Timeline</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Cardiology referral from Ramgarh Primary Health Centre
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full">
                    Ref #REF-9921
                  </span>
                </div>

                {/* Interactive Stepper List */}
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:h-[85%] before:w-0.5 before:bg-outline-variant">
                  {REFERRAL_TIMELINE.map((item) => {
                    const isCompleted = item.status === 'completed';
                    const isActive = item.status === 'active';

                    return (
                      <div key={item.step} className="relative flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                            isCompleted
                              ? 'bg-secondary text-white ring-4 ring-surface-container-lowest'
                              : isActive
                              ? 'bg-primary text-white ring-4 ring-primary-fixed animate-pulse'
                              : 'bg-surface-container-high text-on-surface-variant ring-4 ring-surface-container-lowest'
                          }`}
                        >
                          {isCompleted ? '✓' : item.step}
                        </div>

                        <div className={`flex-1 p-4 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-primary-fixed/20 border-primary shadow-sm'
                            : 'bg-surface border-outline-variant/60'
                        }`}>
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-sm text-on-surface">{item.title}</h4>
                            <span className="text-xs text-on-surface-variant font-medium">{item.timestamp}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">{item.description}</p>
                          {item.extraInfo && (
                            <p className="text-xs font-semibold text-primary mt-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">info</span>
                              {item.extraInfo}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coordinator Help Footer */}
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-on-surface block">Have questions about this referral?</span>
                    <span className="text-on-surface-variant">District Coordinator: Sunita Roy</span>
                  </div>
                  <a
                    href="tel:+913326784400"
                    className="font-bold text-primary bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container-high transition-colors"
                  >
                    +91 33 2678 4400
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
