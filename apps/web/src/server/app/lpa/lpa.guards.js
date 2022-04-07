import * as lpaSession from './lpa-session.service.js';

export function decideQuestionnaireReviewOutcomeGuard({ params, session }, response, next) {
	if (params.appealId &&
		lpaSession.getQuestionnaireData(session, params.appealId)
	) {
		return next();
	}

	return response.redirect('/lpa');
}

export function checkAndConfirmGuard({ params, session }, response, next) {
	if (params.appealId &&
		lpaSession.getQuestionnaireData(session, params.appealId) &&
		lpaSession.getReviewOutcome(session, params.appealId))
	{
		return next();
	}

	return response.redirect('/lpa');
}

export function viewReviewCompleteGuard({ params, session }, response, next) {
	if (params.appealId &&
		lpaSession.getQuestionnaireData(session, params.appealId) &&
		lpaSession.getReviewOutcome(session, params.appealId))
	{
		return next();
	}

	return response.redirect('/lpa');
}
