const { successResponse, errorResponse } = require('../utils/response');
const { calculateDistance } = require('../utils/geo');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/centres
 * Supports filtering by district, city, facilityType, specialization, openNow, medicineAvailable
 */
const getCentres = async (req, res, next) => {
  try {
    const { district, city, facilityType, specialization, openNow, medicineAvailable, lat, lng } = req.query;

    let results = [...mockStore.healthCentres];

    if (district) {
      results = results.filter(c => c.district.toLowerCase().includes(district.toLowerCase()));
    }

    if (city) {
      results = results.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
    }

    if (facilityType) {
      results = results.filter(c => c.type.toLowerCase() === facilityType.toLowerCase() || c.type.replace(/_/g, ' ').toLowerCase().includes(facilityType.toLowerCase()));
    }

    if (specialization) {
      results = results.filter(c => c.availableServices.some(s => s.toLowerCase().includes(specialization.toLowerCase())));
    }

    if (openNow === 'true') {
      results = results.filter(c => c.isOpen24x7 || c.openingHours.includes('09:00'));
    }

    if (medicineAvailable === 'true') {
      results = results.filter(c => c.medicineAvailability.toLowerCase().includes('in-stock') || c.medicineAvailability.toLowerCase().includes('high'));
    }

    // Annotate with distance if user coordinates provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      results = results.map(centre => ({
        ...centre,
        distanceKm: calculateDistance(userLat, userLng, centre.latitude, centre.longitude)
      })).sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return successResponse(res, results, `Retrieved ${results.length} health facilities`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/centres/:id
 */
const getCentreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const centre = mockStore.healthCentres.find(c => c.id === id);
    if (!centre) {
      return errorResponse(res, 'CENTRE_NOT_FOUND', `Health facility with ID '${id}' not found`, 404);
    }

    const availableDoctors = mockStore.doctors.filter(d => d.healthCentreId === id);

    return successResponse(res, {
      ...centre,
      doctors: availableDoctors
    }, 'Health facility details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/centres/nearby?lat=...&lng=...
 * Calculates Haversine distance from coordinates and sorts by closest
 */
const getNearbyCentres = async (req, res, next) => {
  try {
    const { lat, lng, radiusKm = 50 } = req.query;

    if (!lat || !lng) {
      return errorResponse(res, 'MISSING_COORDINATES', 'Latitude (lat) and longitude (lng) query parameters are required', 400);
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radiusKm);

    const sortedCentres = mockStore.healthCentres
      .map(centre => {
        const distanceKm = calculateDistance(userLat, userLng, centre.latitude, centre.longitude);
        return {
          ...centre,
          distanceKm
        };
      })
      .filter(centre => centre.distanceKm <= maxRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return successResponse(res, sortedCentres, `Found ${sortedCentres.length} health facilities within ${maxRadius}km radius`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCentres,
  getCentreById,
  getNearbyCentres
};
