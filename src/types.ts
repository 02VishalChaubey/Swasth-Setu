export type TabType = 'home' | 'find-centres' | 'bookings' | 'records' | 'emergency';

export type Language = 'en' | 'hi' | 'bn';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  availability: string;
  isAvailableToday: boolean;
  imageUrl: string;
  rating: number;
}

export interface HealthCentre {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  queueStatus: string;
  queueWaitTime: string;
  queueSeverity: 'short' | 'medium' | 'high';
  medicineStock: string;
  medicineStatus: 'stocked' | 'limited' | 'out_of_stock';
  specialistsCount: number;
  specialties: string[];
  phone: string;
  openHours: string;
}

export interface MedicalRecordItem {
  id: string;
  title: string;
  date: string;
  type: 'Prescription' | 'Test Report' | 'Referral';
  facility: string;
  provider: string;
  diagnosis?: string;
  summary?: string;
  result?: string;
  note?: string;
  medications?: { name: string; dosage: string; frequency: string; duration: string }[];
  labParameters?: { test: string; value: string; normalRange: string; status: 'normal' | 'high' | 'low' }[];
}

export interface PatientVitals {
  bp: string;
  pulse: string;
  sugar: string;
  spo2: string;
  temp: string;
  recordedDate: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  abhaId: string;
  phone: string;
  village: string;
}

export interface QueueInfo {
  tokenNumber: string;
  position: string;
  peopleAhead: number;
  estimatedWaitMinutes: number;
  facility: string;
  department: string;
  room: string;
  doctor: string;
  isNotified: boolean;
}

export interface ReferralStep {
  step: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'active' | 'pending';
  extraInfo?: string;
}
