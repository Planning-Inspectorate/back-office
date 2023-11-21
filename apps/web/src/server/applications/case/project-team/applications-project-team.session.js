// /**
//  * @typedef {import('express-session').Session & { showSuccessBanner?: boolean }} SessionWithSuccessBanner
//  */

// /**
//  * Save in the session whether is the first time filling the form or it has been resumed.
//  *
//  * @param {SessionWithSuccessBanner} session
//  * @returns {void}
//  */
// export const setSuccessBanner = (session) => {
// 	session.showSuccessBanner = true;
// };

// /**
//  * Get session
//  *
//  * @param {SessionWithSuccessBanner} session
//  * @returns {boolean|undefined}
//  */
// export const getSuccessBanner = (session) => {
// 	return session.showSuccessBanner;
// };

// /**
//  * Destroy session info when form gets resumed.
//  *
//  * @param {SessionWithSuccessBanner} session
//  * @returns {void}
//  */
// export const destroySuccessBanner = (session) => {
// 	delete session.showSuccessBanner;
// };
