/**
 * @typedef {import('./applications-s51.types.js').S51AdviceForm} S51AdviceForm
 * @typedef {import('express-session').Session & { s51?: Partial<S51AdviceForm> }} SessionWithS51
 */

/**
 * Get the data for the S51 advice that is being created
 *
 * @param {SessionWithS51} session
 * @returns {Partial<S51AdviceForm> | null}
 */
export const getSessionS51 = (session) => session.s51 || null;

/**
 * @param {SessionWithS51} session
 * @returns {void}
 */
export const destroySessionS51 = (session) => {
	if (session.s51) delete session.s51;
};

/**
 * Set the data for the S51 advice that is being created
 *
 * @param {SessionWithS51} session
 * @param {Partial<S51AdviceForm>} newS51Data
 * @returns {void}
 */
export const setSessionS51 = (session, newS51Data) => {
	session.s51 = { ...session.s51, ...newS51Data };
};
