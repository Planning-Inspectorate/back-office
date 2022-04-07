/**
 * Reset the LPA state in the session.
 *
 * @param {object} session – The session containing an LPA state.
 * @returns {void}
 */
export const destroy = (session) => {
	delete session.lpa;
};

const getLpaState = (session, appealId) => {
	if (session.lpa && session.lpa.appealId === appealId) {
		return session.lpa;
	}

	destroy(session);

	return { appealId };
};

export const getQuestionnaireData = (session, appealId) => {
	const { questionnaireData } = getLpaState(session, appealId);

	return questionnaireData;
};

export const getReviewFields = (session, appealId) => {
	const { reviewFields } = getLpaState(session, appealId);

	return reviewFields;
};

export const getReviewOutcome = (session, appealId) => {
	const { reviewOutcome } = getLpaState(session, appealId);

	return reviewOutcome;
};

export const setQuestionnaireData = (session, appealId, questionnaireData) => {
	const state = getLpaState(session, appealId);

	session.lpa = { ...state, questionnaireData };
};

export const setReviewFields = (session, appealId, reviewFields) => {
	const state = getLpaState(session, appealId);

	session.lpa = { ...state, reviewFields };
};

export const setReviewOutcome = (session, appealId, reviewOutcome) => {
	const state = getLpaState(session, appealId);

	session.lpa = { ...state, reviewOutcome };
};
