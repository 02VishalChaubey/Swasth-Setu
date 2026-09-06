const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/queue/my-status
 * Real-time queue tracker for current user
 */
const getMyQueueStatus = async (req, res, next) => {
  try {
    const patientId = req.user?.patientId || mockStore.patients[0].id;
    const queueEntry = mockStore.queueEntries.find(
      q => q.patientId === patientId && q.status === 'WAITING'
    ) || mockStore.queueEntries[0];

    if (!queueEntry) {
      return successResponse(res, null, 'No active queue token found for user');
    }

    const centre = mockStore.healthCentres.find(c => c.id === queueEntry.healthCentreId);
    const doctor = mockStore.doctors.find(d => d.id === queueEntry.doctorId);

    return successResponse(res, {
      token: queueEntry.tokenNumber,
      position: queueEntry.position,
      peopleAhead: queueEntry.peopleAhead !== undefined ? queueEntry.peopleAhead : Math.max(0, queueEntry.position - 1),
      estimatedWaitMinutes: queueEntry.estimatedWaitMinutes,
      room: queueEntry.roomNumber || 'Room 204 (OPD Block A)',
      status: queueEntry.status,
      priority: queueEntry.priority,
      centre: centre ? { name: centre.name, address: centre.address } : null,
      doctor: doctor ? { name: doctor.name, specialization: doctor.specialization } : null,
      notificationActive: true
    }, 'Live queue status retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/queue/:centreId
 */
const getCentreQueue = async (req, res, next) => {
  try {
    const { centreId } = req.params;
    const queue = mockStore.queueEntries.filter(
      q => q.healthCentreId === centreId && q.status === 'WAITING'
    ).sort((a, b) => a.position - b.position);

    return successResponse(res, {
      centreId,
      totalWaiting: queue.length,
      currentServingToken: queue[0]?.tokenNumber || 'None',
      queue
    }, 'Centre queue retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/queue/join
 */
const joinQueue = async (req, res, next) => {
  try {
    const { centreId, doctorId, priority = 'ROUTINE' } = req.body;
    const patientId = req.user?.patientId || mockStore.patients[0].id;

    // Existing active token check
    const existing = mockStore.queueEntries.find(
      q => q.patientId === patientId && q.status === 'WAITING' && q.healthCentreId === centreId
    );
    if (existing) {
      return successResponse(res, existing, 'You already have an active queue token at this centre');
    }

    const currentWaitingAtCentre = mockStore.queueEntries.filter(
      q => q.healthCentreId === centreId && q.status === 'WAITING'
    );

    const tokenNumber = `T-${Math.floor(100 + Math.random() * 900)}`;
    const position = currentWaitingAtCentre.length + 1;
    const estimatedWaitMinutes = position * 5;

    const newQueueEntry = {
      id: uuidv4(),
      tokenNumber,
      patientId,
      healthCentreId: centreId,
      doctorId: doctorId || null,
      priority,
      position,
      peopleAhead: Math.max(0, position - 1),
      status: 'WAITING',
      estimatedWaitMinutes,
      roomNumber: 'Room 204 (OPD Block A)',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockStore.queueEntries.push(newQueueEntry);

    return successResponse(res, newQueueEntry, 'Joined live queue successfully. Your token is generated.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/queue/:id/status
 */
const updateQueueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const entry = mockStore.queueEntries.find(q => q.id === id);
    if (!entry) {
      return errorResponse(res, 'QUEUE_ENTRY_NOT_FOUND', `Queue entry '${id}' not found`, 404);
    }

    entry.status = status;
    entry.updatedAt = new Date();
    if (status === 'CALLED') entry.calledAt = new Date();
    if (status === 'COMPLETED') entry.completedAt = new Date();

    return successResponse(res, entry, `Queue entry updated to '${status}'`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyQueueStatus,
  getCentreQueue,
  joinQueue,
  updateQueueStatus
};
