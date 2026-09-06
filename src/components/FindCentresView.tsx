import React, { useState } from 'react';
import { HealthCentre, TabType } from '../types';
import { HEALTH_CENTRES, MAP_IMAGE } from '../data/mockData';

interface FindCentresViewProps {
  onNavigate: (tab: TabType, extra?: string) => void;
  onSelectFacilityForBooking: (facility: HealthCentre) => void;
  onOpenTriage: () => void;
  initialFilter?: string;
}

export const FindCentresView: React.FC<FindCentresViewProps> = ({
  onNavigate,
  onSelectFacilityForBooking,
  onOpenTriage,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openNowOnly, setOpenNowOnly] = useState(true);
  const [medicinesStockedOnly, setMedicinesStockedOnly] = useState(initialFilter === 'medicine');
  const [selectedFacilityType, setSelectedFacilityType] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [activeCentre, setActiveCentre] = useState<HealthCentre>(HEALTH_CENTRES[0]);
  const [detailsModalCentre, setDetailsModalCentre] = useState<HealthCentre | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [directionsToast, setDirectionsToast] = useState<string | null>(null);

  const filteredCentres = HEALTH_CENTRES.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (medicinesStockedOnly && c.medicineStatus !== 'stocked') {
      return false;
    }
    if (selectedFacilityType !== 'All') {
      if (selectedFacilityType === 'Hospital' && !c.name.includes('Hospital')) return false;
      if (selectedFacilityType === 'PHC' && !c.name.includes('Primary Health Centre')) return false;
    }
    if (selectedSpecialty !== 'All') {
      if (!c.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))) return false;
    }
    return true;
  });

  const handleGetDirections = (centre: HealthCentre) => {
    setDirectionsToast(`Directions to ${centre.name}: Approx. ${centre.distance} via Grand Trunk Rd.`);
    setTimeout(() => setDirectionsToast(null), 4000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      {/* Left Column: Search & Results */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Digital Triage Banner */}
        <div className="bg-primary-fixed/40 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">stethoscope</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary">Unsure which centre to visit?</h3>
              <p className="text-xs text-on-surface-variant">Check your symptoms with our guided digital triage assistant.</p>
            </div>
          </div>
          <button
            onClick={onOpenTriage}
            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm self-stretch sm:self-auto justify-center"
            id="open-triage-btn"
          >
            <span>Start Symptom Check</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Search & Filters Card */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-5 flex flex-col gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location (e.g., Salt Lake, Howrah)..."
              className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              id="centre-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Facility Type Selector */}
            <div className="relative">
              <select
                value={selectedFacilityType}
                onChange={(e) => setSelectedFacilityType(e.target.value)}
                className="appearance-none px-3.5 py-2 pr-7 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer focus:outline-none"
              >
                <option value="All">Facility Type: All</option>
                <option value="Hospital">Hospitals</option>
                <option value="PHC">Primary Health Centres</option>
              </select>
              <span className="material-symbols-outlined text-xs pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
                arrow_drop_down
              </span>
            </div>

            {/* Specialization Selector */}
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none px-3.5 py-2 pr-7 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer focus:outline-none"
              >
                <option value="All">Specialization: All</option>
                <option value="General">General Medicine</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
              <span className="material-symbols-outlined text-xs pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
                arrow_drop_down
              </span>
            </div>

            {/* Open Now toggle */}
            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                openNowOnly
                  ? 'bg-primary-container text-white border border-primary shadow-sm'
                  : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span>Open Now</span>
              {openNowOnly && <span className="material-symbols-outlined text-sm">check</span>}
            </button>

            {/* Medicines Available toggle */}
            <button
              onClick={() => setMedicinesStockedOnly(!medicinesStockedOnly)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                medicinesStockedOnly
                  ? 'bg-primary-container text-white border border-primary shadow-sm'
                  : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-sm">medication</span>
              <span>Medicines Available</span>
              {medicinesStockedOnly && <span className="material-symbols-outlined text-sm">check</span>}
            </button>
          </div>
        </section>

        {/* Directions toast */}
        {directionsToast && (
          <div className="bg-primary text-white p-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-md animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">directions</span>
              <span>{directionsToast}</span>
            </div>
            <button onClick={() => setDirectionsToast(null)} className="p-1 hover:bg-white/20 rounded">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Results List */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Nearby Health Centres</h2>
            <span className="text-xs text-on-surface-variant font-medium">
              Showing {filteredCentres.length} facilities
            </span>
          </div>

          {filteredCentres.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                location_off
              </span>
              <p className="text-sm font-semibold text-on-surface">No matching health centres found</p>
              <p className="text-xs text-on-surface-variant mt-1">Try clearing some filters or search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFacilityType('All');
                  setSelectedSpecialty('All');
                  setMedicinesStockedOnly(false);
                }}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredCentres.map((centre) => {
              const isSelected = activeCentre.id === centre.id;
              return (
                <article
                  key={centre.id}
                  onClick={() => setActiveCentre(centre)}
                  className={`bg-surface-container-lowest rounded-2xl p-5 md:p-6 border transition-all ${
                    isSelected
                      ? 'border-primary shadow-md ring-1 ring-primary/30'
                      : 'border-outline-variant shadow-sm hover:shadow-md'
                  }`}
                  id={`centre-card-${centre.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">{centre.name}</h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                        {centre.address} • <strong className="text-primary">{centre.distance}</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/40">
                      <span className="material-symbols-outlined text-primary text-[16px] fill">star</span>
                      <span className="text-xs font-bold text-on-surface">{centre.rating}</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 my-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      centre.queueSeverity === 'short'
                        ? 'bg-[#e8f5e9] text-[#1b5e20]'
                        : 'bg-[#fff3e0] text-[#e65100]'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {centre.queueStatus}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      centre.medicineStatus === 'stocked'
                        ? 'bg-[#e3f2fd] text-[#0d47a1]'
                        : 'bg-[#ffebee] text-[#b71c1c]'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {centre.medicineStatus === 'stocked' ? 'medication' : 'warning'}
                      </span>
                      {centre.medicineStock}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant mb-4">
                    {centre.specialistsCount} Specialists available • {centre.specialties.join(', ')}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2.5 pt-3 border-t border-outline-variant">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailsModalCentre(centre);
                      }}
                      className="flex-1 px-4 py-2 border border-primary text-primary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFacilityForBooking(centre);
                        onNavigate('bookings');
                      }}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-sm"
                    >
                      Book Appointment
                    </button>
                    <button
                      aria-label="Get Directions"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(centre);
                      }}
                      className="p-2 bg-surface-container text-on-surface rounded-xl hover:bg-surface-container-highest transition-colors"
                      title="Get Directions"
                    >
                      <span className="material-symbols-outlined text-lg">directions</span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>

      {/* Right Column: Interactive Map Panel (Desktop) */}
      <aside className="hidden lg:block w-96 shrink-0 sticky top-24 h-[calc(100vh-120px)]">
        <div className="w-full h-full bg-surface-container-highest rounded-3xl border border-outline-variant overflow-hidden relative shadow-sm flex flex-col">
          {/* Map Header */}
          <div className="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-3 border-b border-outline-variant flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">map</span>
              <span className="text-xs font-bold text-on-surface">Kolkata & Howrah District Map</span>
            </div>
            <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">
              Live GPS
            </span>
          </div>

          {/* Map Canvas with Hotlinked Image & Pins */}
          <div className="relative flex-1 overflow-hidden bg-[#eaf1ff]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
              style={{
                backgroundImage: `url('${MAP_IMAGE}')`,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            ></div>

            {/* Selected Centre Overlay Card at Bottom */}
            <div className="absolute left-3 right-3 bottom-16 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-2xl border border-outline-variant shadow-lg z-10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Selected Facility</span>
                  <h4 className="text-sm font-bold text-on-surface">{activeCentre.name}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{activeCentre.address}</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-md">
                  {activeCentre.distance}
                </span>
              </div>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => {
                    onSelectFacilityForBooking(activeCentre);
                    onNavigate('bookings');
                  }}
                  className="flex-1 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container text-center"
                >
                  Book Slot
                </button>
                <button
                  onClick={() => handleGetDirections(activeCentre)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-variant flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">navigation</span>
                  Route
                </button>
              </div>
            </div>

            {/* Floating Map Controls */}
            <div className="absolute right-4 bottom-4 flex flex-col gap-1.5 z-20">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                className="w-9 h-9 bg-surface-container-lowest rounded-xl shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-base">add</span>
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.8))}
                className="w-9 h-9 bg-surface-container-lowest rounded-xl shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-base">remove</span>
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="w-9 h-9 bg-surface-container-lowest rounded-xl shadow-md flex items-center justify-center text-primary mt-1 hover:bg-surface-container-high transition-colors"
                title="Reset to My Location"
              >
                <span className="material-symbols-outlined text-base">my_location</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Facility Details Modal */}
      {detailsModalCentre && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Health Centre Details</span>
                <h3 className="text-xl font-bold text-on-surface">{detailsModalCentre.name}</h3>
                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                  {detailsModalCentre.address} ({detailsModalCentre.distance} away)
                </p>
              </div>
              <button
                onClick={() => setDetailsModalCentre(null)}
                className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium">Operating Hours:</span>
                <span className="font-bold text-on-surface">{detailsModalCentre.openHours}</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium">Helpline / Reception:</span>
                <span className="font-bold text-primary">{detailsModalCentre.phone}</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium">Current Queue Wait:</span>
                <span className="font-bold text-secondary">{detailsModalCentre.queueWaitTime}</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1">
                <span className="text-on-surface-variant font-medium block">Available Specialties:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {detailsModalCentre.specialties.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-surface-container-high rounded-full font-semibold text-on-surface">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-outline-variant">
              <button
                onClick={() => setDetailsModalCentre(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface-container-high"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectFacilityForBooking(detailsModalCentre);
                  setDetailsModalCentre(null);
                  onNavigate('bookings');
                }}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shadow-sm"
              >
                Book Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
