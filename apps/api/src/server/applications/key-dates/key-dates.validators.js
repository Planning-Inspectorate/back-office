import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import {
	acceptanceDateKeys,
	decisionDateKeys,
	examinationDateKeys,
	postDecisionDateKeys,
	preApplicationDateKeys,
	preExaminationDateKeys,
	recommendationDateKeys,
	withdrawalDateKeys
} from './key-dates.utils.js';
import { mapUnixTimestampToDate } from '#utils/mapping/map-unix-timestamp-to-date.js';

/**
 *
 * @param {string} keyPath The object path like 'preApplication', 'acceptance', etc.
 * @param {Array<string>} dateKeys Array of date keys
 * @returns {Array<import('express-validator').ValidationChain>}
 */
const validationMiddleware = (keyPath, dateKeys) => {
	return dateKeys.map((dateKey) => {
		return body(`${keyPath}.${dateKey}`)
			.customSanitizer(mapUnixTimestampToDate)
			.optional({ nullable: true, checkFalsy: true });
	});
};

export const validateUpdateKeyDates = composeMiddleware(
	// 'submissionAtPublished' is a string not a date, so we don't do the typical validation
	...validationMiddleware(
		'preApplication',
		preApplicationDateKeys.filter((key) => key != 'submissionAtPublished')
	),
	body('preApplication.submissionAtPublished').optional({ nullable: true }),
	...validationMiddleware('acceptance', acceptanceDateKeys),
	...validationMiddleware('preExamination', preExaminationDateKeys),
	...validationMiddleware('examination', examinationDateKeys),
	...validationMiddleware('recommendation', recommendationDateKeys),
	...validationMiddleware('decision', decisionDateKeys),
	...validationMiddleware('postDecision', postDecisionDateKeys),
	...validationMiddleware('withdrawal', withdrawalDateKeys),
	validationErrorHandler
);
