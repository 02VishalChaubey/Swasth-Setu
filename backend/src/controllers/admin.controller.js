const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/admin/stats
 */
const getSystemStats = async (req, res, next) => {
  try {
    const stats = {
      totalPatients: mockStore.patients.length + 18, // 20 demo total
      totalDoctors: mockStore.doctors.length + 8,    // 10 demo total
      totalHealthCentres: mockStore.healthCentres.length + 5, // 8 demo total
      totalAppointments: mockStore.appointments.length + 19,
      activeQueueTokens: mockStore.queueEntries.filter(q => q.status === 'WAITING').length + 14,
      totalMedicalRecords: mockStore.medicalRecords.length + 18,
      totalVitalsRecorded: mockStore.vitals.length + 28,
      emergencyAlertsToday: mockStore.emergencyRequests.length + 3,
      systemUptime: '99.98%',
      databaseStatus: 'CONNECTED (PostgreSQL 16 TLS)',
      aiTriageEngine: 'ACTIVE (FastAPI v1.0.0)'
    };

    return successResponse(res, stats, 'System operational overview statistics retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/doctors/:id/verify
 */
const verifyDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified = true } = req.body;

    const doctor = mockStore.doctors.find(d => d.id === id);
    if (!doctor) {
      return errorResponse(res, 'DOCTOR_NOT_FOUND', `Doctor with ID '${id}' not found`, 404);
    }

    doctor.isVerified = isVerified;
    doctor.updatedAt = new Date();

    return successResponse(res, doctor, `Doctor medical registration verification status set to ${isVerified}`);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/centres
 */
const createHealthCentre = async (req, res, next) => {
  try {
    const {
      name,
      type = 'PRIMARY_HEALTH_CENTRE',
      address,
      district = 'Howrah',
      city,
      latitude,
      longitude,
      phone,
      totalBeds = 10,
      availableServices = ['General OPD', 'Vaccination', 'Basic Labs']
    } = req.body;

    const newCentre = {
      id: uuidv4(),
      name,
      type,
      address,
      district,
      city: city || district,
      state: 'West Bengal',
      pincode: '711101',
      latitude: latitude || 22.5726,
      longitude: longitude || 88.3639,
      phone: phone || '+91 33 2660 0000',
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@wbhealth.gov.in`,
      openingHours: '09:00 AM - 05:00 PM',
      isOpen24x7: type === 'DISTRICT_HOSPITAL',
      totalBeds,
      availableBeds: Math.floor(totalBeds * 0.4),
      availableServices,
      queueLength: 0,
      estimatedWaitTime: '10 mins',
      medicineAvailability: 'Adequate',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockStore.healthCentres.push(newCentre);

    return successResponse(res, newCentre, 'Health Centre provisioned into state registry', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    let users = mockStore.users.map(u => ({
      id: u.id,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt
    }));

    if (role) {
      users = users.filter(u => u.role === role);
    }

    return successResponse(res, users, `Retrieved ${users.length} registered system users`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/queues
 */
const getActiveQueuesSummary = async (req, res, next) => {
  try {
    const summary = mockStore.healthCentres.map(c => {
      const centreQueues = mockStore.queueEntries.filter(q => q.healthCentreId === c.id);
      return {
        centreId: c.id,
        centreName: c.name,
        type: c.type,
        waitingCount: centreQueues.filter(q => q.status === 'WAITING').length,
        averageWaitMinutes: c.estimatedWaitTime
      };
    });

    return successResponse(res, summary, 'Active outpatient queue monitoring summary');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSystemStats,
  verifyDoctor,
  createHealthCentre,
  getAllUsers,
  getActiveQueuesSummary
};
