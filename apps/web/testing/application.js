import express from 'express';
import nock from 'nock';
import { app } from '../src/server/app/app.express.js';
import { ttlCache } from '../src/server/lib/request.js';
import { installAuthMock } from './mocks/auth.js';
import { installFixedDate } from './mocks/date.js';
import { installMockApi } from './mocks/api.js';
import { installSessionMock } from './mocks/session.js';

let sessionId = 1;

/**
 * @param {object} [options]
 * @param {boolean} [options.authenticated]
 * @param {string[]} [options.groups]
 */
export const createTestApplication = ({
	authenticated = true,
	groups = ['case_officer', 'inspector', 'validation_officer']
} = {}) => {
	const testApp = express();
	const getSessionID = () => sessionId;

	/** @type {import('./mocks/date').DateMock} */
	let dateMock;

	if (authenticated)	 {
		testApp.use(installAuthMock({ groups, getSessionID }));
	} else {
		testApp.use(installSessionMock({ getSessionID }));
	}

	testApp.use(app);

	return {
		app: testApp,
		clearHttpCache: () => ttlCache.clear(),
		installFixedDate: (/** @type {Date} */ date) => {
			dateMock = installFixedDate(date)
		},
		installMockApi,
		teardown: () => {
			dateMock?.restore();
			nock.cleanAll();
			sessionId++;
			ttlCache.clear();
		}
	};
};
