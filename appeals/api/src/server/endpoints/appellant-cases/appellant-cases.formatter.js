import formatAddress from '#utils/format-address.js';
import formatValidationOutcomeResponse from '#utils/format-validation-outcome-response.js';
import isFPA from '#utils/is-fpa.js';
import { mapFoldersLayoutForAppealSection } from '../documents/documents.mapper.js';
import { CONFIG_APPEAL_STAGES } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAppellantCaseResponse} SingleAppellantCaseResponse */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @param {Folder[] | null} folders
 * @returns {SingleAppellantCaseResponse | void}
 */
const formatAppellantCase = (appeal, folders = null) => {
	const { appellantCase } = appeal;

	if (appellantCase) {
		return {
			...(isFPA(appeal.appealType) && {
				agriculturalHolding: {
					isAgriculturalHolding: appellantCase.isAgriculturalHolding,
					isTenant: appellantCase.isAgriculturalHoldingTenant,
					hasToldTenants: appellantCase.hasToldTenants,
					hasOtherTenants: appellantCase.hasOtherTenants
				}
			}),
			appealId: appeal.id,
			appealReference: appeal.reference,
			appealSite: {
				addressId: appeal.address?.id,
				...formatAddress(appeal.address)
			},
			appellantCaseId: appellantCase.id,
			appellant: {
				appellantId: appeal.appellant?.id || null,
				company: appeal.appellant?.customer?.organisationName || null,
				name: appeal.appellant?.name || null
			},
			applicant: {
				firstName: appellantCase.applicantFirstName,
				surname: appellantCase.applicantSurname
			},
			planningApplicationReference: appeal.planningApplicationReference,
			...(isFPA(appeal.appealType) && {
				developmentDescription: {
					isCorrect: appellantCase.isDevelopmentDescriptionStillCorrect,
					details: appellantCase.newDevelopmentDescription
				}
			}),
			...formatFoldersAndDocuments(appeal, folders),
			hasAdvertisedAppeal: appellantCase.hasAdvertisedAppeal,
			...(isFPA(appeal.appealType) && {
				hasDesignAndAccessStatement: appellantCase.hasDesignAndAccessStatement,
				hasNewPlansOrDrawings: appellantCase.hasNewPlansOrDrawings
			}),
			hasNewSupportingDocuments: appellantCase.hasNewSupportingDocuments,
			...(isFPA(appeal.appealType) && {
				hasSeparateOwnershipCertificate: appellantCase.hasSeparateOwnershipCertificate
			}),
			healthAndSafety: {
				details: appellantCase.healthAndSafetyIssues,
				hasIssues: appellantCase.hasHealthAndSafetyIssues
			},
			isAppellantNamedOnApplication: appellantCase.isAppellantNamedOnApplication,
			localPlanningDepartment: appeal.lpa.lpaName,
			...(isFPA(appeal.appealType) && {
				planningObligation: {
					hasObligation: appellantCase.hasPlanningObligation,
					status: appellantCase.planningObligationStatus?.name || null
				}
			}),
			procedureType: appeal.lpaQuestionnaire?.procedureType?.name,
			siteOwnership: {
				areAllOwnersKnown: appellantCase.areAllOwnersKnown,
				hasAttemptedToIdentifyOwners: appellantCase.hasAttemptedToIdentifyOwners,
				hasToldOwners: appellantCase.hasToldOwners,
				isFullyOwned: appellantCase.isSiteFullyOwned,
				isPartiallyOwned: appellantCase.isSitePartiallyOwned,
				knowsOtherLandowners: appellantCase.knowledgeOfOtherLandowners?.name || null
			},
			validation: formatValidationOutcomeResponse(
				appellantCase.appellantCaseValidationOutcome?.name,
				appellantCase.appellantCaseIncompleteReasonsOnAppellantCases,
				appellantCase.appellantCaseInvalidReasonsOnAppellantCases
			),
			visibility: {
				details: appellantCase.visibilityRestrictions,
				isVisible: appellantCase.isSiteVisibleFromPublicRoad
			}
		};
	}
};

/**
 * @param {RepositoryGetByIdResultItem} appeal
 * @param {Folder[] | null} folders
 */
const formatFoldersAndDocuments = (appeal, folders) => {
	const folderLayout = {
		appealStatement: {},
		applicationForm: {},
		decisionLetter: {},
		...(isFPA(appeal.appealType) && {
			designAndAccessStatement: {},
			newPlansOrDrawings: {}
		}),
		newSupportingDocuments: {},
		...(isFPA(appeal.appealType) && {
			planningObligation: {},
			plansDrawingsSupportingDocuments: {},
			separateOwnershipCertificate: {}
		})
	};

	if (folders) {
		mapFoldersLayoutForAppealSection(CONFIG_APPEAL_STAGES.appellantCase, folderLayout, folders);
	}

	return { documents: folderLayout };
};

export { formatAppellantCase };
