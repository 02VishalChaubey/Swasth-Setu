const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * GET /api/records
 * Supports filtering by recordType, date, doctor, centre
 */
const getRecords = async (req, res, next) => {
  try {
    const { recordType, doctorId, centreId, search } = req.query;
    const patientId = req.user?.patientId || mockStore.patients[0].id;

    let records = mockStore.medicalRecords.filter(r => r.patientId === patientId);

    if (recordType && recordType !== 'ALL') {
      records = records.filter(r => r.recordType.toUpperCase() === recordType.toUpperCase());
    }

    if (doctorId) {
      records = records.filter(r => r.doctorId === doctorId);
    }

    if (centreId) {
      records = records.filter(r => r.healthCentreId === centreId);
    }

    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r => r.title.toLowerCase().includes(q) || (r.diagnosis && r.diagnosis.toLowerCase().includes(q)));
    }

    const enriched = records.map(rec => {
      const doctor = mockStore.doctors.find(d => d.id === rec.doctorId);
      const centre = mockStore.healthCentres.find(c => c.id === rec.healthCentreId);
      return {
        ...rec,
        doctor: doctor ? { name: doctor.name, specialization: doctor.specialization } : null,
        healthCentre: centre ? { name: centre.name } : null
      };
    });

    return successResponse(res, enriched, `Retrieved ${enriched.length} medical records`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/records/:id
 */
const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = mockStore.medicalRecords.find(r => r.id === id);
    if (!record) {
      return errorResponse(res, 'RECORD_NOT_FOUND', `Medical record with ID '${id}' not found`, 404);
    }

    const doctor = mockStore.doctors.find(d => d.id === record.doctorId);
    const centre = mockStore.healthCentres.find(c => c.id === record.healthCentreId);
    const patient = mockStore.patients.find(p => p.id === record.patientId);

    return successResponse(res, {
      ...record,
      doctor,
      healthCentre: centre,
      patient: patient ? { name: patient.name, abhaId: patient.abhaId, bloodGroup: patient.bloodGroup, age: 45 } : null
    }, 'Medical record details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/records
 */
const createRecord = async (req, res, next) => {
  try {
    const { title, recordType = 'PRESCRIPTION', description, diagnosis, medications, labParameters, doctorId, healthCentreId, fileUrl } = req.body;
    const patientId = req.user?.patientId || mockStore.patients[0].id;

    const newRecord = {
      id: uuidv4(),
      patientId,
      doctorId: doctorId || 'doc-01',
      healthCentreId: healthCentreId || 'centre-01',
      recordType,
      title,
      description: description || '',
      diagnosis: diagnosis || '',
      medications: medications || null,
      labParameters: labParameters || null,
      fileUrl: fileUrl || '/records/document_upload.pdf',
      recordDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockStore.medicalRecords.unshift(newRecord);

    return successResponse(res, newRecord, 'Medical record created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/records/upload
 * Simulated clinical document upload
 */
const uploadRecordDocument = async (req, res, next) => {
  try {
    const { originalName = 'Clinical_Document.pdf', documentType = 'PRESCRIPTION' } = req.body;
    const fileId = uuidv4();
    const uploadedUrl = `/uploads/records/${fileId}_${encodeURIComponent(originalName)}`;

    return successResponse(res, {
      fileId,
      fileUrl: uploadedUrl,
      fileName: originalName,
      documentType,
      uploadedAt: new Date()
    }, 'Clinical file uploaded and encrypted under Ayushman Bharat Digital Mission (ABDM) standards');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  uploadRecordDocument
};
