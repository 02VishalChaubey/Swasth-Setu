const { v4: uuidv4 } = require('uuid');

// Initial seed mock dataset directly aligned with Swasth Setu React Frontend
const mockStore = {
  users: [
    {
      id: 'usr-pat-01',
      email: 'rajesh.kumar@swasthsetu.gov.in',
      phone: '+91 98310 44921',
      passwordHash: '$2a$10$wT5H3U19bW7kXUf8B7.3aOiX9h3tO4pP2g0L5WwL8H2jL0P5kL0P.', // password123
      role: 'PATIENT',
      createdAt: new Date(),
    },
    {
      id: 'usr-doc-01',
      email: 'dr.amit.sharma@swasthsetu.gov.in',
      phone: '+91 98300 11223',
      passwordHash: '$2a$10$wT5H3U19bW7kXUf8B7.3aOiX9h3tO4pP2g0L5WwL8H2jL0P5kL0P.',
      role: 'DOCTOR',
      createdAt: new Date(),
    },
    {
      id: 'usr-doc-02',
      email: 'dr.priya.patel@swasthsetu.gov.in',
      phone: '+91 98300 44556',
      passwordHash: '$2a$10$wT5H3U19bW7kXUf8B7.3aOiX9h3tO4pP2g0L5WwL8H2jL0P5kL0P.',
      role: 'DOCTOR',
      createdAt: new Date(),
    },
    {
      id: 'usr-hw-01',
      email: 'sunita.devi.asha@swasthsetu.gov.in',
      phone: '+91 98300 22119',
      passwordHash: '$2a$10$wT5H3U19bW7kXUf8B7.3aOiX9h3tO4pP2g0L5WwL8H2jL0P5kL0P.',
      role: 'HEALTH_WORKER',
      createdAt: new Date(),
    },
    {
      id: 'usr-adm-01',
      email: 'admin.howrah@swasthsetu.gov.in',
      phone: '+91 98300 99999',
      passwordHash: '$2a$10$wT5H3U19bW7kXUf8B7.3aOiX9h3tO4pP2g0L5WwL8H2jL0P5kL0P.',
      role: 'ADMIN',
      createdAt: new Date(),
    }
  ],

  patients: [
    {
      id: 'pat-01',
      userId: 'usr-pat-01',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@swasthsetu.gov.in',
      phone: '+91 98310 44921',
      dateOfBirth: new Date('1981-05-14'),
      gender: 'Male',
      bloodGroup: 'B+',
      height: '172 cm',
      weight: '68 kg',
      address: 'House 42, Village Ramgarh, Block 2',
      village: 'Ramgarh',
      district: 'Howrah',
      abhaId: '91-4820-9182-4410',
      emergencyContact: '+91 98310 44922 (Asha Devi - Wife)',
      createdAt: new Date()
    },
    {
      id: 'pat-02',
      userId: 'usr-pat-02',
      name: 'Arjun Das',
      email: 'arjun.das@example.com',
      phone: '+91 98322 11002',
      dateOfBirth: new Date('1994-08-20'),
      gender: 'Male',
      bloodGroup: 'O+',
      height: '168 cm',
      weight: '62 kg',
      address: 'Village Amta, Ward 4',
      village: 'Amta',
      district: 'Howrah',
      abhaId: '91-3321-7782-9011',
      emergencyContact: '+91 98322 11003',
      createdAt: new Date()
    }
  ],

  doctors: [
    {
      id: 'doc-01',
      userId: 'usr-doc-01',
      name: 'Dr. Amit Sharma',
      email: 'dr.amit.sharma@swasthsetu.gov.in',
      phone: '+91 98300 11223',
      specialization: 'General Physician / Internal Medicine',
      experienceYears: 12,
      qualification: 'MBBS, MD (General Medicine)',
      registrationNumber: 'WBMC-84920',
      isVerified: true,
      rating: 4.9,
      bio: 'Consultant Senior Physician specializing in rural hypertension management and preventative community healthcare.',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
      healthCentreId: 'centre-01'
    },
    {
      id: 'doc-02',
      userId: 'usr-doc-02',
      name: 'Dr. Priya Patel',
      email: 'dr.priya.patel@swasthsetu.gov.in',
      phone: '+91 98300 44556',
      specialization: 'Obstetrics & Community Health',
      experienceYears: 8,
      qualification: 'MBBS, DGO',
      registrationNumber: 'WBMC-91024',
      isVerified: true,
      rating: 4.8,
      bio: 'Maternal health specialist dedicated to rural antenatal care and infant immunization.',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813588-468249826a7e?w=400&auto=format&fit=crop&q=80',
      healthCentreId: 'centre-01'
    }
  ],

  healthCentres: [
    {
      id: 'centre-01',
      name: 'District Hospital Salt Lake Block A',
      type: 'DISTRICT_HOSPITAL',
      address: 'Near Central Park, Sector 1, Salt Lake',
      city: 'Salt Lake',
      district: 'North 24 Parganas',
      state: 'West Bengal',
      pincode: '700064',
      latitude: 22.5867,
      longitude: 88.4178,
      phone: '+91 33 2359 0101',
      email: 'saltlake.dh@wbhealth.gov.in',
      openingHours: '24 Hours Emergency • OPD 08:00 AM - 02:00 PM',
      isOpen24x7: true,
      totalBeds: 250,
      availableBeds: 42,
      availableServices: ['Emergency Trauma', 'General Medicine', 'Maternity', 'Pathology Lab', 'Radiology (X-Ray, Ultrasound)', 'Pharmacy 24x7'],
      queueLength: 8,
      estimatedWaitTime: '35 mins',
      medicineAvailability: 'High (88% In-Stock)'
    },
    {
      id: 'centre-02',
      name: 'Primary Health Centre Ramgarh',
      type: 'PRIMARY_HEALTH_CENTRE',
      address: 'Main Road, Ramgarh Village, Block 2',
      city: 'Ramgarh',
      district: 'Howrah',
      state: 'West Bengal',
      pincode: '711101',
      latitude: 22.5726,
      longitude: 88.3639,
      phone: '+91 33 2660 4421',
      email: 'ramgarh.phc@wbhealth.gov.in',
      openingHours: '09:00 AM - 04:00 PM',
      isOpen24x7: false,
      totalBeds: 15,
      availableBeds: 6,
      availableServices: ['Outpatient Care', 'Basic Diagnostics', 'Immunization', 'Essential Drug Dispensing', 'ASHA Referral Link'],
      queueLength: 4,
      estimatedWaitTime: '15 mins',
      medicineAvailability: 'Adequate (Essential Drugs In-Stock)'
    },
    {
      id: 'centre-03',
      name: 'Howrah Sub-Divisional Hospital',
      type: 'COMMUNITY_HEALTH_CENTRE',
      address: 'Station Road, Howrah',
      city: 'Howrah',
      district: 'Howrah',
      state: 'West Bengal',
      pincode: '711101',
      latitude: 22.5958,
      longitude: 88.2636,
      phone: '+91 33 2638 9012',
      email: 'howrah.sdh@wbhealth.gov.in',
      openingHours: '24x7 Emergency',
      isOpen24x7: true,
      totalBeds: 120,
      availableBeds: 18,
      availableServices: ['Emergency Care', 'Surgery', 'Pediatrics', 'Blood Bank', 'Dialysis'],
      queueLength: 12,
      estimatedWaitTime: '45 mins',
      medicineAvailability: 'High (92% In-Stock)'
    }
  ],

  appointments: [
    {
      id: 'apt-01',
      bookingReference: 'SS-8492-49',
      patientId: 'pat-01',
      doctorId: 'doc-01',
      healthCentreId: 'centre-01',
      appointmentDate: new Date('2026-10-24T10:30:00Z'),
      timeSlot: '10:30 AM',
      appointmentType: 'IN_PERSON',
      status: 'CONFIRMED',
      symptoms: 'Routine follow-up for blood pressure and cardiovascular wellness review',
      notes: 'Please bring recent CBC lab reports and current prescriptions.',
      queueToken: 'T-142',
      createdAt: new Date()
    }
  ],

  queueEntries: [
    {
      id: 'que-01',
      tokenNumber: 'T-142',
      patientId: 'pat-01',
      healthCentreId: 'centre-01',
      doctorId: 'doc-01',
      priority: 'ROUTINE',
      position: 8,
      peopleAhead: 7,
      status: 'WAITING',
      estimatedWaitMinutes: 35,
      roomNumber: 'Room 204 (OPD Block A)',
      createdAt: new Date()
    }
  ],

  medicalRecords: [
    {
      id: 'rec-01',
      patientId: 'pat-01',
      doctorId: 'doc-01',
      healthCentreId: 'centre-01',
      recordType: 'PRESCRIPTION',
      title: 'General Health Consultation & BP Management',
      description: 'Stage 1 Hypertension evaluation and maintenance regimen review.',
      diagnosis: 'Primary Hypertension (Stage 1) - Well Controlled',
      fileUrl: '/records/rx_rajesh_kumar_oct2026.pdf',
      recordDate: new Date('2026-10-18'),
      medications: [
        { name: 'Telmisartan 40mg', dosage: '1 tablet daily', frequency: 'Morning after breakfast', duration: '30 days' },
        { name: 'Amlodipine 5mg', dosage: '1 tablet daily', frequency: 'Night before bedtime', duration: '30 days' },
        { name: 'Paracetamol 500mg', dosage: '1 tablet as needed', frequency: 'SOS for headache/body pain', duration: '5 days' }
      ],
      createdAt: new Date()
    },
    {
      id: 'rec-02',
      patientId: 'pat-01',
      doctorId: 'doc-01',
      healthCentreId: 'centre-01',
      recordType: 'LAB_REPORT',
      title: 'Complete Blood Count (CBC) & Lipid Profile',
      description: 'Annual diagnostic blood profile under District Hospital NABL lab.',
      diagnosis: 'Normal hematological profile; mild borderline triglycerides.',
      fileUrl: '/records/cbc_apollo_oct2026.pdf',
      recordDate: new Date('2026-10-12'),
      labParameters: [
        { test: 'Hemoglobin (Hb)', value: '14.5 g/dL', normalRange: '13.5 - 17.5 g/dL', status: 'NORMAL' },
        { test: 'Total Leukocyte Count (WBC)', value: '7,200 /mcL', normalRange: '4,500 - 11,000 /mcL', status: 'NORMAL' },
        { test: 'Platelet Count', value: '250,000 /mcL', normalRange: '150,000 - 450,000 /mcL', status: 'NORMAL' },
        { test: 'Erythrocyte Sedimentation Rate (ESR)', value: '12 mm/hr', normalRange: '0 - 15 mm/hr', status: 'NORMAL' },
        { test: 'RBC Count', value: '4.8 mil/mcL', normalRange: '4.5 - 5.9 mil/mcL', status: 'NORMAL' }
      ],
      createdAt: new Date()
    }
  ],

  vitals: [
    {
      id: 'vit-01',
      patientId: 'pat-01',
      recordedById: 'usr-hw-01',
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 84,
      pulse: 74,
      bloodSugar: 104,
      spo2: 98,
      temperature: 98.4,
      notes: 'Recorded during routine village home follow-up by ASHA Sunita Devi.',
      recordedAt: new Date('2026-10-20T08:30:00Z')
    },
    {
      id: 'vit-02',
      patientId: 'pat-01',
      recordedById: 'usr-hw-01',
      bloodPressureSystolic: 132,
      bloodPressureDiastolic: 86,
      pulse: 78,
      bloodSugar: 110,
      spo2: 97,
      temperature: 98.6,
      notes: 'Weekly monitoring.',
      recordedAt: new Date('2026-10-13T09:00:00Z')
    }
  ],

  referrals: [
    {
      id: 'ref-01',
      referralNumber: 'REF-8492',
      patientId: 'pat-01',
      sourceCentreId: 'centre-02',
      destinationCentreId: 'centre-01',
      referringDoctorId: 'doc-01',
      reason: 'Advanced Cardiovascular Consultation & Echocardiography',
      priority: 'ROUTINE',
      status: 'SCHEDULED',
      clinicalNotes: 'Referred from Ramgarh PHC to District Hospital Salt Lake cardiology clinic.',
      createdAt: new Date()
    }
  ],

  pharmacies: [
    {
      id: 'phm-01',
      name: 'Jan Aushadhi Kendra - Ramgarh Centre',
      address: 'Plot 12, Hospital Road, Ramgarh',
      district: 'Howrah',
      latitude: 22.5735,
      longitude: 88.3645,
      phone: '+91 98311 00221',
      openingHours: '08:00 AM - 08:00 PM',
      is24x7: false,
      medicines: ['Paracetamol 500mg', 'Telmisartan 40mg', 'Amlodipine 5mg', 'Metformin 500mg', 'ORS Packets', 'Cetirizine 10mg']
    },
    {
      id: 'phm-02',
      name: 'Apollo Pharmacy Salt Lake',
      address: 'HB Block, Sector 3, Salt Lake',
      district: 'North 24 Parganas',
      latitude: 22.5850,
      longitude: 88.4190,
      phone: '+91 33 2335 1100',
      openingHours: '24 Hours Open',
      is24x7: true,
      medicines: ['All Essential & Emergency Drugs', 'Insulin', 'Anti-Snake Venom (Hospital Link)', 'Inhalers']
    }
  ],

  triageRecords: [],
  emergencyRequests: []
};

module.exports = mockStore;
