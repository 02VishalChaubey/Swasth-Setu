const { successResponse, errorResponse } = require('../utils/response');
const { calculateDistance } = require('../utils/geo');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/pharmacies/nearby?lat=...&lng=...
 */
const getNearbyPharmacies = async (req, res, next) => {
  try {
    const { lat, lng, radiusKm = 50 } = req.query;

    if (!lat || !lng) {
      return errorResponse(res, 'MISSING_COORDINATES', 'Latitude (lat) and longitude (lng) are required', 400);
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radiusKm);

    const sortedPharmacies = mockStore.pharmacies
      .map(p => ({
        ...p,
        distanceKm: calculateDistance(userLat, userLng, p.latitude, p.longitude)
      }))
      .filter(p => p.distanceKm <= maxRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return successResponse(res, sortedPharmacies, `Found ${sortedPharmacies.length} pharmacies nearby`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/pharmacies/search?medicine=...
 */
const searchMedicine = async (req, res, next) => {
  try {
    const { medicine } = req.query;
    if (!medicine) {
      return errorResponse(res, 'MISSING_PARAM', 'Query parameter "medicine" is required', 400);
    }

    const q = medicine.toLowerCase();
    const matches = mockStore.pharmacies
      .filter(p => p.medicines.some(m => m.toLowerCase().includes(q)))
      .map(p => ({
        pharmacyId: p.id,
        pharmacyName: p.name,
        address: p.address,
        district: p.district,
        phone: p.phone,
        openingHours: p.openingHours,
        is24x7: p.is24x7,
        matchedMedicines: p.medicines.filter(m => m.toLowerCase().includes(q)),
        inStock: true
      }));

    return successResponse(res, matches, `Found ${matches.length} pharmacies with '${medicine}' in stock`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNearbyPharmacies,
  searchMedicine
};
