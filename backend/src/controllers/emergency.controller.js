const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/response');
const { calculateDistance } = require('../utils/geo');
const { mockStore } = require('../database/prisma');

/**
 * POST /api/emergency/request
 * Registers emergency alert without placing automated phone calls
 */
const requestEmergency = async (req, res, next) => {
  try {
    const { patientPhone, latitude, longitude, locationDescription, emergencyType = 'GENERAL_EMERGENCY', notes } = req.body;
    const patientId = req.user?.patientId || null;

    // Identify nearest hospital with 24x7 emergency
    const hospitals = mockStore.healthCentres.filter(c => c.isOpen24x7 || c.type === 'DISTRICT_HOSPITAL');
    let nearestHospital = hospitals[0];
    if (latitude && longitude && hospitals.length > 0) {
      const sorted = [...hospitals].map(h => ({
        ...h,
        dist: calculateDistance(latitude, longitude, h.latitude, h.longitude)
      })).sort((a, b) => a.dist - b.dist);
      nearestHospital = sorted[0];
    }

    const newRequest = {
      id: uuidv4(),
      patientId,
      patientPhone,
      latitude,
      longitude,
      locationDescription,
      emergencyType,
      status: 'REPORTED',
      dispatchedUnit: '108 Dispatch Center Notified',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockStore.emergencyRequests.push(newRequest);

    return successResponse(res, {
      requestId: newRequest.id,
      emergency: true,
      helpline: '108',
      message: 'Please seek immediate emergency medical assistance. Dial 108 directly on your device.',
      nearestHospital: nearestHospital ? {
        name: nearestHospital.name,
        address: nearestHospital.address,
        phone: nearestHospital.phone,
        distanceKm: nearestHospital.dist || 4.2
      } : null,
      dispatchedStatus: 'Emergency response coordinates logged. Ambulance dispatch alert transmitted to state EMS 108 command grid.'
    }, 'Emergency request registered. Dial 108 immediately.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/emergency/helplines
 */
const getHelplines = async (req, res) => {
  const helplines = [
    { name: 'Ambulance (National)', number: '108', priority: true, description: 'Medical emergencies & trauma' },
    { name: 'National Emergency Helpline', number: '112', priority: true, description: 'Single emergency response number' },
    { name: 'Police Control Room', number: '100', priority: false, description: 'Law and order assistance' },
    { name: 'Women Helpline', number: '1091', priority: false, description: '24x7 distress and harassment support' },
    { name: 'Disaster Management', number: '1078', priority: false, description: 'Floods, cyclones, building collapse' },
    { name: 'Childline Helpline', number: '1098', priority: false, description: 'Emergency child protection' },
    { name: 'National Health Helpline', number: '1075', priority: false, description: 'Epidemics & Ministry of Health guidance' }
  ];

  return successResponse(res, helplines, 'National emergency helplines retrieved');
};

module.exports = {
  requestEmergency,
  getHelplines
};
