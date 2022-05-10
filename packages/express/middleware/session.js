import { noopHandler } from '../utils/helpers.js';

/** @typedef {import('express-session').Session & Partial<import('express-session').SessionData>} Session */

/**
 * @param {object} options
 * @param {Partial<import('express-session').SessionData>} [options.initialSession={}]
 * @param {() => string | number} [options.getSessionID]
 * @returns {import('express').RequestHandler}
 */
export const createSessionMockMiddleware = ({ initialSession = {}, getSessionID }) => {
	/** @type {Map<string, Session>} */
	const sessions = new Map();
	const sessionInitializer = getSessionID
		? noopHandler
		: createSessionInitializerMiddleware({ initialSession });

	return (request, response, next) => {
		// If we are using a mocked sessionID, such as in unit-testing, then use a
		// locally-implemented session that does not integrate with the store
		if (getSessionID) {
			request.sessionID = String(getSessionID());
			request.session =
				sessions.get(request.sessionID) || /** @type {Session} */ ({ ...initialSession });
			response.on('finish', () => {
				sessions.set(request.sessionID, request.session);
			});
			next();
		} else {
			sessionInitializer(request, response, next);
		}
	};
};

/**
 * Extend the request with the public `sessionStore` property not added in the
 * type definition supplied with express-session.
 *
 * @typedef {import('express').Request & { sessionStore?: Store }} RequestWithSession
 */

/**
 * @typedef {object} ExtendedStorePrototype
 * @property {(request: import('express').Request) => void} generate
 */

/**
 * @typedef {import('express-session').Store & ExtendedStorePrototype} Store
 */

/**
 * @param {object} options
 * @param {Partial<import('express-session').SessionData>} options.initialSession
 * @returns {import('express').RequestHandler}
 */
export const createSessionInitializerMiddleware = ({ initialSession }) => {
	/** @type {Store['generate']} */
	let originalStoreGenerateFunction;

	return (/** @type {RequestWithSession} */ request, _, next) => {
		if (request.sessionStore) {
			// patch the generate method of the store to apply the initial session at
			// the point of session creation
			originalStoreGenerateFunction = request.sessionStore.generate;

			request.sessionStore.generate = (request_) => {
				originalStoreGenerateFunction(request_);
				Object.assign(request_.session, initialSession);
			};
		}
		next();
	};
};
