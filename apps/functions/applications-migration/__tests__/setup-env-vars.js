import { PORT } from './setup-api.js';

process.env.API_HOST = `localhost:${PORT}`;
process.env.BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN = 'test.domain.com';
