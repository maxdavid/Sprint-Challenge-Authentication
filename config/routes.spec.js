const request = require('supertest');

const server = require('../api/server');
const db = require('../database/dbConfig');

describe('server', () => {
  // beforeEach(async () => {
  //   guarantees that the table is cleaned out before any of the tests run
  //   await db('users').truncate();
  // });

  // cross-env DB_ENV=testing
  it('tests are running with DB_ENV set as "testing"', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  const test_account = {
    username: 'austen3',
    password: 'lambda'
  };
  let token = '';

  describe('REGISTER USER with user data', () => {
    it('returns 201 Created', () => {
      return request(server)
        .post('/api/auth/register')
        .send(test_account)
        .then(res => {
          expect(res.status).toBe(201);
        });
    });
  });

  describe('REGISTER USER without user data', () => {
    it('returns 500', () => {
      return request(server)
        .post('/api/auth/register')
        .then(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  describe('LOGIN USER with user data', () => {
    it('returns 200 OK', () => {
      return request(server)
        .post('/api/auth/login')
        .send(test_account)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
  });

  describe('LOGIN USER without user data', () => {
    it('returns 500', () => {
      return request(server)
        .post('/api/auth/login')
        .then(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  describe('GET /api/jokes without token', () => {
    it('returns 401 Unauthorized', () => {
      return request(server)
        .get('/api/jokes')
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
  });

  // With token
  describe('GET /api/jokes with token', () => {
    it('returns 200 OK', () => {
      return request(server)
        .post('/api/auth/login')
        .send(test_account)
        .then(res => {
          token = res.body.token;
          expect(res.status).toBe(200);
        });
    });

    it('returns 200 OK', () => {
      return request(server)
        .get('/api/jokes')
        .set('Authorization', token)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });

    it('should return an array', () => {
      return request(server)
        .get('/api/jokes')
        .set('Authorization', token)
        .then(res => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
