import { Doctor, HealthCentre, MedicalRecordItem, PatientProfile, PatientVitals, QueueInfo, ReferralStep } from '../types';

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Amit Sharma',
    specialty: 'General Physician',
    experience: '10 yrs exp',
    availability: 'Available Today',
    isAvailableToday: true,
    rating: 4.9,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8ShYsH5khugbqlHbHuBjrLoc4R7y-6_GvWiYdrZ5RWgvTvWTkZN-xjLMb39japTAStZCA4zjTHacRYt1gXhjcZINgolO0cdQLvU5tnrMpltJs3aR9oeRtpFiflA31QnO1CT14Dgey8cbSkEhfj6bfk3aXaPsyOhZrMaygSfm2K5iNFfXAl13JGXzjTPgouc_9hyaKsitFwq_a81ol8pVdp2BnFVMcnkZeRvvLvjW0Pzrh4xtMNRMRow',
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Patel',
    specialty: 'General Physician',
    experience: '8 yrs exp',
    availability: 'Next avail: Tmrw',
    isAvailableToday: false,
    rating: 4.8,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkGo7AA0nu3eJ-5JP-hyk0moiTifrp8MLNRxZQwjFG5MZDh96EKyYBFXW-WQgwsxKuGX9LkvIb3A276jmwmtfwANribv9X7s4AkHZCF4EQZw4D_aSxqKaNozvdV5IOlzKqVY9_yJFSOcgE0LNf_oeVjNHS01rZl1DgeYnBuPNMvUA0RjvbL9AVUBF1gpo3wZw0k2A7ZIjTPg1nqaMF0pVL6GqcaF8rdfWnOgoXSzxrOk2pN896j46OWw',
  },
  {
    id: 'doc-3',
    name: 'Dr. Rajesh Mukherjee',
    specialty: 'Pediatrician',
    experience: '14 yrs exp',
    availability: 'Available Today',
    isAvailableToday: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  }
];

export const HEALTH_CENTRES: HealthCentre[] = [
  {
    id: 'hc-1',
    name: 'Salt Lake General Hospital',
    address: 'Sector V, Salt Lake, Kolkata',
    distance: '2.5 km',
    rating: 4.8,
    queueStatus: 'Queue: Short (15m wait)',
    queueWaitTime: '15m wait',
    queueSeverity: 'short',
    medicineStock: 'Medicine: Stocked',
    medicineStatus: 'stocked',
    specialistsCount: 12,
    specialties: ['General', 'Pediatrics', 'Orthopedics'],
    phone: '+91 33 2357 1200',
    openHours: 'Open 24/7'
  },
  {
    id: 'hc-2',
    name: 'Howrah Primary Health Centre',
    address: 'Shibpur, Howrah',
    distance: '4.1 km',
    rating: 4.2,
    queueStatus: 'Queue: Medium (45m wait)',
    queueWaitTime: '45m wait',
    queueSeverity: 'medium',
    medicineStock: 'Medicine: Limited Stock',
    medicineStatus: 'limited',
    specialistsCount: 3,
    specialties: ['General Medicine'],
    phone: '+91 33 2678 4411',
    openHours: '8:00 AM - 6:00 PM'
  },
  {
    id: 'hc-3',
    name: 'Ramgarh Village Sub-Centre',
    address: 'Village Ramgarh, Block 2, Howrah',
    distance: '0.8 km',
    rating: 4.6,
    queueStatus: 'Queue: Short (10m wait)',
    queueWaitTime: '10m wait',
    queueSeverity: 'short',
    medicineStock: 'Medicine: Stocked',
    medicineStatus: 'stocked',
    specialistsCount: 2,
    specialties: ['Primary Care', 'Maternal & Child Health'],
    phone: '+91 33 2690 1122',
    openHours: '9:00 AM - 5:00 PM'
  }
];

export const DEFAULT_PATIENT: PatientProfile = {
  id: 'SS-8492-49',
  name: 'Rajesh Kumar',
  initials: 'RK',
  age: 45,
  gender: 'Male',
  bloodGroup: 'O+ Ve',
  height: '172cm',
  weight: '75kg',
  abhaId: '91-4829-1029-4920',
  phone: '+91 98310 44921',
  village: 'Village Ramgarh'
};

export const DEFAULT_VITALS: PatientVitals = {
  bp: '130/85 mmHg',
  pulse: '72 bpm',
  sugar: '95 mg/dL',
  spo2: '98%',
  temp: '98.4 °F',
  recordedDate: 'Recorded 2 days ago'
};

export const INITIAL_RECORDS: MedicalRecordItem[] = [
  {
    id: 'rec-1',
    title: 'Regular Checkup',
    date: '12 Oct 2023',
    type: 'Prescription',
    facility: 'Ruby General Hospital',
    provider: 'Dr. A. Sharma',
    diagnosis: 'Primary Hypertension',
    summary: 'Continue Telmisartan 40mg. Advised low sodium diet.',
    medications: [
      { name: 'Telmisartan', dosage: '40 mg', frequency: 'Once daily (Morning)', duration: '30 Days' },
      { name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily (Night)', duration: '30 Days' },
      { name: 'Paracetamol', dosage: '500 mg', frequency: 'As needed for headache', duration: '5 Days' }
    ]
  },
  {
    id: 'rec-2',
    title: 'Complete Blood Count (CBC)',
    date: '05 Sep 2023',
    type: 'Test Report',
    facility: 'Apollo Diagnostics',
    provider: 'Lab Tech R. Verma',
    result: 'Parameters within normal limits.',
    note: 'Routine annual screening.',
    labParameters: [
      { test: 'Hemoglobin', value: '14.5 g/dL', normalRange: '13.5 - 17.5 g/dL', status: 'normal' },
      { test: 'Total WBC Count', value: '7,200 /mcL', normalRange: '4,500 - 11,000 /mcL', status: 'normal' },
      { test: 'Platelet Count', value: '250,000 /mcL', normalRange: '150,000 - 450,000 /mcL', status: 'normal' },
      { test: 'RBC Count', value: '4.8 mil/mcL', normalRange: '4.5 - 5.9 mil/mcL', status: 'normal' },
      { test: 'ESR', value: '12 mm/hr', normalRange: '0 - 15 mm/hr', status: 'normal' }
    ]
  },
  {
    id: 'rec-3',
    title: 'Cardiology Referral Assessment',
    date: '12 Oct 2023',
    type: 'Referral',
    facility: 'District Hospital, Block A',
    provider: 'Dr. Sharma (Cardiology)',
    diagnosis: 'Hypertension Follow-up',
    summary: 'Referral initiated from Ramgarh PHC for echocardiogram and consultation with District Specialist.'
  }
];

export const INITIAL_QUEUE: QueueInfo = {
  tokenNumber: 'T-142',
  position: '08',
  peopleAhead: 3,
  estimatedWaitMinutes: 25,
  facility: 'District Hospital, Block A',
  department: 'Cardiology Department, Room 302',
  room: 'Room 302',
  doctor: 'Dr. Sharma',
  isNotified: false
};

export const REFERRAL_TIMELINE: ReferralStep[] = [
  {
    step: 1,
    title: 'Referred',
    description: 'Primary Health Centre, Village Ramgarh',
    timestamp: 'Oct 12, 09:30 AM',
    status: 'completed'
  },
  {
    step: 2,
    title: 'Accepted',
    description: 'District Hospital reviewed your case.',
    timestamp: 'Oct 12, 11:15 AM',
    status: 'completed'
  },
  {
    step: 3,
    title: 'Appointment Scheduled',
    description: 'Today, 2:00 PM',
    extraInfo: 'Please arrive 15 minutes early.',
    timestamp: 'Oct 14, 02:00 PM',
    status: 'active'
  },
  {
    step: 4,
    title: 'Consultation',
    description: 'Specialist examination and ECG review',
    timestamp: 'Pending',
    status: 'pending'
  },
  {
    step: 5,
    title: 'Completed',
    description: 'Discharge summary and updated digital prescription',
    timestamp: 'Pending',
    status: 'pending'
  }
];

export const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIy8L73adEE1HmQoWfZ3FYb4ZU7R8R14jGvyUeGFrig-b5TLySnB0lXflt273gLsQYNTLU7htkhPR-6-NEjhjZaCSV5QBxMjMh9hoQMJCXQUsQYBw6v4ZB2ns5IW2rX94HJey0pcys0e1i2oRwF9hFtah-LJuK8VutLY2Y2zQvxz8WZbdvYx8qL23ibICxG6iF2mKUwAjK9HwMdhRzaeEEK4vJKHAHCntFIyetwO5WF_Y_yErjCVlztz6TK8Isx-UDXDs';

export const MAP_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5t97wqASs5Fu6NjdsP16xJ4RONd8qkkHlVX2uDdaab2Bbfl5O9ok4Lea6XijmDIw8cEXqxsBg0HdBCIBaEIVdbwNeuKw2TuqZfh8JrudVDab74_985mNIFVrOV87NrQh2AQvc0IlI26PI2MAUrTf4eYhCEKyojLZKYZpJep_NwRx7Uiq4y5bgIpmQEGX1JvV4CpUKmW6gnD9jVUPjB4yMrajRPozrDN2Ciy36-ODTQBsnh5awgeebPA';

export const ROUTE_MAP_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2nXRQAvI7P8FWC8YaFnCZa9H4G15SfdB4355gqTsOOODXf69yn_Q20JYBeA5FJRcyL3kp93onO3sycXlPqB9ozUX5HY7iRYTAauN_GqFbJsiaxuiGVMvyEhX4peSb8Wt7tfmy1E_RaZDJgnsUfej40MX6y_aMWKiIGAE-dlio2YkDwXE8aA0rtpiAXnAaEogAFX7iTqp6yD2zYduZwn0sTImq5w92qxVt5UFgg_k1Y4oatXfEpqx0Zw';
