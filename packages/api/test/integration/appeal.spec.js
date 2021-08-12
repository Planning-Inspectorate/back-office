const request = require('supertest');
const app = require('../../src/app');

describe('Back Office API', () => {
  it('should return the correct response for a GET request', async () => {
    const response = await request(app).get('/api/v1/appeal').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual('GET endpoint exists but has not been implemented yet');
  });

  it('should return the correct response for a POST request', async () => {
    const response = await request(app).post('/api/v1/appeal').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual('POST endpoint exists but has not been implemented yet');
  });

  it('should return the correct response for a PUT request', async () => {
    const response = await request(app).put('/api/v1/appeal').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual('PUT endpoint exists but has not been implemented yet');
  });

  it('should return the correct response for a PATCH request', async () => {
    const response = await request(app).patch('/api/v1/appeal').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual('PATCH endpoint exists but has not been implemented yet');
  });

  it('should return the correct response for an invalid request', async () => {
    const response = await request(app).get('/api/v1/appeals').send();

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
    expect(response.text).toEqual('Not Found');
  });
});
