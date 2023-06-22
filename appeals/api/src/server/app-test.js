import { buildApp } from './build-app.js';
import supertest from 'supertest';

// This instance of the app will only ever be used by Jest fixtures, and has Swagger omitted.
const app = buildApp();

// init supertest once for all tests to use
const request = supertest(app);

export { app, request };
