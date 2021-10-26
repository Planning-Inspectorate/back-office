const request = require('supertest');
const mockDbRecord = require('../data/hasAppealSubmissionDbRecord');

jest.mock('../../src/lib/db-wrapper', () => ({
  find: jest.fn().mockReturnValue([mockDbRecord]),
  insert: jest.fn().mockReturnValue(mockDbRecord),
  sequelize: jest.fn().mockReturnValue({
    define: jest.fn(),
  }),
}));

const app = require('../../src/app');

describe('Back Office API', () => {
  it('should return the correct response for a GET request', async () => {
    const response = await request(app).get('/api/v1/appeal').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([mockDbRecord]);
  });

  it('should return the correct response for a POST request', async () => {
    const response = await request(app).post('/api/v1/appeal').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDbRecord);
  });

  it('should return the correct response for an invalid request', async () => {
    const response = await request(app).get('/api/v1/appeals').send();

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
    expect(response.text).toEqual('Not Found');
  });
});
