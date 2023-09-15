import { ERROR_NOT_FOUND } from '#endpoints/constants.js';
import commonRepository from '#repositories/common.repository.js';

/** @typedef {import('express').NextFunction} NextFunction */
/** @typedef {import('express').Response} Response */
/** @typedef {import('@pins/appeals.api').Appeals.IncompleteInvalidReasons} IncompleteInvalidReasons */

/**
 * @param {string} fieldName
 * @param {string} databaseTable
 * @returns {(req: {
 * 	 body: {
 * 		 [key: string]: string | string[] | IncompleteInvalidReasons,
 *     validationOutcome: string
 *   }
 * }, res: Response, next: NextFunction) => Promise<object | void>}
 */
const checkLookupValuesAreValid = (fieldName, databaseTable) => async (req, res, next) => {
	let {
		body: { [fieldName]: valuesToCheck }
	} = req;

	if (valuesToCheck) {
		valuesToCheck = typeof valuesToCheck !== 'object' ? [valuesToCheck] : valuesToCheck;

		if (typeof valuesToCheck[0] === 'object') {
			valuesToCheck = valuesToCheck.map(({ id }) => id);
		}

		const lookupValues = await commonRepository.getLookupList(databaseTable);
		const lookupValueIds = lookupValues.map(({ id }) => id);
		const hasValidValues = valuesToCheck.every((valueToCheck) =>
			lookupValueIds.includes(Number(valueToCheck))
		);

		if (!hasValidValues) {
			return res.status(404).send({ errors: { [fieldName]: ERROR_NOT_FOUND } });
		}
	}

	next();
};

export default checkLookupValuesAreValid;
