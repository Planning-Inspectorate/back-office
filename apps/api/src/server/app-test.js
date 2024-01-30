import { buildApp } from './build-app.js';
import supertest from 'supertest';
import { getKeyVaultSecretsClient } from '@pins/key-vault-secrets-client';

// This instance of the app will only ever be used by Jest fixtures, and has Swagger omitted.
const app = buildApp();
const testApiKeyObject = await getKeyVaultSecretsClient(false).getSecret('test-api-key');
const testApiKey = JSON.parse(testApiKeyObject.value || '[]')[0].key;

const makeRequest = (app) => ({
	get: (url) => supertest(app).get(url).set('x-service-name', 'test').set('x-api-key', testApiKey),
	post: (url) =>
		supertest(app).post(url).set('x-service-name', 'test').set('x-api-key', testApiKey),
	put: (url) => supertest(app).put(url).set('x-service-name', 'test').set('x-api-key', testApiKey),
	patch: (url) =>
		supertest(app).patch(url).set('x-service-name', 'test').set('x-api-key', testApiKey),
	head: (url) =>
		supertest(app).head(url).set('x-service-name', 'test').set('x-api-key', testApiKey),
	delete: (url) =>
		supertest(app).delete(url).set('x-service-name', 'test').set('x-api-key', testApiKey)
});

// init supertest once for all tests to use
const request = makeRequest(app);

export { app, request };
