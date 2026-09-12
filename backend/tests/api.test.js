const request = require('supertest');
const app = require('../src/app');

describe('Swasthya Rekha - Backend API Integration Tests', () => {

  // 1. Health & Server Status
  describe('GET /health', () => {
    it('should return 200 OK with server uptime', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('healthy');
    });
  });

  // 2. Authentication APIs
  describe('POST /api/auth/register & login', () => {
    const testEmail = `test.citizen.${Date.now()}@example.com`;

    it('should register a new patient successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Pooja Barman',
          email: testEmail,
          phone: `+91 98310 ${Math.floor(10000 + Math.random() * 90000)}`,
          password: 'password123',
          role: 'PATIENT',
          district: 'Howrah'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should authenticate user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'rajesh.kumar@swasthsetu.gov.in',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.user.name).toEqual('Rajesh Kumar');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'rajesh.kumar@swasthsetu.gov.in',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toEqual('INVALID_CREDENTIALS');
    });
  });

  // 3. Patient Dashboard API
  describe('GET /api/patient/dashboard', () => {
    it('should return aggregated patient dashboard with greeting, next appointment, and queue status', async () => {
      const res = await request(app)
        .get('/api/patient/dashboard')
        .set('Authorization', 'Bearer demo-patient-token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('greeting');
      expect(res.body.data).toHaveProperty('queueStatus');
      expect(res.body.data.queueStatus.token).toEqual('T-142');
      expect(res.body.data).toHaveProperty('nextAppointment');
      expect(res.body.data).toHaveProperty('quickActions');
    });
  });

  // 4. Health Centre Discovery APIs
  describe('GET /api/centres & /api/centres/nearby', () => {
    it('should list all public health facilities', async () => {
      const res = await request(app).get('/api/centres');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should calculate proximity distances for nearby query', async () => {
      const res = await request(app).get('/api/centres/nearby?lat=22.5726&lng=88.3639');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toHaveProperty('distanceKm');
      expect(res.body.data[0].distanceKm).toBeLessThanOrEqual(res.body.data[1].distanceKm);
    });
  });

  // 5. Digital Triage APIs
  describe('POST /api/triage', () => {
    it('should trigger EMERGENCY priority with route 108 for chest pain and high severity', async () => {
      const res = await request(app)
        .post('/api/triage')
        .send({
          symptoms: ['severe chest pain', 'left arm pain'],
          severity: 8,
          duration: '1 hour',
          age: 50
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.priority).toEqual('EMERGENCY');
      expect(res.body.data.route).toEqual('108');
      expect(res.body.data).toHaveProperty('disclaimer');
    });

    it('should trigger ROUTINE priority for mild runny cold', async () => {
      const res = await request(app)
        .post('/api/triage')
        .send({
          symptoms: ['mild runny nose', 'cough'],
          severity: 2,
          duration: '2 days',
          age: 25
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.priority).toEqual('ROUTINE');
      expect(res.body.data.route).toEqual('PHC_VISIT');
    });
  });

  // 6. Queue Management APIs
  describe('GET /api/queue/my-status', () => {
    it('should return live position, wait minutes, and room number', async () => {
      const res = await request(app)
        .get('/api/queue/my-status')
        .set('Authorization', 'Bearer demo-patient-token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toEqual('T-142');
      expect(res.body.data.position).toBe(8);
      expect(res.body.data.estimatedWaitMinutes).toBe(35);
    });
  });

  // 7. Medical Records APIs
  describe('GET /api/records', () => {
    it('should fetch patient prescriptions and lab reports', async () => {
      const res = await request(app)
        .get('/api/records')
        .set('Authorization', 'Bearer demo-patient-token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // 8. Emergency SOS APIs
  describe('POST /api/emergency/request & /api/emergency/helplines', () => {
    it('should return national emergency helplines including 108', async () => {
      const res = await request(app).get('/api/emergency/helplines');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.some(h => h.number === '108')).toBe(true);
    });

    it('should log emergency alert without making physical phone calls', async () => {
      const res = await request(app)
        .post('/api/emergency/request')
        .send({
          patientPhone: '+91 98310 44921',
          latitude: 22.5726,
          longitude: 88.3639,
          locationDescription: 'Village Ramgarh, Block 2',
          emergencyType: 'CHEST_PAIN'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.emergency).toBe(true);
      expect(res.body.data.helpline).toEqual('108');
    });
  });

});
