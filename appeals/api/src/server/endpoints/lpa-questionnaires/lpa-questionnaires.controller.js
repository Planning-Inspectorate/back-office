import { ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';
import { formatLpaQuestionnaire } from './lpa-questionnaires.formatter.js';
import { updateLPAQuestionaireValidationOutcome } from './lpa-questionnaires.service.js';
import lpaQuestionnaireRepository from '#repositories/lpa-questionnaire.repository.js';
import logger from '#utils/logger.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
const getLpaQuestionnaireById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = formatLpaQuestionnaire(appeal);
	return res.send(formattedAppeal);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const updateLPAQuestionnaireById = async (req, res) => {
	const {
		appeal,
		body,
		body: {
			designatedSites,
			doesAffectAListedBuilding,
			doesAffectAScheduledMonument,
			hasCompletedAnEnvironmentalStatement,
			hasProtectedSpecies,
			hasTreePreservationOrder,
			includesScreeningOption,
			isConservationArea,
			isEnvironmentalStatementRequired,
			isGypsyOrTravellerSite,
			isListedBuilding,
			isPublicRightOfWay,
			isSensitiveArea,
			isTheSiteWithinAnAONB,
			meetsOrExceedsThresholdOrCriteriaInColumn2,
			scheduleType,
			sensitiveAreaDetails
		},
		params,
		validationOutcome
	} = req;
	const lpaQuestionnaireId = Number(params.lpaQuestionnaireId);
	const azureAdUserId = String(req.get('azureAdUserId'));

	try {
		validationOutcome
			? (body.lpaQuestionnaireDueDate = await updateLPAQuestionaireValidationOutcome({
					appeal,
					azureAdUserId,
					data: body,
					lpaQuestionnaireId,
					validationOutcome
			  }))
			: await lpaQuestionnaireRepository.updateLPAQuestionnaireById(lpaQuestionnaireId, {
					designatedSites,
					doesAffectAListedBuilding,
					doesAffectAScheduledMonument,
					hasCompletedAnEnvironmentalStatement,
					hasProtectedSpecies,
					hasTreePreservationOrder,
					includesScreeningOption,
					isConservationArea,
					isEnvironmentalStatementRequired,
					isGypsyOrTravellerSite,
					isListedBuilding,
					isPublicRightOfWay,
					isSensitiveArea,
					isTheSiteWithinAnAONB,
					meetsOrExceedsThresholdOrCriteriaInColumn2,
					scheduleTypeId: scheduleType,
					sensitiveAreaDetails
			  });
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getLpaQuestionnaireById, updateLPAQuestionnaireById };
