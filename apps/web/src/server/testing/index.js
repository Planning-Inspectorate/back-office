import express from 'express';
import { ttlCache } from '../lib/request.js';
import { noop } from 'lodash-es';
import { app } from '../app/app.express.js';
import nock from 'nock';

export const createTestApplication = () => {
	const testApp = express();

	let sessionIndex = 1;

	// Monkey patch sessionID so we can maintain a consistent session
	testApp.use((request, _, next) => {
		Object.defineProperty(request, 'sessionID', {
			get: () => `TestSessionID${sessionIndex}`,
			set: noop
		});
		next();
	});

	testApp.use(app);

	return {
		app: testApp,
		teardown: () => {
			// "Reset" the session by incrementing the index used by the sessionID, thus
			// leaving it no existing data in the sessionStore
			sessionIndex += 1;
			// clear any cached http requests
			ttlCache.clear();
			nock.cleanAll();
		}
	};
};
