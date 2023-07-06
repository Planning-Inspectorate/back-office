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
 * @param {Array<object|*>} representationActions
 * @returns {object|*}
 */
const getLatestWorkflowAction = (representationActions) =>
	representationActions.find((representationAction) => representationAction.type === 'STATUS');

/**
 * @param {object|*} representation
 * @returns {{redacted: string, notes: string, referredTo: string, invalidReason: string, sectionsToDisplay: object}}
 */
export const getWorkflowValues = ({ status, redacted, representationActions }) => {
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
