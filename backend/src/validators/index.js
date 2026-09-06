const { z } = require('zod');
const { errorResponse } = require('../utils/response');

// Validation runner middleware helper
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      return errorResponse(res, 'VALIDATION_ERROR', 'Invalid request payload', 400, err.errors);
    }
    next(err);
  }
};

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  district: z.string().default('Howrah'),
  abhaId: z.string().optional(),
  emergencyContact: z.string().optional(),
  role: z.enum(['PATIENT', 'DOCTOR', 'HEALTH_WORKER', 'ADMIN']).default('PATIENT')
});

const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, 'Password is required')
}).refine(data => data.email || data.phone, {
  message: "Either email or phone is required to sign in"
});

const appointmentBookingSchema = z.object({
  doctorId: z.string().min(1, 'Doctor ID is required'),
  healthCentreId: z.string().min(1, 'Health Centre ID is required'),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  appointmentType: z.enum(['IN_PERSON', 'TELECONSULTATION', 'ASHA_VISIT']).default('IN_PERSON'),
  symptoms: z.string().optional(),
  notes: z.string().optional()
});

const vitalsRecordingSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  bloodPressureSystolic: z.number().int().min(50).max(300).optional(),
  bloodPressureDiastolic: z.number().int().min(30).max(200).optional(),
  pulse: z.number().int().min(30).max(250).optional(),
  bloodSugar: z.number().min(20).max(800).optional(),
  spo2: z.number().min(50).max(100).optional(),
  temperature: z.number().min(90).max(110).optional(),
  notes: z.string().optional()
});

const triageEvaluateSchema = z.object({
  symptoms: z.array(z.string()).min(1, 'At least one symptom must be specified'),
  severity: z.number().int().min(1).max(10),
  duration: z.string().default('1 day'),
  age: z.number().int().min(0).max(125).default(40),
  vitalSigns: z.object({
    systolic_bp: z.number().optional(),
    diastolic_bp: z.number().optional(),
    pulse_rate: z.number().optional(),
    spo2: z.number().optional(),
    temperature: z.number().optional()
  }).optional()
});

const referralCreateSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  sourceCentreId: z.string().min(1, 'Source Centre ID is required'),
  destinationCentreId: z.string().min(1, 'Destination Centre ID is required'),
  referringDoctorId: z.string().optional(),
  reason: z.string().min(3, 'Reason for referral is required'),
  priority: z.enum(['EMERGENCY', 'URGENT', 'ROUTINE']).default('ROUTINE'),
  clinicalNotes: z.string().optional()
});

const emergencyRequestSchema = z.object({
  patientPhone: z.string().min(10, 'Phone number is required for emergency dispatch'),
  latitude: z.number(),
  longitude: z.number(),
  locationDescription: z.string().min(3, 'Location description is required'),
  emergencyType: z.string().default('GENERAL_EMERGENCY'),
  notes: z.string().optional()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  appointmentBookingSchema,
  vitalsRecordingSchema,
  triageEvaluateSchema,
  referralCreateSchema,
  emergencyRequestSchema
};
