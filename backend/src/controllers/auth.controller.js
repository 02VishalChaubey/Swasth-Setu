const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { successResponse, errorResponse } = require('../utils/response');
const { prisma, mockStore } = require('../database/prisma');

const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    patientId: user.patientId || null,
    doctorId: user.doctorId || null
  };

  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn
  });

  const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn
  });

  return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'PATIENT', dateOfBirth, gender, address, district, abhaId, emergencyContact } = req.body;

    const existingUser = mockStore.users.find(u => u.email === email || u.phone === phone);
    if (existingUser) {
      return errorResponse(res, 'USER_EXISTS', 'A user with this email or phone number already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = uuidv4();
    const newUser = {
      id: userId,
      email,
      phone,
      passwordHash,
      role,
      createdAt: new Date()
    };
    mockStore.users.push(newUser);

    let patientRecord = null;
    if (role === 'PATIENT') {
      patientRecord = {
        id: uuidv4(),
        userId,
        name,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1990-01-01'),
        gender: gender || 'Not Specified',
        bloodGroup: 'B+',
        height: '170 cm',
        weight: '65 kg',
        address: address || 'Village Ramgarh, Block 2',
        village: 'Ramgarh',
        district: district || 'Howrah',
        abhaId: abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        emergencyContact: emergencyContact || '+91 98310 00000',
        createdAt: new Date()
      };
      mockStore.patients.push(patientRecord);
      newUser.patientId = patientRecord.id;
    }

    const { accessToken, refreshToken } = generateTokens(newUser);

    return successResponse(res, {
      user: {
        id: newUser.id,
        name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        patient: patientRecord
      },
      tokens: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer'
      }
    }, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    const user = mockStore.users.find(u => (email && u.email === email) || (phone && u.phone === phone));
    if (!user) {
      return errorResponse(res, 'INVALID_CREDENTIALS', 'Invalid email/phone or password', 401);
    }

    // Support password 'password123' or bcrypt check
    let isMatch = false;
    if (password === 'password123') {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return errorResponse(res, 'INVALID_CREDENTIALS', 'Invalid email/phone or password', 401);
    }

    const patient = mockStore.patients.find(p => p.userId === user.id);
    const doctor = mockStore.doctors.find(d => d.userId === user.id);

    const userPayload = {
      ...user,
      patientId: patient ? patient.id : null,
      doctorId: doctor ? doctor.id : null
    };

    const { accessToken, refreshToken } = generateTokens(userPayload);

    return successResponse(res, {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: patient ? patient.name : doctor ? doctor.name : 'Health Official',
        patient: patient || null,
        doctor: doctor || null
      },
      tokens: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer'
      }
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return errorResponse(res, 'BAD_REQUEST', 'Refresh token is required', 400);
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = mockStore.users.find(u => u.id === decoded.id);
    if (!user) {
      return errorResponse(res, 'UNAUTHORIZED', 'Invalid refresh token user', 401);
    }

    const patient = mockStore.patients.find(p => p.userId === user.id);
    const doctor = mockStore.doctors.find(d => d.userId === user.id);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      ...user,
      patientId: patient ? patient.id : null,
      doctorId: doctor ? doctor.id : null
    });

    return successResponse(res, {
      accessToken,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer'
    }, 'Token refreshed successfully');
  } catch (err) {
    return errorResponse(res, 'UNAUTHORIZED', 'Invalid or expired refresh token', 401);
  }
};

const me = async (req, res, next) => {
  try {
    const user = mockStore.users.find(u => u.id === req.user.id);
    if (!user) {
      return errorResponse(res, 'NOT_FOUND', 'User profile not found', 404);
    }

    const patient = mockStore.patients.find(p => p.userId === user.id);
    const doctor = mockStore.doctors.find(d => d.userId === user.id);

    return successResponse(res, {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      name: patient ? patient.name : doctor ? doctor.name : 'Health Official',
      patient: patient || null,
      doctor: doctor || null
    }, 'Current user profile fetched');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  return successResponse(res, null, 'Logged out successfully');
};

module.exports = {
  register,
  login,
  refresh,
  me,
  logout
};
