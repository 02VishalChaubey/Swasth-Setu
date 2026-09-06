const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/worker/patients
 */
const getAssignedPatients = async (req, res, next) => {
  try {
    const village = req.query.village || 'Ramgarh';
    const patients = mockStore.patients.filter(p => !p.village || p.village.toLowerCase() === village.toLowerCase());

    const enriched = patients.map(p => {
      const latestVital = mockStore.vitals.find(v => v.patientId === p.id);
      return {
        ...p,
        latestVital: latestVital || null
      };
    });

    return successResponse(res, enriched, `Retrieved ${enriched.length} assigned village community patients`);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/worker/vitals
 */
const recordVitalsByWorker = async (req, res, next) => {
  try {
    const { patientId, bloodPressureSystolic, bloodPressureDiastolic, pulse, bloodSugar, spo2, temperature, notes } = req.body;

    const newVital = {
      id: uuidv4(),
      patientId,
      recordedById: req.user?.id || 'usr-hw-01',
      bloodPressureSystolic: bloodPressureSystolic || 120,
      bloodPressureDiastolic: bloodPressureDiastolic || 80,
      pulse: pulse || 74,
      bloodSugar: bloodSugar || 100,
      spo2: spo2 || 98,
      temperature: temperature || 98.6,
      notes: notes || 'Recorded by ASHA Health Worker during home visit',
      recordedAt: new Date()
    };

    mockStore.vitals.unshift(newVital);

    return successResponse(res, newVital, 'Vitals recorded and uploaded to ABHA health record registry', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/worker/followups
 */
const scheduleFollowUp = async (req, res, next) => {
  try {
    const { patientId, followUpDate, time, reason, location } = req.body;
    const followUpId = uuidv4();

    return successResponse(res, {
      followUpId,
      patientId,
      followUpDate: followUpDate || '2026-10-26',
      time: time || '11:00 AM',
      reason: reason || 'Routine Blood Pressure Follow-up',
      location: location || 'Village Sub-Centre (Ramgarh)',
      assignedWorker: 'Sunita Devi (ASHA Worker)',
      status: 'SCHEDULED'
    }, 'ASHA follow-up task scheduled successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/tasks
 */
const getWorkerTasks = async (req, res, next) => {
  try {
    const tasks = [
      {
        id: 'tsk-01',
        title: 'Routine Blood Pressure Checkup - Rajesh Kumar',
        patientName: 'Rajesh Kumar',
        patientPhone: '+91 98310 44921',
        address: 'House 42, Village Ramgarh',
        dueDate: '2026-10-26 11:00 AM',
        status: 'PENDING',
        priority: 'MEDIUM'
      },
      {
        id: 'tsk-02',
        title: 'Childhood Immunization (Pentavalent-3) - Child of Arjun Das',
        patientName: 'Arjun Das',
        patientPhone: '+91 98322 11002',
        address: 'Village Amta, Ward 4',
        dueDate: '2026-10-27 10:00 AM',
        status: 'PENDING',
        priority: 'HIGH'
      },
      {
        id: 'tsk-03',
        title: 'Antenatal Nutrition Kit Distribution',
        patientName: 'Pooja Mondal',
        patientPhone: '+91 98311 88990',
        address: 'Village Ramgarh, Block 2',
        dueDate: '2026-10-28 02:00 PM',
        status: 'PENDING',
        priority: 'MEDIUM'
      }
    ];

    return successResponse(res, tasks, 'Active community health worker tasks retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssignedPatients,
  recordVitalsByWorker,
  scheduleFollowUp,
  getWorkerTasks
};
