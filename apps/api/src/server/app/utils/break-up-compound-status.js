import { map, keys, isString } from 'lodash-es';

export const breakUpCompoundStatus = function(compoundStatus, appealId) {
	if (isString(compoundStatus)) { return compoundStatus };
	const compoundStateName = keys(compoundStatus)[0];
	return map(compoundStatus[compoundStateName], (v, UID) => ({ 
		subStateMachineName: UID, 
		status: v, 
		compoundStateName: compoundStateName,
		appealId: appealId
	}));
};
