const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');
const logger = require('../utils/logger');

// Local fallback triage evaluator in case FastAPI service is cold-starting
const evaluateTriageLocally = (symptoms, severity, age = 40) => {
  const text = symptoms.join(' ').toLowerCase();

  // Red flag emergency rules
  const emergencyKeywords = ['chest pain', 'heart attack', 'can\'t breathe', 'difficulty breathing', 'snake bite', 'unconscious', 'slurred speech', 'bleeding'];
  const isEmergency = emergencyKeywords.some(kw => text.includes(kw)) && severity >= 5;

  if (isEmergency || text.includes('snake bite')) {
    return {
      priority: 'EMERGENCY',
      score: 95,
      recommended_action: 'Call Ambulance 108 immediately. Keep patient calm and resting. Do not attempt self-drive.',
      route: '108',
      matched_rules: ['EMERGENCY: Immediate Red Flag Criterion'],
      disclaimer: 'This is a triage aid and not a medical diagnosis. If you feel your life is in danger, dial 108 or proceed to the nearest hospital immediately.',
      red_flag_alert: true
    };
  }

  // Urgent rules
  const urgentKeywords = ['fever', 'vomiting', 'high blood pressure', 'stomach pain', 'fracture', 'dizziness'];
  const isUrgent = urgentKeywords.some(kw => text.includes(kw)) && severity >= 5;

  if (isUrgent || severity >= 8) {
    return {
      priority: 'URGENT',
      score: 72,
      recommended_action: 'Please visit your nearest Primary Health Centre (PHC) or Community Health Centre today for clinical evaluation.',
      route: 'PHC_VISIT',
      matched_rules: ['URGENT: Sub-acute symptomatic evaluation'],
      disclaimer: 'This is a triage aid and not a medical diagnosis.',
      red_flag_alert: false
    };
  }

  // Routine rules
  return {
    priority: 'ROUTINE',
    score: 25,
    recommended_action: 'Schedule a routine consultation at your village Primary Health Centre or consult your local ASHA worker.',
    route: 'PHC_VISIT',
    matched_rules: ['ROUTINE: Outpatient general guidance'],
    disclaimer: 'This is a triage aid and not a medical diagnosis.',
    red_flag_alert: false
  };
};

/**
 * POST /api/triage
 * Forwards request to FastAPI AI service /triage/evaluate or uses robust fallback
 */
const evaluateTriage = async (req, res, next) => {
  try {
    const { symptoms, severity, duration = '1 day', age = 40, vitalSigns } = req.body;
    let triageResult = null;

    try {
      // Forward to FastAPI AI microservice
      const aiResponse = await axios.post(
        `${config.aiServiceUrl}/triage/evaluate`,
        {
          symptoms,
          severity,
          duration,
          age,
          vital_signs: vitalSigns || null
        },
        { timeout: 4000 }
      );
      triageResult = aiResponse.data;
      logger.info('Triage evaluated via FastAPI microservice', { priority: triageResult.priority });
    } catch (aiErr) {
      logger.warn('FastAPI AI service unreachable; using deterministic internal triage engine fallback', {
        message: aiErr.message
      });
      triageResult = evaluateTriageLocally(symptoms, severity, age);
    }

    // Persist triage record
    const patientId = req.user?.patientId || null;
    const triageRecord = {
      id: uuidv4(),
      patientId,
      symptoms,
      severityScore: severity,
      priority: triageResult.priority,
      recommendedAction: triageResult.recommended_action,
      route: triageResult.route,
      matchedRules: triageResult.matched_rules,
      score: triageResult.score,
      status: 'EVALUATED',
      disclaimer: triageResult.disclaimer,
      createdAt: new Date()
    };
    mockStore.triageRecords.push(triageRecord);

    return successResponse(res, {
      triageId: triageRecord.id,
      ...triageResult
    }, 'Symptom triage evaluated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/triage/queue
 * Adds patient to smart triage priority queue
 */
const enqueueTriagePatient = async (req, res, next) => {
  try {
    const { triageId, centreId } = req.body;
    const record = mockStore.triageRecords.find(t => t.id === triageId);
    if (!record) {
      return errorResponse(res, 'TRIAGE_NOT_FOUND', `Triage record '${triageId}' not found`, 404);
    }

    record.assignedCentreId = centreId || 'centre-01';
    record.status = 'QUEUED';

    return successResponse(res, record, 'Patient added to smart triage priority queue');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/triage/queue
 */
const getTriageQueue = async (req, res, next) => {
  try {
    const sorted = [...mockStore.triageRecords]
      .filter(t => t.status === 'QUEUED' || t.status === 'EVALUATED')
      .sort((a, b) => {
        // EMERGENCY (score 90+) > URGENT (50-89) > ROUTINE
        return b.score - a.score;
      });

    return successResponse(res, sorted, `Retrieved ${sorted.length} smart triage queue entries`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/triage/:id
 */
const getTriageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = mockStore.triageRecords.find(t => t.id === id);
    if (!record) {
      return errorResponse(res, 'TRIAGE_NOT_FOUND', `Triage record '${id}' not found`, 404);
    }
    return successResponse(res, record, 'Triage record retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  evaluateTriage,
  enqueueTriagePatient,
  getTriageQueue,
  getTriageById
};
