/**
 * @typedef {import('../../relevant-representation.types.js').Representation} Representation
 * @typedef {import('../../relevant-representation.types.js').RepresentationAction} RepresentationAction
 */

/**
 * @param {string} status
 * @returns {object}
 */
const getSectionsToDisplay = (status) => {
	let sectionsToDisplay = {
		notes: false,
		referredTo: false,
		invalidReason: false
	};

	if (status === 'AWAITING_REVIEW' || status === 'WITHDRAWN') sectionsToDisplay.notes = true;
	else if (status === 'REFERRED') {
		sectionsToDisplay.notes = true;
		sectionsToDisplay.referredTo = true;
	} else if (status === 'INVALID') {
		sectionsToDisplay.notes = true;
		sectionsToDisplay.invalidReason = true;
	}

	return sectionsToDisplay;
};

/**
 * @param {Array<RepresentationAction>} representationActions
 * @returns {object|*}
 */
const getLatestWorkflowAction = (representationActions) =>
	representationActions.find((representationAction) => representationAction.type === 'STATUS');

/**
 * @param {Representation} representation
 * @returns {{redacted: string, notes: string, referredTo: string, invalidReason: string, sectionsToDisplay: object}}
 */
export const getRepresentationWorkflowValues = ({ status, redacted, representationActions }) => {
	const latestWorkflowAction = getLatestWorkflowAction(representationActions) || {};

	const { notes, referredTo, invalidReason } = latestWorkflowAction;

	return {
		redacted: redacted ? 'Redacted' : 'Unredacted',
		notes,
		referredTo,
		invalidReason,
		sectionsToDisplay: getSectionsToDisplay(status)
	};
};
