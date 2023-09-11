import config from '#config/config.js';
import { ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';
import { formatLpaQuestionnaire } from './lpa-questionnaires.formatter.js';
import { updateLPAQuestionaireValidationOutcome } from './lpa-questionnaires.service.js';
import lpaQuestionnaireRepository from '#repositories/lpa-questionnaire.repository.js';
import { getFoldersForAppeal } from '#endpoints/documents/documents.service.js';
import logger from '#utils/logger.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('express').Response} Response */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const getLpaQuestionnaireById = async (req, res) => {
	const { appeal } = req;
	const folders = await getFoldersForAppeal(appeal, config.appealStages.lpaQuestionnaire);
	const formattedAppeal = formatLpaQuestionnaire(appeal, folders);
	return res.send(formattedAppeal);
};

/**
 * @type {RequestHandler}
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

	try {
		validationOutcome
			? (body.lpaQuestionnaireDueDate = await updateLPAQuestionaireValidationOutcome({
					appeal,
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
