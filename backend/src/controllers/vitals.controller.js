const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * POST /api/vitals
 */
const recordVitals = async (req, res, next) => {
  try {
    const {
      patientId,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      pulse,
      bloodSugar,
      spo2,
      temperature,
      notes
    } = req.body;

    const targetPatientId = patientId || req.user?.patientId || mockStore.patients[0].id;
    const recordedById = req.user?.id || 'usr-hw-01';

    const newVital = {
      id: uuidv4(),
      patientId: targetPatientId,
      recordedById,
      bloodPressureSystolic: bloodPressureSystolic || 120,
      bloodPressureDiastolic: bloodPressureDiastolic || 80,
      pulse: pulse || 72,
      bloodSugar: bloodSugar || 100,
      spo2: spo2 || 98,
      temperature: temperature || 98.6,
      notes: notes || 'Recorded via Swasth Setu health monitor',
      recordedAt: new Date()
    };

    mockStore.vitals.unshift(newVital);

    return successResponse(res, newVital, 'Vital signs successfully recorded', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/vitals
 * Returns longitudinal vitals history for trend analysis
 */
const getVitalsHistory = async (req, res, next) => {
  try {
    const patientId = req.user?.patientId || mockStore.patients[0].id;
    const history = mockStore.vitals
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

    return successResponse(res, history, `Retrieved ${history.length} vital sign records`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/vitals/latest
 */
const getLatestVitals = async (req, res, next) => {
  try {
    const patientId = req.user?.patientId || mockStore.patients[0].id;
    const patientVitals = mockStore.vitals.filter(v => v.patientId === patientId);
    const latest = patientVitals[0] || {
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 84,
      pulse: 74,
      bloodSugar: 104,
      spo2: 98,
      temperature: 98.4,
      recordedAt: new Date()
    };

    const statusEvaluated = {
      ...latest,
      bloodPressureStatus: (latest.bloodPressureSystolic > 130 || latest.bloodPressureDiastolic > 85) ? 'Slightly Elevated' : 'Normal',
      pulseStatus: (latest.pulse >= 60 && latest.pulse <= 100) ? 'Normal' : 'Abnormal',
      sugarStatus: (latest.bloodSugar <= 140) ? 'Normal (Fasting)' : 'High',
      spo2Status: (latest.spo2 >= 95) ? 'Optimal' : 'Attention Required'
    };

    return successResponse(res, statusEvaluated, 'Latest vital signs retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  recordVitals,
  getVitalsHistory,
  getLatestVitals
};
