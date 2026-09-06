const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/doctors
 */
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, centreId } = req.query;
    let doctors = [...mockStore.doctors];

    if (specialization) {
      doctors = doctors.filter(d => d.specialization.toLowerCase().includes(specialization.toLowerCase()));
    }

    if (centreId) {
      doctors = doctors.filter(d => d.healthCentreId === centreId);
    }

    return successResponse(res, doctors, `Retrieved ${doctors.length} verified doctors`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/:id
 */
const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = mockStore.doctors.find(d => d.id === id);
    if (!doctor) {
      return errorResponse(res, 'DOCTOR_NOT_FOUND', `Doctor with ID '${id}' not found`, 404);
    }

    const centre = mockStore.healthCentres.find(c => c.id === doctor.healthCentreId);

    return successResponse(res, {
      ...doctor,
      healthCentre: centre || null
    }, 'Doctor profile retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/:id/availability
 */
const getDoctorAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = mockStore.doctors.find(d => d.id === id);
    if (!doctor) {
      return errorResponse(res, 'DOCTOR_NOT_FOUND', `Doctor with ID '${id}' not found`, 404);
    }

    // Return standard morning and afternoon OPD slots
    const availableSlots = [
      { time: '09:00 AM', isAvailable: true },
      { time: '09:30 AM', isAvailable: true },
      { time: '10:00 AM', isAvailable: false }, // already booked
      { time: '10:30 AM', isAvailable: true },
      { time: '11:00 AM', isAvailable: true },
      { time: '11:30 AM', isAvailable: true },
      { time: '02:00 PM', isAvailable: true },
      { time: '02:30 PM', isAvailable: true },
      { time: '03:00 PM', isAvailable: true }
    ];

    return successResponse(res, {
      doctorId: id,
      doctorName: doctor.name,
      opdDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      slots: availableSlots
    }, 'Doctor appointment availability slots retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/appointments
 * Prevents double booking of the same doctor & time slot
 */
const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, healthCentreId, appointmentDate, timeSlot, appointmentType = 'IN_PERSON', symptoms, notes } = req.body;
    const patientId = req.user?.patientId || mockStore.patients[0].id;

    // Check for double booking
    const normalizedDate = new Date(appointmentDate).toISOString().split('T')[0];
    const isDoubleBooked = mockStore.appointments.some(
      a =>
        a.doctorId === doctorId &&
        a.appointmentDate.toISOString().split('T')[0] === normalizedDate &&
        a.timeSlot === timeSlot &&
        a.status !== 'CANCELLED'
    );

    if (isDoubleBooked) {
      return errorResponse(
        res,
        'SLOT_UNAVAILABLE',
        `Doctor is already booked for time slot ${timeSlot} on ${normalizedDate}. Please pick another slot.`,
        409
      );
    }

    const bookingReference = `SS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
    const newAppointment = {
      id: uuidv4(),
      bookingReference,
      patientId,
      doctorId,
      healthCentreId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      appointmentType,
      status: 'CONFIRMED',
      symptoms: symptoms || 'General OPD consultation',
      notes: notes || '',
      queueToken: `T-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockStore.appointments.push(newAppointment);

    const doctor = mockStore.doctors.find(d => d.id === doctorId);
    const centre = mockStore.healthCentres.find(c => c.id === healthCentreId);

    return successResponse(res, {
      ...newAppointment,
      doctorName: doctor?.name || 'Assigned Physician',
      specialization: doctor?.specialization || 'General Medicine',
      centreName: centre?.name || 'Primary Health Centre'
    }, 'Appointment confirmed successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments
 */
const getAppointments = async (req, res, next) => {
  try {
    const patientId = req.user?.patientId;
    let appointments = [...mockStore.appointments];

    if (patientId) {
      appointments = appointments.filter(a => a.patientId === patientId);
    }

    const enriched = appointments.map(apt => {
      const doctor = mockStore.doctors.find(d => d.id === apt.doctorId);
      const centre = mockStore.healthCentres.find(c => c.id === apt.healthCentreId);
      return {
        ...apt,
        doctor: doctor ? { name: doctor.name, specialization: doctor.specialization } : null,
        healthCentre: centre ? { name: centre.name, address: centre.address } : null
      };
    });

    return successResponse(res, enriched, `Retrieved ${enriched.length} appointments`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments/:id
 */
const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = mockStore.appointments.find(a => a.id === id);
    if (!appointment) {
      return errorResponse(res, 'APPOINTMENT_NOT_FOUND', `Appointment with ID '${id}' not found`, 404);
    }

    const doctor = mockStore.doctors.find(d => d.id === appointment.doctorId);
    const centre = mockStore.healthCentres.find(c => c.id === appointment.healthCentreId);

    return successResponse(res, {
      ...appointment,
      doctor,
      healthCentre: centre
    }, 'Appointment details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/appointments/:id/cancel
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = mockStore.appointments.find(a => a.id === id);
    if (!appointment) {
      return errorResponse(res, 'APPOINTMENT_NOT_FOUND', `Appointment with ID '${id}' not found`, 404);
    }

    appointment.status = 'CANCELLED';
    appointment.updatedAt = new Date();

    return successResponse(res, appointment, 'Appointment has been cancelled');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorAvailability,
  createAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment
};
