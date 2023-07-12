/**
 * @typedef {import('../../applications.types').S51Advice} S51Advice
 * @typedef {import('express-session').Session & { s51?: Partial<S51Advice> }} SessionWithS51
 */

/**
 * Get the case-officer state from the session.
 *
 * @param {SessionWithS51} session
 * @returns {Partial<S51Advice> | null}
 */
export const getSessionS51 = (session) => session.s51 || null;

/**
 * @param {SessionWithS51} session
 * @returns {void}
 */
export const destroySessionS51 = (session) => {
	delete session.s51;
};

/**
 * Set the reviewed questionnaire data after completing a review.
 *
 * @param {SessionWithS51} session
 * @param {Partial<S51Advice>} newS51Data
 * @returns {void}
 */
export const setSessionS51 = (session, newS51Data) => {
	session.s51 = { ...session.s51, ...newS51Data };
};
