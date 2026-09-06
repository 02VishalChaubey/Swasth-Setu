import React, { useState } from 'react';
import { TabType } from '../types';

interface DigitalTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType, extra?: string) => void;
  onEmergencyCall: () => void;
}

export const DigitalTriageModal: React.FC<DigitalTriageModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onEmergencyCall,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Pain');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [duration, setDuration] = useState<string>('1-3 days');

  if (!isOpen) return null;

  const symptoms = [
    { id: 'Fever', label: 'Fever', icon: 'thermostat' },
    { id: 'Cough', label: 'Cough', icon: 'sick' },
    { id: 'Pain', label: 'Pain', icon: 'sentiment_dissatisfied' },
    { id: 'Breathing', label: 'Breathing', icon: 'pulmonology' },
    { id: 'Stomach', label: 'Stomach', icon: 'health_and_safety' },
    { id: 'Other', label: 'Other', icon: 'more_horiz' },
  ];

  const resetTriage = () => {
    setStep(1);
    setSelectedSymptom('Pain');
    setSeverity('moderate');
  };

  const isEmergencyResult = severity === 'severe' || selectedSymptom === 'Breathing';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-outline-variant/30 my-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
          title="Close Triage"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Guidance Disclaimer */}
        <div className="bg-surface-container-highest rounded-2xl p-4 mb-6 flex gap-3 items-start border border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
          <div>
            <h4 className="font-bold text-sm text-on-surface mb-0.5">Guidance Only</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              This tool helps you understand your symptoms. It is not a medical diagnosis and does not replace professional medical advice.
            </p>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-8 relative px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-surface-variant -z-0 rounded-full"></div>
          <div 
            className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-primary -z-0 rounded-full transition-all duration-300"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          ></div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-surface-container-lowest z-10 ${
            step >= 1 ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'
          }`}>
            1
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-surface-container-lowest z-10 ${
            step >= 2 ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'
          }`}>
            2
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-surface-container-lowest z-10 ${
            step >= 3 ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'
          }`}>
            3
          </div>
        </div>

        {/* STEP 1: Main Symptom */}
        {step === 1 && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-2xl font-bold text-on-surface mb-2 text-center">
              How can we help you today?
            </h2>
            <p className="text-center text-sm text-on-surface-variant mb-6">
              Select the main symptom you are experiencing.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {symptoms.map((symptom) => {
                const isSelected = selectedSymptom === symptom.id;
                return (
                  <button
                    key={symptom.id}
                    onClick={() => setSelectedSymptom(symptom.id)}
                    className={`rounded-2xl p-5 flex flex-col items-center gap-3 transition-all border text-center ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/40 ring-2 ring-primary shadow-sm'
                        : 'border-outline-variant/60 bg-surface hover:border-primary/50 hover:bg-surface-container-high'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-primary-fixed text-on-primary-fixed'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">{symptom.icon}</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface">{symptom.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end border-t border-outline-variant/30 pt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-primary text-white font-semibold text-sm px-8 py-3 rounded-full hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm"
              >
                Next
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Details & Severity */}
        {step === 2 && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-on-surface mb-1">
                Tell us about your {selectedSymptom.toLowerCase()}
              </h2>
              <p className="text-sm text-on-surface-variant">
                This helps us estimate urgency and suggest the right facility.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Severity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'mild', label: 'Mild', desc: 'Manageable at home' },
                    { id: 'moderate', label: 'Moderate', desc: 'Discomforting' },
                    { id: 'severe', label: 'Severe', desc: 'Intense or acute' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSeverity(lvl.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        severity === lvl.id
                          ? 'border-primary bg-primary-fixed/40 ring-2 ring-primary font-bold'
                          : 'border-outline-variant bg-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="text-sm font-semibold text-on-surface">{lvl.label}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  How long have you had this?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Less than 24 hours', '1-3 days', 'More than 1 week'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        duration === d
                          ? 'border-primary bg-primary text-white shadow-sm'
                          : 'border-outline-variant bg-surface text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface-variant">
                ⚠️ If you or the patient is experiencing chest pressure, sudden numbness, severe difficulty breathing, or uncontrollable bleeding, tap <strong>Emergency</strong> immediately.
              </div>
            </div>

            <div className="flex justify-between border-t border-outline-variant/30 pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-full border border-outline-variant text-sm font-medium hover:bg-surface-container-high text-on-surface"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-primary text-white font-semibold text-sm px-8 py-2.5 rounded-full hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm"
              >
                View Assessment
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Assessment Result (Matching Screenshot 4) */}
        {step === 3 && (
          <div className="animate-in fade-in duration-200">
            {isEmergencyResult ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto ring-8 ring-error-container/30 animate-pulse">
                  <span className="material-symbols-outlined text-[44px] fill">emergency</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-error mb-2">
                    Emergency (Go to Hospital Now)
                  </h2>
                  <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Based on your answers, you may need immediate medical attention. Please do not wait.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
                  <button
                    onClick={() => {
                      onClose();
                      onEmergencyCall();
                    }}
                    className="bg-error text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#a01616] transition-colors shadow-md"
                  >
                    <span className="material-symbols-outlined text-xl fill">call</span>
                    Call Ambulance (108)
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('find-centres');
                    }}
                    className="bg-surface border border-outline-variant text-on-surface font-semibold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">near_me</span>
                    Find Nearest Hospital
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={resetTriage}
                    className="text-primary text-xs font-semibold hover:underline"
                  >
                    ← Start over
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto ring-8 ring-secondary-container/30">
                  <span className="material-symbols-outlined text-[44px]">verified</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Consultation Recommended
                  </h2>
                  <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Your reported symptoms ({selectedSymptom}, {severity}) are best examined by a General Physician at your nearest Primary Health Centre.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('bookings');
                    }}
                    className="bg-primary text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-md"
                  >
                    <span className="material-symbols-outlined text-xl">calendar_month</span>
                    Book Doctor Appointment
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('find-centres');
                    }}
                    className="bg-surface border border-outline-variant text-on-surface font-semibold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">location_on</span>
                    View Nearby Centres
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={resetTriage}
                    className="text-primary text-xs font-semibold hover:underline"
                  >
                    ← Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
