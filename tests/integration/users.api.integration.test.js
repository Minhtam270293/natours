const request = require('supertest');
const app = require('../../app');
const { dbDisconnect, dbConnect } = require('../environment/setupMongo');
const { describe, it, expect, afterAll, beforeAll } = require('@jest/globals');
const User = require('../../models/userModel');

jest.setTimeout(30000);

process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_COOKIE_EXPIRES_IN = '1';

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe('POST /api/v1/users/login', () => {
  it('should login successfully with valid credentials', async () => {
    
    try {

      const testuser = new User({
          name: 'Test User',
          email: 'validuser@example.com',
          password: 'correctpassword',
          passwordConfirm: 'correctpassword'
      })
      const savedTestUser = await testuser.save();
       
  console.log('Sending login request...');
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'validuser@example.com',
        password: 'correctpassword',
      })
    console.log('Received response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');


    } catch(err) {
      console.log('Error ', err);
      throw err;
    }
  });
});
