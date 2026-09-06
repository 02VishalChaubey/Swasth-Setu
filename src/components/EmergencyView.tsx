import React, { useState } from 'react';
import { TabType } from '../types';

interface EmergencyViewProps {
  onNavigateToFindCentres: () => void;
  onOpenEmergencyCallModal: (number: string, serviceName: string) => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  onNavigateToFindCentres,
  onOpenEmergencyCallModal,
}) => {
  const [copiedLocation, setCopiedLocation] = useState(false);

  const emergencyNumbers = [
    { name: 'Ambulance (National)', number: '108', icon: 'emergency', priority: true },
    { name: 'Police Control Room', number: '100', icon: 'local_police' },
    { name: 'National Emergency Helpline', number: '112', icon: 'support_agent' },
    { name: 'Women Helpline', number: '1091', icon: 'shield_person' },
    { name: 'Disaster Management', number: '1078', icon: 'warning' },
    { name: 'Childline Helpline', number: '1098', icon: 'child_care' },
    { name: 'National Health Helpline', number: '1075', icon: 'health_and_safety' },
  ];

  const firstAidGuides = [
    {
      title: 'Chest Pain / Heart Attack',
      icon: 'favorite',
      color: 'bg-error-container text-error',
      points: [
        'Call 108 immediately. Do not drive yourself.',
        'Sit upright comfortably to reduce strain on the heart.',
        'Chew a soluble Aspirin (300mg) if advised by emergency responder and not allergic.',
        'Loosen tight clothing around neck and waist.'
      ]
    },
    {
      title: 'Snake Bite',
      icon: 'pest_control',
      color: 'bg-amber-100 text-amber-800',
      points: [
        'Keep patient calm and still. Movement spreads venom faster.',
        'Immobilize the bitten limb with a splint at or slightly below heart level.',
        'DO NOT cut the wound, suck venom, or tie tight tourniquets.',
        'Transport immediately to the nearest PHC with Anti-Snake Venom (ASV).'
      ]
    },
    {
      title: 'Severe Burns',
      icon: 'local_fire_department',
      color: 'bg-orange-100 text-orange-800',
      points: [
        'Cool the burn immediately under gentle cool running water for 10-20 minutes.',
        'DO NOT use ice, butter, or toothpaste.',
        'Cover with a clean, dry, non-stick sterile dressing or clean cloth.',
        'Seek immediate medical care at hospital emergency.'
      ]
    },
    {
      title: 'Heatstroke / Dehydration',
      icon: 'sunny',
      color: 'bg-yellow-100 text-yellow-800',
      points: [
        'Move the person to a cool, shaded area immediately.',
        'Loosen clothes and sponge skin with cool water or damp cloths.',
        'Provide small sips of ORS (Oral Rehydration Solution) or cool water if conscious.',
        'If vomiting or unconscious, place in recovery position and call 108.'
      ]
    }
  ];

  const locationText = 'Village Ramgarh, Block 2, Howrah District, West Bengal 711101 (Lat: 22.5726° N, Long: 88.3639° E)';

  const handleCopyLocation = () => {
    navigator.clipboard?.writeText?.(locationText);
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* SCREEN 12: Emergency Hero Section */}
      <section className="bg-error text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>Emergency Assistance</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Immediate help is available.
          </h1>

          <p className="text-white/90 text-sm md:text-base leading-relaxed">
            If you or someone nearby is experiencing a life-threatening crisis, call emergency services immediately or locate the nearest emergency trauma hospital.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              onClick={() => onOpenEmergencyCallModal('108', 'Emergency Ambulance Service')}
              className="bg-white text-error font-extrabold text-sm px-7 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg hover:bg-surface-container-lowest active:scale-95 transition-all"
              id="call-ambulance-hero-btn"
            >
              <span className="material-symbols-outlined text-2xl fill">call</span>
              <span>Call Ambulance: Dial 108</span>
            </button>

            <button
              onClick={onNavigateToFindCentres}
              className="bg-error-container text-on-error-container font-bold text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white hover:text-error active:scale-95 transition-all border border-white/20"
              id="nearest-hospital-hero-btn"
            >
              <span className="material-symbols-outlined text-xl">near_me</span>
              <span>Nearest Hospital: Locate on Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2-Column: Important Numbers & Location */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Important Numbers */}
        <section className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Emergency Helpline Numbers</h2>
            <span className="text-xs text-on-surface-variant font-medium">Toll-Free • 24x7</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyNumbers.map((item) => (
              <div
                key={item.number}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  item.priority
                    ? 'bg-error-container/30 border-error/30'
                    : 'bg-surface border-outline-variant/60 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.priority ? 'bg-error text-white' : 'bg-primary-fixed text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{item.name}</h4>
                    <p className={`font-mono text-base font-bold ${item.priority ? 'text-error' : 'text-primary'}`}>
                      {item.number}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenEmergencyCallModal(item.number, item.name)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    item.priority
                      ? 'bg-error text-white hover:bg-[#a01616]'
                      : 'bg-surface-container-high text-primary hover:bg-primary hover:text-white'
                  }`}
                  title={`Call ${item.name}`}
                >
                  <span className="material-symbols-outlined text-base fill">call</span>
                  <span>Dial</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Right (5 cols): Current Location Card */}
        <section className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">my_location</span>
                <h3 className="font-bold text-base text-on-surface">Your Current Location</h3>
              </div>
              <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md font-bold">
                GPS Verified
              </span>
            </div>

            <p className="text-xs text-on-surface-variant mb-4">
              Share this exact address and coordinates when speaking to the 108 ambulance dispatcher.
            </p>

            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50 space-y-2">
              <p className="font-bold text-sm text-on-surface leading-snug">
                Village Ramgarh, Block 2
              </p>
              <p className="text-xs text-on-surface-variant">
                Howrah District, West Bengal - 711101
              </p>
              <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                <span>Coordinates:</span>
                <span className="font-bold text-primary">22.5726° N, 88.3639° E</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCopyLocation}
              className="flex-1 py-3 px-4 bg-surface border border-outline-variant rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">
                {copiedLocation ? 'check' : 'content_copy'}
              </span>
              <span>{copiedLocation ? 'Location Copied!' : 'Copy Location'}</span>
            </button>

            <button
              onClick={() => {
                alert(`Location dispatched to local emergency health responder network.`);
              }}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">share_location</span>
              <span>Share Location</span>
            </button>
          </div>
        </section>
      </div>

      {/* Quick First Aid Guide Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-on-surface">Emergency First Aid Guidance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {firstAidGuides.map((guide) => (
            <div
              key={guide.title}
              className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${guide.color}`}>
                  <span className="material-symbols-outlined text-xl">{guide.icon}</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface">{guide.title}</h3>
              </div>

              <ul className="space-y-1.5 text-xs text-on-surface-variant pl-2">
                {guide.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
