import { buildApp } from './build-app.js';

// This instance of the app will only ever be used by Jest fixtures, and has Swagger omitted.
const app = buildApp();

export { app };
