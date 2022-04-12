import { body } from 'express-validator';

export const registerLpaLocals = (_, response, next) => {
	response.locals.containerSize = 'xl';
	response.locals.serviceName = 'Appeal a planning decision';
	response.locals.serviceUrl = '/lpa';
	next();
};

// All validation pipes will save into the current request all the validation errors that would be used
// by the `expressValidationErrorsInterceptor` to populate the body with.

/**
 * Validate the questionnaire form to ensure any items marked as missing or incorrect have details provided, if there is a details field provided
 *
 * @returns {void}
 */
export const lpaReviewQuestionnairePipe = [
	body('applicationPlansToReachDecisionMissingOrIncorrectDescription')
		.if(body('applicationPlansToReachDecisionMissingOrIncorrect').notEmpty())
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription')
		.if(body('policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect').notEmpty())
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('policiesOtherRelevantPoliciesMissingOrIncorrectDescription')
		.if(body('policiesOtherRelevantPoliciesMissingOrIncorrect').notEmpty())
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription')
		.if(body('policiesSupplementaryPlanningDocumentsMissingOrIncorrect').notEmpty())
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription')
		.if(body('siteConservationAreaMapAndGuidanceMissingOrIncorrect').notEmpty())
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('siteListedBuildingDescriptionMissingOrIncorrectDescription')
		.if(body('siteListedBuildingDescriptionMissingOrIncorrect').notEmpty())
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('thirdPartyApplicationNotificationMissingOrIncorrectDescription')
		.if(body('thirdPartyApplicationNotificationMissingOrIncorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong'),
	body('thirdPartyRepresentationsMissingOrIncorrectDescription')
		.if(body('thirdPartyRepresentationsMissingOrIncorrect').notEmpty())
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('thirdPartyAppealNotificationMissingOrIncorrectDescription')
		.if(body('thirdPartyAppealNotificationMissingOrIncorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
];

/**
 * Validate the check and confirm step.
 *
 * @returns {void}
 */
 export const lpaCheckAndConfirmQuestionnairePipe = body('check-and-confirm-completed')
 .custom((value, { req }) => {
	 const { reviewWork = {} } = req.session;

	 if (reviewWork.reviewOutcome === 'incomplete' && value !== 'true') {
		throw new Error('Please confirm you have completed all follow-up tasks and emails');
	 }

	 return true;
 });
