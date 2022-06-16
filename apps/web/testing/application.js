import { createSessionMockMiddleware } from '@pins/express';
import express from 'express';
import nock from 'nock';
import { app } from '../src/server/app/app.express.js';
import { ttlCache } from '../src/server/lib/request.js';
import { installAuthMock } from './app/mocks/auth.js';
import { installMockAppealsService } from './appeals/mocks/api.js';
import { installFixedDate } from './util/date.js';

/** @typedef {import('./appeals/appeals.test').AppealGroupId} AppealGroupId */
/** @typedef {import('./applications/applications.test').ApplicationsGroupId} ApplicationsGroupId */

let sessionId = 1;

/**
 * @typedef {object} TestApplication
 * @property {import('express').Application} app
 * @property {() => void} clearHttpCache
 * @property {(date: Date) => void} installFixedDate
 * @property {() => void} installMockApi
 * @property {() => void} teardown
 */

/**
 * @param {object} [options]
 * @param {boolean} [options.authenticated]
 * @param {Array<AppealGroupId | ApplicationsGroupId>} [options.groups]
 * @returns {TestApplication}
 */
export const createTestApplication = ({
	authenticated = true,
	groups = [
		'appeals_case_officer',
		'appeals_inspector',
		'appeals_validation_officer',
		'applications_case_admin_officer',
		'applications_case_officer',
		'applications_inspector'
	]
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
		clearHttpCache: () => ttlCache.clear(),
		installFixedDate: (/** @type {Date} */ date) => {
			dateMock = installFixedDate(date);
		},
		installMockApi: () => {
			installMockAppealsService();
		},
		teardown: () => {
			dateMock?.restore();
			nock.cleanAll();
			sessionId += 1;
			ttlCache.clear();
		}
	};
};
