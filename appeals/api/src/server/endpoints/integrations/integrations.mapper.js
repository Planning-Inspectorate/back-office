// @ts-nocheck
// TODO: data and document types schema (PINS data model)
import { APPEAL_TYPE_SHORTHAND_HAS } from '#endpoints/constants.js';
import { randomUUID } from 'node:crypto';

export const mapAppealFromTopic = (data) => {
	const { appeal, documents } = data;
	const { appellant, agent } = appeal;

	const typeShorthand = mapAppealTypeShorthand(appeal.appealType);
	const appellantInput = mapAppellant(appellant, agent);
	const appellantCaseInput = mapAppellantCase(appeal);
	const addressInput = mapAddress(appeal);

	const appealInput = {
		reference: randomUUID(),
		appealType: { connect: { shorthand: typeShorthand } },
		appellant: { create: appellantInput },
		localPlanningDepartment: mapLpa(appeal),

		planningApplicationReference: appeal.LPAApplicationReference,
		address: { create: addressInput },
		appellantCase: { create: appellantCaseInput }
	};

	const documentsInput = documents.map((document) => mapDocumentFromTopic(document));

	return {
		appeal: appealInput,
		documents: documentsInput
	};
};

export const mapDocumentFromTopic = (doc) => {
	const { filename, ...metadata } = doc;
	return {
		...metadata,
		documentGuid: doc.documentGuid ? doc.documentGuid : randomUUID(),
		fileName: filename || doc.fileName,
		dateCreated: (doc.dateCreated ? new Date(doc.dateCreated) : new Date()).toISOString(),
		lastModified: (doc.lastModified ? new Date(doc.lastModified) : new Date()).toISOString()
	};
};

export const mapAppealForTopic = (appeal) => {
	const lpa = {
		LPACode: appeal.localPlanningDepartment.replace(/\[(.*)\] (.*)/gm, '$1'),
		LPAName: appeal.localPlanningDepartment.replace(/\[(.*)\] (.*)/gm, '$2')
	};

	const address = {
		siteAddressLine1: appeal.addressLine1,
		siteAddressLine2: appeal.addressLine2,
		siteAddressCounty: appeal.county,
		siteAddressPostcode: appeal.postcode
	};

	const topic = {
		...lpa,
		...address,
		appealType: shortHandsMap[appeal.appealType],
		reference: appeal.reference,
		...appeal
	};

	return topic;
};

export const mapDocumentForTopic = (doc) => {
	//TODO: mapping, may not be needed
	return doc;
};

//TODO: add more types
const shortHandsMap = {
	APPEAL_TYPE_SHORTHAND_HAS: 'Householder (HAS) Appeal'
};

const mapAppealTypeShorthand = (appealType) => {
	switch (appealType) {
		case shortHandsMap.APPEAL_TYPE_SHORTHAND_HAS:
		default:
			return APPEAL_TYPE_SHORTHAND_HAS;
	}
};

const mapAppellant = (appellant, agent) => {
	let user = {
		name: `${appellant.firstName} ${appellant.lastName}`,
		email: appellant.emailAddress
	};

	if (agent) {
		user.agentName = `${agent.firstName} ${agent.lastName}`;
	}

	return user;
};

const mapAppellantCase = (appeal) => {
	return {
		applicantFirstName: appeal.appellant.firstName,
		applicantSurname: appeal.appellant.lastName,
		areAllOwnersKnown: appeal.areAllOwnersKnown || false,
		hasAttemptedToIdentifyOwners: appeal.hasAttemptedToIdentifyOwners || false,
		hasDesignAndAccessStatement: appeal.hasDesignAndAccessStatement || false,
		hasHealthAndSafetyIssues: appeal.doesSiteHaveHealthAndSafetyIssues || false,
		hasNewSupportingDocuments: appeal.hasNewSupportingDocuments || false,
		hasOtherTenants: appeal.hasOtherTenants || false,
		hasPlanningObligation: appeal.hasPlanningObligation || false,
		hasSeparateOwnershipCertificate: appeal.hasSeparateOwnershipCertificate || false,
		hasToldOwners: appeal.hasToldOwners || false,
		hasToldTenants: appeal.hasToldTenants || false,
		healthAndSafetyIssues: appeal.healthAndSafetyIssuesDetails,
		isAgriculturalHolding: appeal.isAgriculturalHolding || false,
		isAgriculturalHoldingTenant: appeal.isAgriculturalHoldingTenant || false,
		isAppellantNamedOnApplication: appeal.isAppellantNamedOnApplication || false,
		isDevelopmentDescriptionStillCorrect: appeal.isDevelopmentDescriptionStillCorrect || false,
		isSiteFullyOwned: appeal.isSiteFullyOwned || false,
		isSitePartiallyOwned: appeal.isSitePartiallyOwned || false,
		isSiteVisibleFromPublicRoad: appeal.isSiteVisible || false,
		newDevelopmentDescription: appeal.newDevelopmentDescription || '',
		visibilityRestrictions: appeal.visibilityRestrictions || ''
	};
};

const mapAddress = (appeal) => {
	return {
		addressLine1: appeal.siteAddressLine1,
		addressLine2: appeal.siteAddressLine2,
		county: appeal.siteAddressCounty,
		postcode: appeal.siteAddressPostcode
	};
};

const mapLpa = (appeal) => `[${appeal.LPACode}] ${appeal.LPAName}`;
