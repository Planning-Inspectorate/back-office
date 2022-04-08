import { mapMulterErrorToValidationError } from '@pins/express';
import { validatePostcode } from '@pins/platform';
import { memoryStorage } from '../../lib/multer.js';
import { body, checkSchema } from 'express-validator';
import multer from 'multer';

export const registerValidationLocals = (_, response, next) => {
	response.locals.serviceName = 'Appeal a planning decision';
	response.locals.serviceUrl = '/validation';
	next();
};

// All validation pipes will save into the current request all the validation errors that would be used
// by the `expressValidationErrorsInterceptor` to populate the body with.

/**
 * Validate the appeal outcome form to ensure it has at least 1 answer.
 *
 * @returns {void}
 */
export const validateOutcomePipe = body('reviewOutcome')
	.notEmpty()
	.withMessage((_, { req }) =>
		req.session.appealData.AppealStatus === 'incomplete'
			? 'Select if the appeal is valid or invalid'
			: 'Select if the appeal is valid or invalid, or if something is missing or wrong'
	)
	.bail()
	.isIn(['valid', 'invalid', 'incomplete'])
	.withMessage('Select if the appeal is valid or invalid, or if something is missing or wrong');

/**
 * Validate the appeal details form that it has content and it doesn't exceed 500 chars.
 *
 * @returns {void}
 */
export const validateValidAppealDetailsPipe = body('valid-appeal-details')
	.escape()
	.trim()
	.notEmpty()
	.withMessage('Enter a description of development')
	.bail()
	.isLength({ max: 500 })
	.withMessage('Word count exceeded');

/**
 * Validate the outcome incomplete form to ensure it has at least 1 answer.
 * If "missing or incorrect documents" is checked, validate missingOrWrongDocsReasons to ensure a reason has been selected.
 * If "otherReason" is checked, validate otherReasons to ensure a reason has been provided.
 * It will save into the current request all the validation errors that would be used
 * by the `expressValidationErrorsInterceptor` to populate the body with.
 *
 * @returns {void}
 */
export const validateOutcomeIncompletePipe = [
	body('incompleteReasons')
		.notEmpty()
		.withMessage('Please enter a reason why the appeal is missing or wrong')
		.bail()
		.toArray()
		.isIn([
			'namesDoNotMatch',
			'sensitiveInfo',
			'missingOrWrongDocs',
			'inflammatoryComments',
			'openedInError',
			'wrongAppealTypeUsed',
			'otherReason'
		])
		.withMessage('Please enter a reason why the appeal is missing or wrong'),
	body('missingOrWrongDocsReasons')
		.if(body('incompleteReasons').isIn(['missingOrWrongDocs']))
		.notEmpty()
		.withMessage('Please select which documents are missing or wrong')
		.bail()
		.toArray()
		.isIn(['applicationForm', 'decisionNotice', 'groundsForAppeal', 'supportingDocuments'])
		.withMessage('Please select which documents are missing or wrong'),
	body('otherReasons')
		.if(
			body('incompleteReasons')
				.toArray()
				.custom((value) => value.includes('otherReason'))
		)
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide a reason for the incomplete outcome')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded')
];

/**
 * Validate the outcome incomplete form to ensure it has at least 1 answer.
 *
 * @returns {void}
 */
export const validateOutcomeInvalidReasonPipe = [
	body('invalidReasons')
		.notEmpty()
		.withMessage('Please select a reason why the appeal is invalid')
		.bail()
		.isIn(['outOfTime', 'noRightOfAppeal', 'notAppealable', 'lPADeemedInvalid', 'otherReason'])
		.withMessage('Please enter a reason why the appeal is invalid'),
	body('otherReasons')
		.if(
			body('invalidReasons')
				.toArray()
				.custom((value) => value.includes('otherReason'))
		)
		.escape()
		.trim()
		.notEmpty()
		.withMessage('Please provide a reason for the invalid outcome')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded')
];

/**
 * Validate the check and confirm step.
 *
 * @returns {void}
 */
export const validateCheckAndConfirmPipe = body('check-and-confirm-completed')
	.custom((value, { req }) => {
		const { appealWork = {} } = req.session;

		if (appealWork.reviewOutcome === 'incomplete' && value !== 'true') {
			throw new Error('Confirm if you have completed all follow-up tasks and emails');
		}

		return true;
	});

export const validateAppellantName = checkSchema({
	AppellantName: {
		escape: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Enter an appellant name',
			bail: true
		},
		isLength: {
			errorMessage: 'An appellant name must be 500 characters or fewer',
			options: {
				max: 500
			}
		}
	}
});

export const validateAppealSite = checkSchema({
	AddressLine1: {
		escape: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Enter the first line of the address',
			bail: true
		},
		isLength: {
			errorMessage: 'First line of address must be 500 characters or fewer',
			options: {
				max: 500
			}
		}
	},
	AddressLine2: {
		escape: true,
		trim: true,
		isLength: {
			errorMessage: 'Second line of address must be 500 characters or fewer',
			options: { max: 500 }
		}
	},
	Town: {
		escape: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Enter a town or city',
			bail: true
		},
		isLength: {
			errorMessage: 'Town or city must be 500 characters or fewer',
			options: { max: 500 }
		}
	},
	County: {
		escape: true,
		trim: true,
		isLength: {
			errorMessage: 'County must be 500 characters or fewer',
			options: { max: 500 }
		}
	},
	PostCode: {
		escape: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Enter a postcode',
			bail: true
		},
		custom: {
			options: validatePostcode,
			errorMessage: 'Enter a real postcode'
		}
	}
});

export const validateLocalPlanningDepartment = checkSchema({
	LocalPlanningDepartment: {
		escape: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Select a local planning department'
		},
	}
});

export const validatePlanningApplicationReference = checkSchema({
	PlanningApplicationReference: {
		escape: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Enter a planning application reference'
		},
	}
});

export const handleUploadedDocuments = [
	checkSchema({
		files: {
			notEmpty: {
				errorMessage: 'Select a file'
			}
		}
	}),
	multer({
		storage: memoryStorage,
		limits: {
			fileSize: 1 * Math.pow(1024, 2 /* MBs*/)
		}
	}).array('files'),
	mapMulterErrorToValidationError
];
