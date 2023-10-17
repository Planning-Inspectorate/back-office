import * as authSession from '../../../../../app/auth/auth-session.service.js';

/**
 * @param {object} rep 
 * @param {number} rep.id
 * @returns {number}
 */
const getRepId = rep => rep.id;

/**
 * @param {*} session
 * @param {object[]} publishableReps
 * @param {number} publishableReps[].id
 * @returns {{json:  {representationIds: number[], actionBy: string | undefined}}} 
 */
export const getPublishableRepsPayload = (session, publishableReps) => {
	return { 
		json: {
			representationIds: publishableReps.map(getRepId),
			actionBy: authSession.getAccount(session)?.name
		}
	}
}
