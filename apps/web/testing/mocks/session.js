import Session from 'express-session/session/session';

/**
 * @typedef {object} ExtendedStorePrototype
 * @property {(request: import('express').Request) => void} generate
 */

/** @typedef {import('express-session').Store & ExtendedStorePrototype} Store */
/** @typedef {import('express-session').Session & Partial<import('express-session').SessionData>} SessionData */

/**
 * @param {object} options
 * @param {Partial<SessionData>} [options.initialSession={}]
 * @param {() => string | number} [options.getSessionID]
 * @returns {import('express').RequestHandler}
 */
export const installSessionMock = ({ initialSession = {}, getSessionID }) => {
  /** @type {Store['generate']} */
  let originalStoreGenerateFn;

	/** @type {Map<string, SessionData>} */
	const sessions = new Map();

	return (request, response, next) => {
		// If we are using a mocked sessionID, such as in unit-testing, then use a
		// locally-implemented session that does not integrate with the store
		if (getSessionID) {
			request.sessionID = String(getSessionID());
			request.session = /** @type {*} */ (
        new Session(request, sessions.get(request.sessionID) || initialSession)
      );
			response.on('finish', () => {
				sessions.set(request.sessionID, request.session);
			});
		} else {
      /** @type {Store} */
      const sessionStore = /** @type {*} */ (request).sessionStore;
      // patch the generate method of the store to apply the initial session at
      // the point of session creation
      originalStoreGenerateFn = sessionStore.generate;

      sessionStore.generate = (request) => {
        originalStoreGenerateFn(request);
        Object.assign(request.session, initialSession);
      };
		}
		next();
	};
};
