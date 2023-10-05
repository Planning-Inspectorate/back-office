// @ts-nocheck

import { randomUUID } from 'node:crypto';

import { mapAddressIn, mapAddressOut } from './address.mapper.js';
import { mapLpaIn, mapLpaOut } from './lpa.mapper.js';
import { mapDocumentIn, mapDocumentOut } from './document.mapper.js';
import { mapServiceUserIn, mapServiceUserOut } from './service-user.mapper.js';
import { mapAppellantCaseIn, mapAppellantCaseOut } from './appellant-case.mapper.js';
import { mapQuestionnaireIn, mapQuestionnaireOut } from './questionnaire.mapper.js';
import { mapAppealTypeIn, mapAppealTypeOut } from './appeal-type.mapper.js';
import { mapAppealAllocationOut } from './appeal-allocation.mapper.js';
import { mapCaseDataOut } from './casedata.mapper.js';

const mappers = {
	mapAddressIn,
	mapAddressOut,
	mapLpaIn,
	mapLpaOut,
	mapDocumentIn,
	mapDocumentOut,
	mapAppealTypeIn,
	mapAppealTypeOut,
	mapAppellantCaseIn,
	mapAppellantCaseOut,
	mapQuestionnaireIn,
	mapQuestionnaireOut,
	mapServiceUserIn,
	mapServiceUserOut,
	mapAppealAllocationOut,
	mapCaseDataOut
};

/** @typedef {import('#config/../openapi-types.js').AppellantCaseData} AppellantCaseData */
/** @typedef {import('#config/../openapi-types.js').QuestionnaireData} QuestionnaireData */
/** @typedef {import('#config/../openapi-types.js').DocumentMetaImport} DocumentMetaImport */

export const mapAppealSubmission = (/** @type {AppellantCaseData} */ data) => {
	const { appeal, documents } = data;
	const { appellant, agent } = appeal;

	const appealInput = {
		reference: randomUUID(),
		appealType: { connect: { shorthand: mappers.mapAppealTypeIn(appeal.appealType) } },
		appellant: mappers.mapServiceUserIn(appellant),
		agent: mappers.mapServiceUserIn(agent),
		lpa: {
			connectOrCreate: {
				where: { lpaCode: appeal.LPACode },
				create: mappers.mapLpaIn(appeal)
			}
		},
		planningApplicationReference: appeal.LPAApplicationReference,
		address: { create: mappers.mapAddressIn(appeal) },
		appellantCase: { create: mappers.mapAppellantCaseIn(appeal, appellant) }
	};

	const documentsInput = (documents || []).map((document) => mappers.mapDocumentIn(document));

	return {
		appeal: appealInput,
		documents: documentsInput
	};
};

export const mapQuestionnaireSubmission = (/** @type {QuestionnaireData} */ data) => {
	const { questionnaire, documents } = data;
	const questionnaireInput = mappers.mapQuestionnaireIn(questionnaire);
	const documentsInput = (documents || []).map((document) => mappers.mapDocumentIn(document));

	return {
		questionnaire: questionnaireInput,
		documents: documentsInput,
		caseReference: questionnaire.caseReference
	};
};

export const mapDocumentSubmission = (/** @type {DocumentMetaImport} */ data) => {
	return mappers.mapDocumentIn(data);
};

export const mapAppeal = (appeal) => {
	const topic = {
		appellant: mappers.mapServiceUserOut(appeal.appellant),
		agent: mappers.mapServiceUserOut(appeal.agent),
		appealType: mappers.mapAppealTypeOut(appeal.appealType.shorthand),
		caseReference: appeal.reference,
		...mappers.mapLpaOut(appeal),
		LPAApplicationReference: appeal.planningApplicationReference,
		...mappers.mapAddressOut(appeal),
		...mappers.mapAppealAllocationOut(appeal.allocation, appeal.specialisms),
		...mappers.mapAppellantCaseOut(appeal.appellantCase),
		...mappers.mapQuestionnaireOut(appeal.lpaQuestionnaire)
	};

	return topic;
};

// @ts-ignore
export const mapDocument = (doc) => {
	return mappers.mapDocumentOut(doc);
};
