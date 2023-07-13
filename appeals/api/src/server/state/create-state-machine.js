import {
	APPEAL_TYPE_SHORTCODE_FPA,
	APPEAL_TYPE_SHORTCODE_HAS,
	ERROR_INVALID_APPEAL_TYPE
} from '../endpoints/constants.js';
import hasStateMachine from './state-machines/has.js';
import fpaStateMachine from './state-machines/fpa.js';

/**
 * @param {string | undefined} appealType
 * @param {string} currentState
 */
const createStateMachine = (appealType, currentState) => {
	switch (appealType) {
		case APPEAL_TYPE_SHORTCODE_HAS:
			return hasStateMachine(currentState);
		case APPEAL_TYPE_SHORTCODE_FPA:
			return fpaStateMachine(currentState);
		default:
			throw new Error(ERROR_INVALID_APPEAL_TYPE);
	}
};

export default createStateMachine;
