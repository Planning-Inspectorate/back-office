import { TEST_API_PORT } from './config.js';

process.env.API_HOST = `localhost:${TEST_API_PORT}`;
process.env.BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN = 'test.domain.com';
