import { createSessionMockMiddleware } from '@pins/express';
import express from 'express';
import nock from 'nock';
import { app } from '../src/server/app/app.express.js';
import { installAuthMock } from './app/mocks/auth.js';
import { installFixedDate } from './util/date.js';

/** @typedef {import('./applications/applications.test').ApplicationsGroupId} ApplicationsGroupId */

let sessionId = 1;

/**
 * @typedef {object} TestApplication
 * @property {import('express').Application} app
 * @property {(date: Date) => void} installFixedDate
 * @property {() => void} installMockApi
 * @property {() => void} teardown
 */

/**
 * @param {object} [options]
 * @param {boolean} [options.authenticated]
 * @param {Array<ApplicationsGroupId>} [options.groups]
 * @returns {TestApplication}
 */
export const createTestEnvironment = ({
	authenticated = true,
	groups = ['applications_case_admin_officer', 'applications_case_team', 'applications_inspector']
} = {}) => {
	const testApp = express();
	const getSessionID = () => sessionId;

	/** @type {import('./util/date').DateMock} */
	let dateMock;

	if (authenticated) {
		testApp.use(installAuthMock({ groups, getSessionID }));
	} else {
		testApp.use(createSessionMockMiddleware({ getSessionID }));
	}

	testApp.use(app);

	return {
		app: testApp,
		installFixedDate: (/** @type {Date} */ date) => {
			dateMock = installFixedDate(date);
		},
		installMockApi: () => {},
		teardown: () => {
			dateMock?.restore();
			nock.cleanAll();
			sessionId += 1;
		}
	};
};
