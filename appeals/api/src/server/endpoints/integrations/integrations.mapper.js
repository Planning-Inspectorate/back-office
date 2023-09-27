// @ts-nocheck
// TODO: data and document types schema (PINS data model)
import { APPEAL_TYPE_SHORTHAND_HAS } from '#endpoints/constants.js';
import { randomUUID } from 'node:crypto';
import mappers from './integrations.mappers/index.js';

export const mapAppealSubmission = (data) => {
	const { appeal, documents } = data;
	const { appellant, agent } = appeal;

	const typeShorthand = mapAppealTypeIn(appeal.appealType);

	const appellantInput = mappers.mapServiceUserIn(appellant, agent);
	const appellantCaseInput = mappers.mapAppellantCaseIn(appeal);
	const addressInput = mappers.mapAddressIn(appeal);
	const lpaInput = mappers.mapLpaIn(appeal);

	const appealInput = {
		reference: randomUUID(),
		appealType: { connect: { shorthand: typeShorthand } },
		appellant: { create: appellantInput },
		localPlanningDepartment: lpaInput,

		planningApplicationReference: appeal.LPAApplicationReference,
		address: { create: addressInput },
		appellantCase: { create: appellantCaseInput }
	};

	const documentsInput = (documents || []).map((document) => mappers.mapDocumentIn(document));

	return {
		appeal: appealInput,
		documents: documentsInput
	};
};

export const mapQuestionnaireSubmission = (data) => {
	const { questionnaire, documents } = data;
	const questionnaireInput = mappers.mapQuestionnaireIn(questionnaire);
	const documentsInput = (documents || []).map((document) => mappers.mapDocumentIn(document));

	return {
		questionnaire: questionnaireInput,
		documents: documentsInput,
		caseReference: questionnaire.caseReference
	};
};

export const mapDocumentSubmission = (data) => {
	return mappers.mapDocumentIn(data);
};

export const mapAppeal = (appeal) => {
	const lpa = mappers.mapLpaOut(appeal);

	const address = mappers.mapAddressOut(appeal);

	const allocation = appeal.allocation
		? {
				level: appeal.allocation.level,
				band: appeal.allocation.band,
				specialism: appeal.specialisms?.map((s) => s.specialism?.name) || []
		  }
		: null;

	//TODO:
	const topic = {
		appealType: mapAppealTypeOut(appeal.appealType.shorthand),
		caseReference: appeal.reference,
		...lpa,
		LPAApplicationReference: appeal.planningApplicationReference,
		...address,
		...allocation,
		...mappers.mapAppellantCaseOut(appeal.appellantCase),
		...mappers.mapQuestionnaireOut(appeal.lpaQuestionnaire)
	};

	return topic;
};

export const mapDocument = (doc) => {
	return mappers.mapDocumentOut(doc);
};

//TODO: add more types
const appealTypeMap = {
	APPEAL_TYPE_SHORTHAND_HAS: 'Householder (HAS) Appeal'
};

const mapAppealTypeIn = (appealType) => {
	switch (appealType) {
		case appealTypeMap.APPEAL_TYPE_SHORTHAND_HAS:
		default:
			return APPEAL_TYPE_SHORTHAND_HAS;
	}
};

const mapAppealTypeOut = (appealType) => {
	switch (appealType) {
		case APPEAL_TYPE_SHORTHAND_HAS:
		default:
			return appealTypeMap.APPEAL_TYPE_SHORTHAND_HAS;
	}
};
