import React, { useState } from 'react';
import { MedicalRecordItem, PatientProfile, PatientVitals } from '../types';
import { DEFAULT_PATIENT, DEFAULT_VITALS, INITIAL_RECORDS } from '../data/mockData';

interface RecordsViewProps {
  onOpenReportModal: (record: MedicalRecordItem) => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({ onOpenReportModal }) => {
  const [records, setRecords] = useState<MedicalRecordItem[]>(INITIAL_RECORDS);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Prescription' | 'Test Report' | 'Referral'>('All');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload Record Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<'Prescription' | 'Test Report' | 'Referral'>('Prescription');
  const [uploadFacility, setUploadFacility] = useState('');
  const [uploadProvider, setUploadProvider] = useState('');
  const [uploadSummary, setUploadSummary] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const patient: PatientProfile = DEFAULT_PATIENT;
  const vitals: PatientVitals = DEFAULT_VITALS;

  const filteredRecords = records.filter((rec) => {
    if (selectedFilter !== 'All' && rec.type !== selectedFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = rec.title.toLowerCase().includes(q) ||
                    rec.facility.toLowerCase().includes(q) ||
                    rec.provider.toLowerCase().includes(q) ||
                    (rec.diagnosis && rec.diagnosis.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newRecord: MedicalRecordItem = {
      id: `rec-${Date.now()}`,
      title: uploadTitle,
      date: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: uploadType,
      facility: uploadFacility || 'Community Health Centre',
      provider: uploadProvider || 'Attending Physician',
      diagnosis: uploadSummary ? uploadSummary.slice(0, 40) : 'General Clinical Consultation',
      summary: uploadSummary || 'Patient-uploaded digital health document verified by Swasth Setu records registry.',
    };

    setRecords([newRecord, ...records]);
    setIsUploadOpen(false);
    setUploadTitle('');
    setUploadFacility('');
    setUploadProvider('');
    setUploadSummary('');
    setUploadFileName('');
  };

  const handleDownload = (rec: MedicalRecordItem) => {
    alert(`Downloading verified copy of "${rec.title}" (PDF) to your device.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Medical Records</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Official health records linked with ABHA ID {patient.abhaId}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex-1 sm:flex-none bg-primary text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm"
            id="upload-record-btn"
          >
            <span className="material-symbols-outlined text-lg">upload_file</span>
            Upload Record
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Patient Profile & Vitals */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patient Profile Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-sm">
                {patient.initials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">{patient.name}</h3>
                <p className="text-xs font-mono text-primary font-semibold">ID: {patient.id}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold">
                  ABHA Verified
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant text-xs">
              <div className="bg-surface p-2.5 rounded-xl border border-outline-variant/40">
                <span className="text-on-surface-variant block text-[11px]">Age & Gender</span>
                <span className="font-bold text-on-surface">{patient.age} yrs • {patient.gender}</span>
              </div>
              <div className="bg-surface p-2.5 rounded-xl border border-outline-variant/40">
                <span className="text-on-surface-variant block text-[11px]">Blood Group</span>
                <span className="font-bold text-error">{patient.bloodGroup}</span>
              </div>
              <div className="bg-surface p-2.5 rounded-xl border border-outline-variant/40">
                <span className="text-on-surface-variant block text-[11px]">Height / Weight</span>
                <span className="font-bold text-on-surface">{patient.height} • {patient.weight}</span>
              </div>
              <div className="bg-surface p-2.5 rounded-xl border border-outline-variant/40">
                <span className="text-on-surface-variant block text-[11px]">Location</span>
                <span className="font-bold text-on-surface truncate">{patient.village}</span>
              </div>
            </div>
          </div>

          {/* Latest Vitals Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">ecg_heart</span>
                <h3 className="font-bold text-sm text-on-surface">Latest Vitals</h3>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {vitals.recordedDate}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">speed</span>
                  <span className="text-on-surface-variant font-medium">Blood Pressure</span>
                </div>
                <span className="font-bold text-on-surface">{vitals.bp}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-error">favorite</span>
                  <span className="text-on-surface-variant font-medium">Pulse Rate</span>
                </div>
                <span className="font-bold text-on-surface">{vitals.pulse}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-secondary">water_drop</span>
                  <span className="text-on-surface-variant font-medium">Blood Sugar (Fasting)</span>
                </div>
                <span className="font-bold text-on-surface">{vitals.sugar}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">air</span>
                  <span className="text-on-surface-variant font-medium">SpO2 Oxygen</span>
                </div>
                <span className="font-bold text-secondary">{vitals.spo2}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Records Timeline */}
        <div className="lg:col-span-8 space-y-5">
          {/* Filters & Search Row */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {(['All', 'Prescription', 'Test Report', 'Referral'] as const).map((filter) => {
                const isSelected = selectedFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/50'
                    }`}
                  >
                    {filter === 'All' ? 'All Records' : filter + 's'}
                  </button>
                );
              })}
            </div>

            {/* Year Dropdown & Search */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none px-3 py-1.5 pr-7 bg-surface border border-outline-variant rounded-xl text-xs font-semibold text-on-surface cursor-pointer focus:outline-none"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <span className="material-symbols-outlined text-xs pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  arrow_drop_down
                </span>
              </div>

              <div className="relative flex-1 md:w-48">
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-surface border border-outline-variant rounded-xl text-xs focus:outline-none focus:border-primary"
                />
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                  search
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Cards */}
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                  inventory_2
                </span>
                <p className="text-sm font-semibold text-on-surface">No records found matching filters</p>
                <button
                  onClick={() => {
                    setSelectedFilter('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs font-bold text-primary hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredRecords.map((rec) => {
                const isPrescription = rec.type === 'Prescription';
                const isTestReport = rec.type === 'Test Report';

                return (
                  <article
                    key={rec.id}
                    className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isPrescription
                            ? 'bg-primary-fixed text-primary'
                            : isTestReport
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          <span className="material-symbols-outlined text-xl">
                            {isPrescription ? 'prescriptions' : isTestReport ? 'lab_profile' : 'moving'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-on-surface">{rec.title}</h3>
                          <p className="text-xs text-on-surface-variant">
                            {rec.date} • {rec.facility}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isPrescription
                          ? 'bg-primary-fixed/60 text-primary'
                          : isTestReport
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {rec.type}
                      </span>
                    </div>

                    {rec.diagnosis && (
                      <div className="text-xs space-y-1">
                        <p className="text-on-surface-variant">
                          Doctor / Provider: <strong className="text-on-surface">{rec.provider}</strong>
                        </p>
                        <p className="text-on-surface-variant">
                          Diagnosis: <strong className="text-on-surface">{rec.diagnosis}</strong>
                        </p>
                        {rec.summary && (
                          <p className="text-xs text-on-surface bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                            {rec.summary}
                          </p>
                        )}
                        {rec.result && (
                          <p className="text-xs text-secondary font-semibold bg-secondary-container/30 p-2.5 rounded-xl border border-secondary/20">
                            Result: {rec.result}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
                      <button
                        onClick={() => onOpenReportModal(rec)}
                        className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline py-1"
                      >
                        <span>{isTestReport ? 'View Results' : 'View Report'}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>

                      <button
                        onClick={() => handleDownload(rec)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Upload Record Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant animate-in zoom-in-95 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-on-surface">Upload Health Record</h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Record Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultrasound Scan, Blood Pressure Slip"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Record Type</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="Test Report">Test Report</option>
                    <option value="Referral">Referral Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Doctor / Provider</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Mukherjee"
                    value={uploadProvider}
                    onChange={(e) => setUploadProvider(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. District Hospital Howrah"
                  value={uploadFacility}
                  onChange={(e) => setUploadFacility(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Diagnosis or Clinical Notes</label>
                <textarea
                  rows={2}
                  placeholder="Short notes or physician recommendations..."
                  value={uploadSummary}
                  onChange={(e) => setUploadSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              {/* Drag & Drop File Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">File Document (PDF or Scan)</label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files?.[0]) {
                      setUploadFileName(e.dataTransfer.files[0].name);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                    isDragOver ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant bg-surface'
                  }`}
                  onClick={() => {
                    const fakeNames = ['Prescription_Oct2023.pdf', 'LabReport_CBC_Verified.pdf', 'DischargeSummary.jpg'];
                    setUploadFileName(fakeNames[Math.floor(Math.random() * fakeNames.length)]);
                  }}
                >
                  <span className="material-symbols-outlined text-2xl text-primary mb-1">cloud_upload</span>
                  <p className="text-xs font-semibold text-on-surface">
                    {uploadFileName ? `Selected: ${uploadFileName}` : 'Drag and drop or click to choose file'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Supports PDF, JPG, PNG up to 15MB</p>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
