import { convertFromBooleanToYesNo } from '../../../lib/boolean-formatter.js';

/**
 * @typedef {import("../../../lib/nunjucks-template-builders/summary-list-builder").BuilderParameters} SummaryListBuilderParameters
 */

/**
 *
 * @param {import('../appeal-details.types.js').SingleLPAQuestionnaireResponse} lpaQuestionnaireData
 * @returns {SummaryListBuilderParameters[]}
 */
export function mapLpaQuestionnaire(lpaQuestionnaireData) {
	const completeList = [];
	const mappedData = initialiseAndMapData(lpaQuestionnaireData);
	completeList.push(householderConstraintsLpaQuestionnaire(mappedData));
	completeList.push(householderEnvironmentalLpaQuestionnaire(mappedData));
	completeList.filter((item) => item !== undefined);
	return completeList;
}

/**
 * @typedef {import("../../../lib/nunjucks-template-builders/summary-list-builder").RowArray} SummaryListBuilderRowArray
 */

/**
 * @typedef {Object<[key: string], SummaryListBuilderRowArray>} MappedLPAQuestionnaireData
 */

/**
 *
 * @param {import('../appeal-details.types.js').SingleLPAQuestionnaireResponse} lpaQuestionnaireData
 * @returns {MappedLPAQuestionnaireData}
 */
function initialiseAndMapData(lpaQuestionnaireData) {
	const mappedData = {};

	mappedData.isListedBuilding = {
		title: 'Listed building',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.isListedBuilding),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};
	if (lpaQuestionnaireData.isListedBuilding) {
		mappedData.listedBuildingDetails = {
			title: 'Listed building details',
			value: lpaQuestionnaireData.listedBuildingDetails?.map(
				(/** @type {{ grade: string; description: string; }} */ item) =>
					`${item.grade}: ${item.description}`
			),
			valueType: 'link',
			actionText: 'Change',
			actionLink: '#'
		};
	}

	mappedData.doesAffectAListedBuilding = {
		title: 'Affects a listed building',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.doesAffectAListedBuilding),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.affectsListedBuildingDetails = {
		title: 'Affects a listed building details',
		value: lpaQuestionnaireData.affectsListedBuildingDetails?.map(
			(/** @type {{ grade: string; description: string; }} */ item) =>
				`${item.grade}: ${item.description}`
		),
		valueType: 'link',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.doesAffectAScheduledMonument = {
		title: 'Affects a scheduled monument',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.doesAffectAScheduledMonument),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.inCAOrrelatesToCA = {
		title: 'Conservation area',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.inCAOrrelatesToCA),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.conservationAreaMapAndGuidance = {
		title: 'Conservation area map and guidance',
		value: lpaQuestionnaireData.documents?.conservationAreaMapAndGuidance,
		valueType: 'link',
		actionText: 'Details',
		actionLink: '#'
	};

	mappedData.hasProtectedSpecies = {
		title: 'Protected species',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.hasProtectedSpecies),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.isTheSiteWithinAnAONB = {
		title: 'Area of outstanding natural beauty',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.isTheSiteWithinAnAONB),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.designatedSites = {
		title: 'Designated sites',
		value: lpaQuestionnaireData.designatedSites?.map(
			(item) => `${item.description} (${item.name})`
		),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.hasTreePreservationOrder = {
		title: 'Tree Preservation Order',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.hasTreePreservationOrder),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.treePreservationOrder = {
		title: 'Tree Presevation Order extent',
		value: lpaQuestionnaireData.documents?.treePreservationOrder,
		valueType: 'link',
		actionText: 'Details',
		actionLink: '#'
	};

	mappedData.isGypsyOrTravellerSite = {
		title: 'Gypsy of traveller',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.isGypsyOrTravellerSite),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.isPublicRightOfWay = {
		title: 'Public right of way',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.isPublicRightOfWay),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.definitiveMapAndStatement = {
		title: 'Definitive map and statement extract',
		value: lpaQuestionnaireData.documents?.definitiveMapAndStatement,
		valueType: 'link',
		actionText: 'Details',
		actionLink: '#'
	};

	mappedData.scheduleType = {
		title: 'Schedule Type',
		value: lpaQuestionnaireData.scheduleType,
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.environmentStatementNeeded = {
		title: 'Environment Statement Needed',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.isEnvironmentalStatementRequired),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};
	// TODO: this variable is missing from current data
	// mappedData.applicantDidEnvironmentStatement = {
	// 	title: 'Applicant completed Environment Statement',
	// 	value: convertFromBooleanToYesNo(lpaQuestionnaireData.isEnvironmentalStatementRequired),
	// 	valueType: 'text',
	// 	actionText: 'Change',
	// 	actionLink: '#'
	// };

	mappedData.hasCompletedAnEnvironmentalStatement = {
		title: 'Environment Statement Complete',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.hasCompletedAnEnvironmentalStatement),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};
	// TODO: this variable is missing from current data
	// mappedData.environmentStatementDocument = {
	// 	title: 'Environment Statement Document',
	// 	value: lpaQuestionnaireData.documents?.environmentalStatement,
	// 	valueType: 'link',
	// 	actionText: 'Details',
	// 	actionLink: '#'
	// }

	mappedData.environmentStatementResponsesDocument = {
		title: 'Environment Statement Responses',
		value: lpaQuestionnaireData.documents?.environmentalStatementResponses,
		valueType: 'link',
		actionText: 'Details',
		actionLink: '#'
	};

	mappedData.issuedScreeningOpinion = {
		title: 'Screening Opinion Issued',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.includesScreeningOption),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.screeningOpinionDocument = {
		//TODO: determine title for this one
		title: 'Screening Opinion Document',
		value: lpaQuestionnaireData.documents?.issuedScreeningOption,
		valueType: 'link',
		actionText: 'Details',
		actionLink: '#'
	};

	mappedData.screeningDirectionDocument = {
		title: 'Screening Direction Document',
		value: lpaQuestionnaireData.documents?.screeningDirection,
		valueType: 'link',
		actionText: 'Details',
		actionLink: '#'
	};

	mappedData.siteNotice = {
		title: 'Site Notice',
		value: lpaQuestionnaireData.documents?.siteNotice,
		valueType: 'link',
		actionText: 'Details',
		actionLink: '#'
	};

	mappedData.affectsSensitiveArea = {
		title: 'Affects sensitive area',
		value: convertFromBooleanToYesNo(lpaQuestionnaireData.isSensitiveArea),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.sensitiveAreaDetails = {
		title: 'Sensitive area details',
		value: lpaQuestionnaireData.sensitiveAreaDetails,
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	mappedData.meetsOrExceedsThresholdOrCriteriaInColumn2 = {
		title: 'Meets or exceeds threshold or criteria in column 2',
		value: convertFromBooleanToYesNo(
			lpaQuestionnaireData.meetsOrExceedsThresholdOrCriteriaInColumn2
		),
		valueType: 'text',
		actionText: 'Change',
		actionLink: '#'
	};

	return mappedData;
}

/**
 *
 * @param {MappedLPAQuestionnaireData} mappedData
 * @returns {SummaryListBuilderParameters}
 */
function householderConstraintsLpaQuestionnaire(mappedData) {
	const header = '1. Constraints, designations and other issues';

	const sectionData = [
		mappedData.isListedBuilding,
		mappedData.listedBuildingDetails,
		mappedData.doesAffectAListedBuilding,
		mappedData.affectsListedBuildingDetails,
		mappedData.doesAffectAScheduledMonument,
		mappedData.inCAOrrelatesToCA,
		mappedData.conservationAreaMapAndGuidance,
		mappedData.hasProtectedSpecies,
		mappedData.isTheSiteWithinAnAONB,
		mappedData.designatedSites,
		mappedData.hasTreePreservationOrder,
		mappedData.treePreservationOrder,
		mappedData.isGypsyOrTravellerSite,
		mappedData.isPublicRightOfWay,
		mappedData.definitiveMapAndStatement
	];
	return { header: header, rows: sectionData };
}

/**
 *
 * @param {MappedLPAQuestionnaireData} mappedData
 * @returns {SummaryListBuilderParameters}
 */
function householderEnvironmentalLpaQuestionnaire(mappedData) {
	const header = '2. Environmental impact assessment';

	const sectionData = [
		mappedData.scheduleType,
		mappedData.environmentStatementNeeded,
		mappedData.hasCompletedAnEnvironmentalStatement,
		mappedData.environmentStatementResponsesDocument,
		mappedData.issuedScreeningOpinion,
		mappedData.screeningOpinionDocument,
		mappedData.screeningDirectionDocument,
		mappedData.siteNotice,
		mappedData.affectsSensitiveArea,
		mappedData.sensitiveAreaDetails,
		mappedData.meetsOrExceedsThresholdOrCriteriaInColumn2
	];

	return {
		header: header,
		rows: sectionData
	};
}
