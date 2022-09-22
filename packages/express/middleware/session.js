/** @typedef {Record<string, *> & import('express-session').SessionData } SessionData */
/** @typedef {import('express-session').Session & SessionData} Session */

/**
 * @param {object} options
 * @param {Record<string, unknown>} [options.initialSession={}]
 * @param {() => string | number} [options.getSessionID]
 * @returns {import('express').RequestHandler}
 */
export const createSessionMockMiddleware = ({ initialSession = {}, getSessionID }) => {
	/** @type {Map<string, Session>} */
	const sessions = new Map();
	const sessionInitializer = createSessionInitializerMiddleware({ initialSession });

	return (request, response, next) => {
		// If we are using a mocked sessionID, such as in unit-testing, then use a
		// locally-implemented session that does not integrate with the store
		if (getSessionID) {
			request.sessionID = String(getSessionID());

			let session = sessions.get(request.sessionID);

			if (!session) {
				session = /** @type {Session} */ ({
					...initialSession,
					destroy(callback) {
						for (const property in session) {
							if (Object.prototype.hasOwnProperty.call(session, property)) {
								delete session[property];
							}
						}
						callback(null);
						return this;
					},
					regenerate(callback) {
						callback(null);
					},
					save(callback) {
						if (callback) callback(null);
					}
				});
				sessions.set(request.sessionID, session);
			}
			request.session = session;

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
		if (request.sessionStore && !originalStoreGenerateFunction) {
			// patch the generate method of the store to apply the initial session at
			// the point of session creation
			originalStoreGenerateFunction = request.sessionStore.generate;

			request.sessionStore.generate = (/** @type {*} */ request_) => {
				originalStoreGenerateFunction(request_);
				Object.assign(request_.session, initialSession);
			};
			request.sessionStore.generate(request);
		}
		next();
	};
};
