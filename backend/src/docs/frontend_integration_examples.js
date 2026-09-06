/**
 * Swasth Setu - Frontend API Integration Library (Axios)
 * Ready-to-import client service for the React frontend application.
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create Axios instance with default headers and timeout
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor: Attach JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('swasth_token') || 'demo-patient-token';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle automatic token renewal and standardized errors
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Redirecting to login.');
      // Optional: Handle refresh token exchange
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// ==========================================
// SCREEN 1 & 2: AUTHENTICATION
// ==========================================

export const registerUser = (userData) => {
  return apiClient.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const getCurrentUser = () => {
  return apiClient.get('/auth/me');
};

// ==========================================
// SCREEN 3: PATIENT DASHBOARD
// ==========================================

/**
 * Directly powers the Swasth Setu patient home screen:
 * greeting ("Good morning, Rajesh!"), next appointment, live queue status ("T-142"), quick actions.
 */
export const getPatientDashboard = () => {
  return apiClient.get('/patient/dashboard');
};

// ==========================================
// SCREEN 4: FIND CENTRES (PHCs & HOSPITALS)
// ==========================================

export const getHealthCentres = (filters = {}) => {
  return apiClient.get('/centres', { params: filters });
};

export const getNearbyCentres = (lat, lng, radiusKm = 50) => {
  return apiClient.get('/centres/nearby', {
    params: { lat, lng, radiusKm }
  });
};

export const getCentreDetails = (centreId) => {
  return apiClient.get(`/centres/${centreId}`);
};

// ==========================================
// SCREEN 5: DOCTOR APPOINTMENTS
// ==========================================

export const getDoctors = (specialization) => {
  return apiClient.get('/doctors', { params: { specialization } });
};

export const getDoctorAvailability = (doctorId) => {
  return apiClient.get(`/doctors/${doctorId}/availability`);
};

export const bookAppointment = (appointmentPayload) => {
  return apiClient.post('/appointments', appointmentPayload);
};

export const cancelAppointment = (appointmentId) => {
  return apiClient.patch(`/appointments/${appointmentId}/cancel`);
};

// ==========================================
// SCREEN 6: LIVE OPD QUEUE TRACKER
// ==========================================

/**
 * Returns: { token: "T-142", position: 8, peopleAhead: 7, estimatedWaitMinutes: 35, room: "Room 204" }
 */
export const getMyQueueStatus = () => {
  return apiClient.get('/queue/my-status');
};

export const joinCentreQueue = (centreId, doctorId, priority = 'ROUTINE') => {
  return apiClient.post('/queue/join', { centreId, doctorId, priority });
};

// ==========================================
// SCREEN 7: DIGITAL TRIAGE ENGINE
// ==========================================

/**
 * Submits symptoms to the AI/rule engine. Returns urgency, recommended action, and emergency routing (e.g. 108).
 */
export const submitSymptomTriage = ({ symptoms, severity, duration = '1 day', age = 40 }) => {
  return apiClient.post('/triage', { symptoms, severity, duration, age });
};

export const enqueueInSmartTriage = (triageId, centreId) => {
  return apiClient.post('/triage/queue', { triageId, centreId });
};

// ==========================================
// SCREEN 8: HEALTH RECORDS (ABHA/EHR)
// ==========================================

export const getMedicalRecords = (recordType) => {
  return apiClient.get('/records', { params: { recordType } });
};

export const uploadClinicalDocument = (documentData) => {
  return apiClient.post('/records/upload', documentData);
};

// ==========================================
// SCREEN 9: VITALS & TELE-HEALTH
// ==========================================

export const getVitalsHistory = () => {
  return apiClient.get('/vitals');
};

export const getLatestVitals = () => {
  return apiClient.get('/vitals/latest');
};

export const recordNewVitals = (vitalsPayload) => {
  return apiClient.post('/vitals', vitalsPayload);
};

// ==========================================
// SCREEN 10: PHARMACY & JAN AUSHADHI
// ==========================================

export const searchMedicineStock = (medicineName) => {
  return apiClient.get('/pharmacies/search', { params: { medicine: medicineName } });
};

export const getNearbyPharmacies = (lat, lng, radiusKm = 25) => {
  return apiClient.get('/pharmacies/nearby', { params: { lat, lng, radiusKm } });
};

// ==========================================
// SCREEN 11: EMERGENCY SOS & 108 HELPLINE
// ==========================================

export const getEmergencyHelplines = () => {
  return apiClient.get('/emergency/helplines');
};

export const triggerEmergencyAlert = ({ patientPhone, latitude, longitude, locationDescription, emergencyType }) => {
  return apiClient.post('/emergency/request', {
    patientPhone,
    latitude,
    longitude,
    locationDescription,
    emergencyType
  });
};

export default {
  apiClient,
  registerUser,
  loginUser,
  getCurrentUser,
  getPatientDashboard,
  getHealthCentres,
  getNearbyCentres,
  getCentreDetails,
  getDoctors,
  getDoctorAvailability,
  bookAppointment,
  cancelAppointment,
  getMyQueueStatus,
  joinCentreQueue,
  submitSymptomTriage,
  enqueueInSmartTriage,
  getMedicalRecords,
  uploadClinicalDocument,
  getVitalsHistory,
  getLatestVitals,
  recordNewVitals,
  searchMedicineStock,
  getNearbyPharmacies,
  getEmergencyHelplines,
  triggerEmergencyAlert
};
