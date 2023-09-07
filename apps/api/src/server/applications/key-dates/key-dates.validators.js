import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import {
	acceptanceDateNames,
	decisionDateNames,
	examinationDateNames,
	postDecisionDateNames,
	preApplicationDateNames,
	preExaminationDateNames,
	recommendationDateNames,
	withdrawalDateNames
} from './key-dates.utils.js';
import { mapUnixTimestampToDate } from '#utils/mapping/map-unix-timestamp-to-date.js';

/**
 *
 * @param {string} keyPath The object path like 'preApplication', 'acceptance', etc.
 * @param {Array<string>} dateNames Array of date names
 * @returns {Array<import('express-validator').ValidationChain>}
 */
const validationMiddleware = (keyPath, dateNames) => {
	return dateNames.map((dateName) => {
		return body(`${keyPath}.${dateName}`)
			.customSanitizer(mapUnixTimestampToDate)
			.optional({ nullable: true, checkFalsy: true });
	});
};

export const validateUpdateKeyDates = composeMiddleware(
	// 'submissionAtPublished' is a string not a date, so we don't do the typical validation
	...validationMiddleware(
		'preApplication',
		preApplicationDateNames.filter((key) => key != 'submissionAtPublished')
	),
	body('preApplication.submissionAtPublished').optional({ nullable: true }),
	...validationMiddleware('acceptance', acceptanceDateNames),
	...validationMiddleware('preExamination', preExaminationDateNames),
	...validationMiddleware('examination', examinationDateNames),
	...validationMiddleware('recommendation', recommendationDateNames),
	...validationMiddleware('decision', decisionDateNames),
	...validationMiddleware('postDecision', postDecisionDateNames),
	...validationMiddleware('withdrawal', withdrawalDateNames),
	validationErrorHandler
);
