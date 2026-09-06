const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * POST /api/referrals
 */
const createReferral = async (req, res, next) => {
  try {
    const { patientId, sourceCentreId, destinationCentreId, referringDoctorId, reason, priority = 'ROUTINE', clinicalNotes } = req.body;

    const referralNumber = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReferral = {
      id: uuidv4(),
      referralNumber,
      patientId,
      sourceCentreId,
      destinationCentreId,
      referringDoctorId: referringDoctorId || null,
      reason,
      priority,
      status: 'REFERRED',
      clinicalNotes: clinicalNotes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockStore.referrals.push(newReferral);

    return successResponse(res, newReferral, 'Referral created and forwarded to destination health facility', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/referrals
 */
const getReferrals = async (req, res, next) => {
  try {
    const patientId = req.user?.patientId;
    let referrals = [...mockStore.referrals];

    if (patientId) {
      referrals = referrals.filter(r => r.patientId === patientId);
    }

    const enriched = referrals.map(ref => {
      const source = mockStore.healthCentres.find(c => c.id === ref.sourceCentreId);
      const dest = mockStore.healthCentres.find(c => c.id === ref.destinationCentreId);
      const doctor = mockStore.doctors.find(d => d.id === ref.referringDoctorId);
      return {
        ...ref,
        sourceCentre: source ? { name: source.name } : null,
        destinationCentre: dest ? { name: dest.name } : null,
        referringDoctor: doctor ? { name: doctor.name, specialization: doctor.specialization } : null
      };
    });

    return successResponse(res, enriched, `Retrieved ${enriched.length} referrals`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/referrals/:id
 */
const getReferralById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ref = mockStore.referrals.find(r => r.id === id);
    if (!ref) {
      return errorResponse(res, 'REFERRAL_NOT_FOUND', `Referral with ID '${id}' not found`, 404);
    }

    const source = mockStore.healthCentres.find(c => c.id === ref.sourceCentreId);
    const dest = mockStore.healthCentres.find(c => c.id === ref.destinationCentreId);

    return successResponse(res, {
      ...ref,
      sourceCentre: source,
      destinationCentre: dest
    }, 'Referral details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/referrals/:id/status
 */
const updateReferralStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = ['REFERRED', 'ACCEPTED', 'SCHEDULED', 'IN_CONSULTATION', 'COMPLETED'];
    if (!allowedStatuses.includes(status)) {
      return errorResponse(res, 'INVALID_STATUS', `Status must be one of: [${allowedStatuses.join(', ')}]`, 400);
    }

    const ref = mockStore.referrals.find(r => r.id === id);
    if (!ref) {
      return errorResponse(res, 'REFERRAL_NOT_FOUND', `Referral with ID '${id}' not found`, 404);
    }

    ref.status = status;
    if (notes) ref.clinicalNotes = notes;
    ref.updatedAt = new Date();

    return successResponse(res, ref, `Referral status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReferral,
  getReferrals,
  getReferralById,
  updateReferralStatus
};
