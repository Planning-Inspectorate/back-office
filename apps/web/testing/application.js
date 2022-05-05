import express from 'express';
import { jest } from '@jest/globals';
import { noop } from 'lodash-es';
import nock from 'nock';
import { app } from '../src/server/app/app.express.js';
import { ttlCache } from '../src/server/lib/request.js';

export const createTestApplication = () => {
	const testApp = express();

	let sessionIndex = 1;
	let dateToday;

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
		clearHttpCache: () => ttlCache.clear(),
		installFixedDate: (/** @type {Date} */ date) => {
			jest.useFakeTimers({
				doNotFake: [
					'hrtime',
					'nextTick',
					'performance',
					'queueMicrotask',
					'requestAnimationFrame',
					'cancelAnimationFrame',
					'requestIdleCallback',
					'cancelIdleCallback',
					'setImmediate',
					'clearImmediate',
					'setInterval',
					'clearInterval',
					'setTimeout',
					'clearTimeout'
				]
			});
			jest.setSystemTime(date);
		},
		teardown: () => {
			// "Reset" the session by incrementing the index used by the sessionID, thus
			// leaving it no existing data in the sessionStore
			sessionIndex += 1;
			// clear any cached http requests
			ttlCache.clear();
			nock.cleanAll();
			jest.useRealTimers();
		}
	};
};
