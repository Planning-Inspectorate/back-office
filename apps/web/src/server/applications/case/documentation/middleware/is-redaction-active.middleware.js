import { featureFlagClient } from '../../../../../common/feature-flags.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const isRedactionActiveMiddleware = (req, res, next) => {
	const { case: currentCase } = res.locals;
	const caseReference = currentCase?.reference;

	if (!featureFlagClient.isFeatureActiveForCase('idas-340-redaction-service', caseReference)) {
		return res.status(404).render('app/404.njk');
	}
	next();
};
