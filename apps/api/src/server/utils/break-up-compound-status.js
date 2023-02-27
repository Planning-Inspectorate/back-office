import { isString, keys, map } from 'lodash-es';

/**
 * @param {Record<string,any>[]} compoundStatus
 * @param {string} appealId
 * @returns {Record<string, any>[]}
 */
export const breakUpCompoundStatus = (compoundStatus, appealId) => {
	if (isString(compoundStatus)) return compoundStatus;

	const compoundStateName = keys(compoundStatus)[0];

	return map(compoundStatus[compoundStateName], (v, UID) => ({
		subStateMachineName: UID,
		status: v,
		compoundStateName,
		appealId
	}));
};
