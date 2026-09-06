const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/patient/dashboard
 * Aggregates personalized status for the Swasth Setu patient dashboard screen
 */
const getDashboard = async (req, res, next) => {
  try {
    const patientId = req.user?.patientId || mockStore.patients[0].id;
    const patient = mockStore.patients.find(p => p.id === patientId) || mockStore.patients[0];

    // Find next confirmed appointment
    const nextApt = mockStore.appointments.find(
      a => a.patientId === patient.id && (a.status === 'CONFIRMED' || a.status === 'PENDING')
    ) || mockStore.appointments[0];

    let doctorInfo = null;
    let centreInfo = null;
    if (nextApt) {
      doctorInfo = mockStore.doctors.find(d => d.id === nextApt.doctorId);
      centreInfo = mockStore.healthCentres.find(c => c.id === nextApt.healthCentreId);
    }

    // Active live queue status
    const queueEntry = mockStore.queueEntries.find(
      q => q.patientId === patient.id && q.status === 'WAITING'
    ) || mockStore.queueEntries[0];

    // New lab records count
    const recentRecords = mockStore.medicalRecords.filter(r => r.patientId === patient.id);
    const newLabCount = recentRecords.filter(r => r.recordType === 'LAB_REPORT').length;

    // Time-appropriate greeting
    const hour = new Date().getHours();
    const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const responseData = {
      patient: {
        id: patient.id,
        name: patient.name,
        abhaId: patient.abhaId,
        village: patient.village || 'Ramgarh',
        district: patient.district || 'Howrah',
        bloodGroup: patient.bloodGroup || 'B+'
      },
      greeting: `${greetingTime}, ${patient.name.split(' ')[0]}!`,
      nextAppointment: nextApt ? {
        id: nextApt.id,
        bookingReference: nextApt.bookingReference,
        doctorName: doctorInfo?.name || 'Dr. Amit Sharma',
        specialization: doctorInfo?.specialization || 'General Physician',
        centreName: centreInfo?.name || 'District Hospital Salt Lake Block A',
        date: 'Thursday, 24 Oct 2026',
        time: nextApt.timeSlot,
        appointmentType: nextApt.appointmentType,
        status: nextApt.status
      } : null,
      queueStatus: queueEntry ? {
        token: queueEntry.tokenNumber,
        position: queueEntry.position,
        peopleAhead: queueEntry.peopleAhead || (queueEntry.position - 1),
        estimatedWaitMinutes: queueEntry.estimatedWaitMinutes,
        room: queueEntry.roomNumber || 'Room 204 (OPD Block A)',
        status: queueEntry.status
      } : {
        token: 'T-142',
        position: 8,
        peopleAhead: 7,
        estimatedWaitMinutes: 35,
        room: 'Room 204'
      },
      newLabRecords: newLabCount || 1,
      quickActions: [
        { id: 'find-centre', title: 'Find Centres', desc: 'Nearest PHCs & hospitals', icon: 'location_on', route: '/find-centres' },
        { id: 'triage', title: 'Symptom Triage', desc: 'Emergency & health guidance', icon: 'stethoscope', route: '/triage' },
        { id: 'book-appointment', title: 'Book Doctor', desc: 'Schedule OPD consultation', icon: 'calendar_month', route: '/bookings' },
        { id: 'records', title: 'Health Records', desc: 'Prescriptions & test results', icon: 'folder_shared', route: '/records' }
      ],
      recentActivity: recentRecords.slice(0, 3).map(r => ({
        id: r.id,
        title: r.title,
        date: r.recordDate.toISOString().split('T')[0],
        type: r.recordType,
        doctor: 'Dr. Amit Sharma',
        facility: 'District Hospital Salt Lake'
      })),
      upcomingFollowUp: {
        title: 'Routine Blood Pressure Check',
        date: 'Monday, 26 Oct 2026',
        time: '11:00 AM',
        healthWorker: 'Sunita Devi (ASHA Worker)',
        location: 'At Village Sub-Centre (Ramgarh)',
        contact: '+91 98300 22119'
      }
    };

    return successResponse(res, responseData, 'Patient dashboard data loaded successfully');
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const patientId = req.user?.patientId || mockStore.patients[0].id;
    const patient = mockStore.patients.find(p => p.id === patientId);
    if (!patient) {
      return errorResponse(res, 'NOT_FOUND', 'Patient record not found', 404);
    }
    return successResponse(res, patient, 'Patient profile fetched');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  getProfile
};
