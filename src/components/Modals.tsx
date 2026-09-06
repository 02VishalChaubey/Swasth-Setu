import React, { useState, useEffect } from 'react';
import { MedicalRecordItem, PatientProfile } from '../types';
import { DEFAULT_PATIENT } from '../data/mockData';

// --- 1. Medical Report / Prescription Detail Modal ---
interface ReportDetailModalProps {
  record: MedicalRecordItem | null;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;
  const patient: PatientProfile = DEFAULT_PATIENT;
  const isTestReport = record.type === 'Test Report';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-outline-variant my-8 relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Clinical Document Header */}
        <div className="border-b border-outline-variant pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary-fixed/60 px-2.5 py-0.5 rounded-full">
              Government Certified e-Health Record
            </span>
            <h2 className="text-xl font-bold text-on-surface mt-1.5">{record.title}</h2>
            <p className="text-xs text-on-surface-variant">{record.facility} • {record.date}</p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="text-on-surface-variant block">Consulting Authority</span>
            <span className="font-bold text-on-surface">{record.provider}</span>
          </div>
        </div>

        {/* Patient Bar */}
        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
          <div>
            <span className="text-on-surface-variant block text-[11px]">Patient Name</span>
            <strong className="text-on-surface">{patient.name}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block text-[11px]">ABHA ID</span>
            <strong className="text-on-surface font-mono">{patient.abhaId}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block text-[11px]">Age / Gender</span>
            <strong className="text-on-surface">{patient.age} Y / {patient.gender}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block text-[11px]">Blood Group</span>
            <strong className="text-error">{patient.bloodGroup}</strong>
          </div>
        </div>

        {/* Clinical Findings / Lab Parameters */}
        {isTestReport && record.labParameters ? (
          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">
              Diagnostic Laboratory Parameters
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-outline-variant/50 rounded-xl overflow-hidden">
                <thead className="bg-surface-container-high text-on-surface font-bold">
                  <tr>
                    <th className="p-3">Investigation</th>
                    <th className="p-3">Observed Value</th>
                    <th className="p-3">Biological Reference</th>
                    <th className="p-3">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {record.labParameters.map((p, i) => (
                    <tr key={i} className="hover:bg-surface">
                      <td className="p-3 font-semibold text-on-surface">{p.test}</td>
                      <td className="p-3 font-bold text-primary">{p.value}</td>
                      <td className="p-3 text-on-surface-variant">{p.normalRange}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          Normal
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-on-surface-variant italic">
              Verification: Verified by Authorized Senior Pathologist under NABL Standards.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div>
              <span className="text-xs font-semibold text-on-surface-variant">Primary Diagnosis:</span>
              <p className="text-sm font-bold text-on-surface mt-0.5">{record.diagnosis || 'Clinical Consultation'}</p>
            </div>

            {record.medications && (
              <div>
                <h3 className="font-bold text-xs text-on-surface uppercase tracking-wider mb-2">
                  Prescribed Medicines (Rx)
                </h3>
                <div className="border border-outline-variant/40 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-high text-on-surface font-semibold">
                      <tr>
                        <th className="p-2.5">Medicine</th>
                        <th className="p-2.5">Dosage</th>
                        <th className="p-2.5">Timing</th>
                        <th className="p-2.5">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {record.medications.map((med, idx) => (
                        <tr key={idx} className="hover:bg-surface">
                          <td className="p-2.5 font-bold text-on-surface">{med.name}</td>
                          <td className="p-2.5 text-on-surface">{med.dosage}</td>
                          <td className="p-2.5 text-on-surface-variant">{med.frequency}</td>
                          <td className="p-2.5 text-primary font-medium">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {record.summary && (
              <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/30 text-xs">
                <span className="font-bold text-on-surface block mb-1">Doctor Advice & Dietary Plan:</span>
                <p className="text-on-surface-variant">{record.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-outline-variant">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm text-secondary">verified</span>
            <span>Digitally signed via Ayushman Bharat Digital Mission (ABDM)</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none px-4 py-2 border border-outline-variant rounded-xl text-xs font-semibold hover:bg-surface-container-high flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Print
            </button>
            <button
              onClick={() => {
                alert(`PDF downloaded for "${record.title}".`);
              }}
              className="flex-1 sm:flex-none px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Emergency Call Simulator Modal ---
interface EmergencyCallModalProps {
  isOpen: boolean;
  number: string;
  serviceName: string;
  onClose: () => void;
}

export const EmergencyCallModal: React.FC<EmergencyCallModalProps> = ({
  isOpen,
  number,
  serviceName,
  onClose,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'Connecting' | 'Connected'>('Connecting');

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus('Connecting');
      return;
    }

    const connectTimer = setTimeout(() => {
      setCallStatus('Connected');
    }, 1500);

    const interval = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121826] text-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl border border-white/10 space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-error/20 text-error rounded-full flex items-center justify-center mx-auto ring-8 ring-error/10 animate-pulse">
          <span className="material-symbols-outlined text-4xl fill">emergency</span>
        </div>

        <div>
          <h3 className="text-xl font-bold">{serviceName}</h3>
          <p className="text-2xl font-mono font-extrabold text-error mt-1">{number}</p>
          <p className="text-xs text-white/70 mt-2">
            {callStatus === 'Connecting' ? 'Dialing dispatch server...' : `Call Active • ${formatTime(callDuration)}`}
          </p>
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-white/80 text-left space-y-1">
          <p className="font-semibold text-white">Your Location Sent to Dispatch:</p>
          <p className="text-[11px] opacity-80">Village Ramgarh, Block 2, Howrah District</p>
          <p className="text-[10px] text-primary-fixed">GPS: 22.5726° N, 88.3639° E</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-error text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-[#a01616] shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-xl">call_end</span>
          End Emergency Call
        </button>
      </div>
    </div>
  );
};

// --- 3. Notifications Drawer / Modal ---
interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: any) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Queue Alert: Token #T-142',
      desc: 'You are now 3rd in line at District Hospital Block A.',
      time: '10 mins ago',
      icon: 'schedule',
      color: 'text-secondary bg-secondary-container',
      actionTab: 'bookings'
    },
    {
      id: 'n2',
      title: 'New Diagnostic Report Ready',
      desc: 'Complete Blood Count (CBC) is uploaded and verified.',
      time: '2 hours ago',
      icon: 'lab_profile',
      color: 'text-primary bg-primary-fixed',
      actionTab: 'records'
    },
    {
      id: 'n3',
      title: 'Upcoming Blood Pressure Follow-up',
      desc: 'Scheduled with ASHA Worker Sunita Devi on Oct 26.',
      time: '1 day ago',
      icon: 'notifications_active',
      color: 'text-on-surface-variant bg-surface-container-high',
      actionTab: 'home'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
      <div className="bg-surface-container-lowest w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">notifications</span>
              <h3 className="font-bold text-lg text-on-surface">Health Alerts</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="divide-y divide-outline-variant/40 mt-4 space-y-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectTab(n.actionTab);
                  onClose();
                }}
                className="p-3.5 rounded-2xl hover:bg-surface cursor-pointer transition-colors flex items-start gap-3"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                  <span className="material-symbols-outlined text-lg">{n.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-on-surface">{n.title}</h4>
                    <span className="text-[10px] text-on-surface-variant">{n.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-surface-container text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-high"
        >
          Dismiss Alerts
        </button>
      </div>
    </div>
  );
};

// --- 4. Profile & Health Card Modal ---
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const patient: PatientProfile = DEFAULT_PATIENT;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 shadow-2xl border border-outline-variant space-y-5 animate-in zoom-in-95">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-on-surface">Patient Health Identity</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="bg-primary text-white p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                Ayushman Bharat Digital Health Card
              </span>
              <h4 className="text-xl font-extrabold mt-0.5">{patient.name}</h4>
              <p className="text-xs opacity-90 font-mono mt-1">ABHA: {patient.abhaId}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
              {patient.initials}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-xs">
            <div>
              <span className="opacity-70 text-[10px] block">DOB / Age</span>
              <span className="font-bold">{patient.age} Yrs</span>
            </div>
            <div>
              <span className="opacity-70 text-[10px] block">Gender</span>
              <span className="font-bold">{patient.gender}</span>
            </div>
            <div>
              <span className="opacity-70 text-[10px] block">Blood</span>
              <span className="font-bold">{patient.bloodGroup}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-3 bg-surface rounded-xl border border-outline-variant/40">
            <span className="text-on-surface-variant">Registered Mobile:</span>
            <span className="font-bold text-on-surface">{patient.phone}</span>
          </div>
          <div className="flex justify-between p-3 bg-surface rounded-xl border border-outline-variant/40">
            <span className="text-on-surface-variant">Village & Block:</span>
            <span className="font-bold text-on-surface">{patient.village}, Block 2</span>
          </div>
          <div className="flex justify-between p-3 bg-surface rounded-xl border border-outline-variant/40">
            <span className="text-on-surface-variant">Assigned ASHA Worker:</span>
            <span className="font-bold text-primary">Sunita Devi (+91 98300 22119)</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container"
        >
          Close
        </button>
      </div>
    </div>
  );
};
