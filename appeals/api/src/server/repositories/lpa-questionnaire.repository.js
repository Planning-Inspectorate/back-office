import { databaseConnector } from '#utils/database-connector.js';
import appealTimetablesRepository from '#repositories/appeal-timetable.repository.js';
import commonRepository from './common.repository.js';

/** @typedef {import('@pins/appeals.api').Appeals.NotValidReasons} NotValidReasons */
/** @typedef {import('@pins/appeals.api').Appeals.UpdateLPAQuestionnaireRequest} UpdateLPAQuestionnaireRequest */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {number} id
 * @param {UpdateLPAQuestionnaireRequest} data
 * @returns {Promise<object>}
 */
const updateLPAQuestionnaireById = (id, data) => {
	const { appealId, designatedSites, incompleteReasons, timetable } = data;
	const transaction = [];

	transaction.push(
		databaseConnector.lPAQuestionnaire.update({
			where: { id },
			data: {
				doesAffectAListedBuilding: data.doesAffectAListedBuilding,
				doesAffectAScheduledMonument: data.doesAffectAScheduledMonument,
				hasCompletedAnEnvironmentalStatement: data.hasCompletedAnEnvironmentalStatement,
				hasProtectedSpecies: data.hasProtectedSpecies,
				hasTreePreservationOrder: data.hasTreePreservationOrder,
				includesScreeningOption: data.includesScreeningOption,
				isConservationArea: data.isConservationArea,
				isEnvironmentalStatementRequired: data.isEnvironmentalStatementRequired,
				isGypsyOrTravellerSite: data.isGypsyOrTravellerSite,
				isListedBuilding: data.isListedBuilding,
				isPublicRightOfWay: data.isPublicRightOfWay,
				isSensitiveArea: data.isSensitiveArea,
				isTheSiteWithinAnAONB: data.isTheSiteWithinAnAONB,
				lpaQuestionnaireValidationOutcomeId: data.validationOutcomeId,
				meetsOrExceedsThresholdOrCriteriaInColumn2: data.meetsOrExceedsThresholdOrCriteriaInColumn2,
				otherNotValidReasons: data.otherNotValidReasons,
				scheduleTypeId: data.scheduleTypeId,
				sensitiveAreaDetails: data.sensitiveAreaDetails
			}
		})
	);

	if (designatedSites) {
		transaction.push(
			...commonRepository.updateManyToManyRelationTable({
				id,
				data: designatedSites,
				databaseTable: 'designatedSitesOnLPAQuestionnaires',
				relationOne: 'lpaQuestionnaireId',
				relationTwo: 'designatedSiteId'
			})
		);
	}

	if (incompleteReasons) {
		transaction.push(
			...commonRepository.updateManyToManyRelationTable({
				id,
				data: incompleteReasons,
				databaseTable: 'lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire',
				relationOne: 'lpaQuestionnaireId',
				relationTwo: 'lpaQuestionnaireIncompleteReasonId'
			})
		);
	}

	if (appealId && timetable) {
		transaction.push(appealTimetablesRepository.upsertAppealTimetableById(appealId, timetable));
	}

	return databaseConnector.$transaction(transaction);
};

export default { updateLPAQuestionnaireById };
