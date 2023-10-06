import { getFoldersForAppeal } from '#endpoints/documents/documents.service.js';
import appellantCaseRepository from '#repositories/appellant-case.repository.js';
import logger from '#utils/logger.js';
import { CONFIG_APPEAL_STAGES } from '#endpoints/constants.js';
import { ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';
import { formatAppellantCase } from './appellant-cases.formatter.js';
import { updateAppellantCaseValidationOutcome } from './appellant-cases.service.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const getAppellantCaseById = async (req, res) => {
	const { appeal } = req;
	const folders = await getFoldersForAppeal(appeal, CONFIG_APPEAL_STAGES.appellantCase);
	const formattedAppeal = formatAppellantCase(appeal, folders);

	return res.send(formattedAppeal);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const updateAppellantCaseById = async (req, res) => {
	const {
		appeal,
		body,
		body: {
			applicantFirstName,
			applicantSurname,
			areAllOwnersKnown,
			hasAdvertisedAppeal,
			hasAttemptedToIdentifyOwners,
			hasHealthAndSafetyIssues,
			healthAndSafetyIssues,
			isSiteFullyOwned,
			isSitePartiallyOwned,
			isSiteVisibleFromPublicRoad,
			visibilityRestrictions
		},
		params,
		validationOutcome
	} = req;
	const appellantCaseId = Number(params.appellantCaseId);
	const azureAdUserId = String(req.get('azureAdUserId'));

	try {
		validationOutcome
			? await updateAppellantCaseValidationOutcome({
					appeal,
					appellantCaseId,
					azureAdUserId,
					data: body,
					notifyClient: req.notifyClient,
					validationOutcome
			  })
			: await appellantCaseRepository.updateAppellantCaseById(appellantCaseId, {
					applicantFirstName,
					applicantSurname,
					areAllOwnersKnown,
					hasAdvertisedAppeal,
					hasAttemptedToIdentifyOwners,
					hasHealthAndSafetyIssues,
					healthAndSafetyIssues,
					isSiteFullyOwned,
					isSitePartiallyOwned,
					isSiteVisibleFromPublicRoad,
					visibilityRestrictions
			  });
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getAppellantCaseById, updateAppellantCaseById };
