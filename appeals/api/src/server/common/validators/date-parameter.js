import { isEqual, parseISO } from 'date-fns';
import joinDateAndTime from '#utils/join-date-and-time.js';
import {
	ERROR_MUST_BE_BUSINESS_DAY,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_IN_FUTURE
} from '#endpoints/constants.js';
import { body } from 'express-validator';
import { dateIsAfterDate } from '#utils/date-comparison.js';
import { recalculateDateIfNotBusinessDay } from '#utils/business-days.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {{
 * 	parameterName: string,
 *  mustBeFutureDate?: boolean,
 *  mustBeBusinessDay?: boolean,
 *  isRequired?: boolean,
 *  customFn?: (value: any, other: {req: any}) => Error | boolean
 * }} param0
 * @returns {ValidationChain}
 */
const validateDateParameter = ({
	parameterName,
	mustBeFutureDate = false,
	mustBeBusinessDay = false,
	isRequired = false,
	customFn = () => true
}) => {
	const validator = body(parameterName);

	!isRequired && validator.optional();

	return validator
		.isDate()
		.withMessage(ERROR_MUST_BE_CORRECT_DATE_FORMAT)
		.custom((value) => (mustBeFutureDate ? dateIsAfterDate(new Date(value), new Date()) : true))
		.withMessage(ERROR_MUST_BE_IN_FUTURE)
		.custom(async (value) => {
			if (mustBeBusinessDay) {
				const originalDate = joinDateAndTime(value);
				const recalculatedDate = await recalculateDateIfNotBusinessDay(originalDate);

				if (!isEqual(parseISO(originalDate), recalculatedDate)) {
					throw new Error(ERROR_MUST_BE_BUSINESS_DAY);
				}
			}

			return true;
		})
		.custom(customFn)
		.customSanitizer(joinDateAndTime);
};

export default validateDateParameter;
