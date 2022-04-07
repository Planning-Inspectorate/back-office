export function postReviewQuestionnaireGuard({ session }, response, next) {
	if (!session.questionnaireData) {
		return response.redirect('/lpa');
	}

	return next();
}

export function checkAndConfirmGuard({ session }, response, next) {
	if (!session.appealId ||
		!session.questionnaireData ||
		!session.reviewWork ||
		!session.reviewWork.reviewOutcome)
	{
		return response.redirect('/lpa');
	}

	return next();
}

export function getReviewCompleteGuard({ session }, response, next) {
	if (!session.questionnaireData ||
		!session.reviewWork ||
		!session.reviewWork.reviewOutcome)
	{
		return response.redirect('/lpa');
	}

	return next();
}
