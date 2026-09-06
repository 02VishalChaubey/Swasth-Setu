const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/doctors/profile
 */
const getDoctorProfile = async (req, res, next) => {
  try {
    const doctorId = req.user?.doctorId || mockStore.doctors[0].id;
    const doctor = mockStore.doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return errorResponse(res, 'DOCTOR_NOT_FOUND', 'Doctor profile not found', 404);
    }

    const centre = mockStore.healthCentres.find(c => c.id === doctor.healthCentreId);

    return successResponse(res, {
      ...doctor,
      healthCentre: centre
    }, 'Doctor profile retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/doctors/profile
 */
const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctorId = req.user?.doctorId || mockStore.doctors[0].id;
    const doctor = mockStore.doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return errorResponse(res, 'DOCTOR_NOT_FOUND', 'Doctor profile not found', 404);
    }

    const { bio, phone, specialization } = req.body;
    if (bio) doctor.bio = bio;
    if (phone) doctor.phone = phone;
    if (specialization) doctor.specialization = specialization;
    doctor.updatedAt = new Date();

    return successResponse(res, doctor, 'Doctor profile updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/appointments
 */
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctorId = req.user?.doctorId || mockStore.doctors[0].id;
    const appointments = mockStore.appointments.filter(a => a.doctorId === doctorId);

    const enriched = appointments.map(apt => {
      const patient = mockStore.patients.find(p => p.id === apt.patientId);
      return {
        ...apt,
        patient: patient ? { name: patient.name, phone: patient.phone, abhaId: patient.abhaId } : null
      };
    });

    return successResponse(res, enriched, `Retrieved ${enriched.length} scheduled appointments`);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/doctors/appointments/:id
 */
const updateAppointmentByDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const apt = mockStore.appointments.find(a => a.id === id);
    if (!apt) {
      return errorResponse(res, 'APPOINTMENT_NOT_FOUND', `Appointment with ID '${id}' not found`, 404);
    }

    if (status) apt.status = status;
    if (notes) apt.notes = notes;
    apt.updatedAt = new Date();

    return successResponse(res, apt, 'Appointment status updated by physician');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentByDoctor
};
