import commonRepository from '#repositories/common.repository.js';

/** @typedef {import('express').NextFunction} NextFunction */
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {'validationOutcome' | 'visitType'} fieldName
 * @param {string} databaseTable
 * @param {string} errorMessage
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<object | void>}
 */
const checkLookupValueIsValidAndAddToRequest =
	(fieldName, databaseTable, errorMessage) => async (req, res, next) => {
		const { [fieldName]: lookupField } = req.body;

		if (lookupField) {
			const validationOutcomeMatch = await commonRepository.getLookupListValueByName(
				databaseTable,
				lookupField
			);

			if (!validationOutcomeMatch) {
				return res.status(400).send({
					errors: {
						[fieldName]: errorMessage
					}
				});
			}

			req[fieldName] = validationOutcomeMatch;
		}

		next();
	};

export default checkLookupValueIsValidAndAddToRequest;
