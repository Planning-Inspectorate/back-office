import {
	ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS,
	ERROR_NOT_FOUND,
	ERROR_OTHER_NOT_VALID_REASONS_REQUIRED
} from '#endpoints/constants.js';
import appealRepository from '#repositories/appeal.repository.js';

/** @typedef {import('express').NextFunction} NextFunction */
/** @typedef {import('express').Response} Response */

/**
 * @param {string} fieldName
 * @param {string} databaseTable
 * @returns {(req: {
 * 	 body: {
 * 		 [key: string]: string | string[],
 *     otherNotValidReasons: string
 *     validationOutcome: string
 *   }
 * }, res: Response, next: NextFunction) => Promise<object | void>}
 */
const checkLookupValuesAreValid = (fieldName, databaseTable) => async (req, res, next) => {
	const {
		body: { otherNotValidReasons }
	} = req;
	let {
		body: { [fieldName]: valuesToCheck }
	} = req;

	if (valuesToCheck) {
		valuesToCheck = typeof valuesToCheck !== 'object' ? [valuesToCheck] : valuesToCheck;

		const lookupValues = await appealRepository.getLookupList(databaseTable);
		const lookupValueOtherId = lookupValues.find(({ name }) => name === 'Other')?.id;

		if (
			lookupValueOtherId &&
			valuesToCheck.some((valueToCheck) => Number(valueToCheck) === lookupValueOtherId) &&
			!otherNotValidReasons
		) {
			return res
				.status(400)
				.send({ errors: { otherNotValidReasons: ERROR_OTHER_NOT_VALID_REASONS_REQUIRED } });
		}

		const lookupValueIds = lookupValues.map(({ id }) => id);
		const hasValidValues = valuesToCheck.every((valueToCheck) =>
			lookupValueIds.includes(Number(valueToCheck))
		);

		if (!hasValidValues) {
			return res.status(404).send({ errors: { [fieldName]: ERROR_NOT_FOUND } });
		}

		if (
			lookupValueOtherId &&
			valuesToCheck.every((valueToCheck) => Number(valueToCheck) !== lookupValueOtherId) &&
			otherNotValidReasons
		) {
			return res.status(400).send({
				errors: { otherNotValidReasons: ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS }
			});
		}
	}

	next();
};

export default checkLookupValuesAreValid;
