import formatAddress from '../../utils/address-block-formtter.js';
import { DOCUMENT_STATUS_NOT_RECEIVED, DOCUMENT_STATUS_RECEIVED } from '../constants.js';
import { isFPA, isOutcomeIncomplete } from './appeals.service.js';

/** @typedef {import('@pins/appeals.api').Appeals.AppealListResponse} AppealListResponse */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAppealDetailsResponse} SingleAppealDetailsResponse */
/** @typedef {import('@pins/appeals.api').Appeals.SingleLPAQuestionnaireResponse} SingleLPAQuestionnaireResponse */
/** @typedef {import('@pins/appeals.api').Appeals.ListedBuildingDetailsResponse} ListedBuildingDetailsResponse */
/** @typedef {import('@pins/appeals.api').Appeals.LinkedAppeal} LinkedAppeal */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAppellantCaseResponse} SingleAppellantCaseResponse */
/** @typedef {import('@pins/appeals.api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/appeals.api').Schema.ListedBuildingDetails} ListedBuildingDetails */
/** @typedef {import('@pins/appeals.api').Schema.AppealType} AppealType */

/**
 * @param {boolean} affectsListedBuilding
 * @param {ListedBuildingDetails[] | null | undefined} values
 * @returns {ListedBuildingDetailsResponse | null}
 */
const formatListedBuildingDetails = (affectsListedBuilding, values) =>
	(values &&
		values
			.filter((value) => value.affectsListedBuilding === affectsListedBuilding)
			.map(({ grade, description }) => ({ grade, description }))) ||
	null;

/**
 * @param {Appeal[]} linkedAppeals
 * @param {number} appealId
 * @returns {LinkedAppeal[]}
 */
const formatLinkedAppeals = (linkedAppeals, appealId) => {
	return linkedAppeals
		.filter((appeal) => appeal.id !== appealId)
		.map(({ id, reference }) => ({ appealId: id, appealReference: reference }));
};

const appealFormatter = {
	/**
	 * @param {RepositoryGetAllResultItem} appeal
	 * @returns {AppealListResponse}}
	 */
	formatAppeals: (appeal) => ({
		appealId: appeal.id,
		appealReference: appeal.reference,
		appealSite: formatAddress(appeal.address),
		appealStatus: appeal.appealStatus[0].status,
		appealType: appeal.appealType?.type,
		createdAt: appeal.createdAt,
		localPlanningDepartment: appeal.localPlanningDepartment
	}),
	/**
	 * @param {RepositoryGetByIdResultItem} appeal
	 * @returns {SingleAppealDetailsResponse | void}}
	 */
	formatAppeal(appeal) {
		if (appeal) {
			return {
				agentName: appeal.appellant?.agentName,
				allocationDetails: 'F / General Allocation',
				appealId: appeal.id,
				appealReference: appeal.reference,
				appealSite: formatAddress(appeal.address),
				appealStatus: appeal.appealStatus[0].status,
				appealTimetable: {
					lpaQuestionnaireDueDate: appeal.appealTimetable?.lpaQuestionnaireDueDate || null,
					...(isFPA(appeal.appealType) && {
						finalCommentReviewDate: appeal.appealTimetable?.finalCommentReviewDate || null,
						statementReviewDate: appeal.appealTimetable?.statementReviewDate || null
					})
				},
				appealType: appeal.appealType?.type,
				appellantCaseId: appeal.appellantCase?.id,
				appellantName: appeal.appellant?.name,
				decision: appeal.inspectorDecision?.outcome,
				isParentAppeal: appeal.linkedAppealId ? appeal.id === appeal.linkedAppealId : null,
				linkedAppeals: formatLinkedAppeals(appeal.linkedAppeals, appeal.id),
				localPlanningDepartment: appeal.localPlanningDepartment,
				lpaQuestionnaireId: appeal.lpaQuestionnaire?.id || null,
				otherAppeals: formatLinkedAppeals(appeal.otherAppeals, appeal.id),
				planningApplicationReference: appeal.planningApplicationReference,
				procedureType: appeal.lpaQuestionnaire?.procedureType?.name || null,
				siteVisit: {
					visitDate: appeal.siteVisit?.visitDate || null
				},
				startedAt: appeal.startedAt,
				documentationSummary: {
					appellantCase: {
						status: appeal.appellantCase ? DOCUMENT_STATUS_RECEIVED : DOCUMENT_STATUS_NOT_RECEIVED,
						dueDate: null
					},
					lpaQuestionnaire: {
						status: appeal.lpaQuestionnaire
							? DOCUMENT_STATUS_RECEIVED
							: DOCUMENT_STATUS_NOT_RECEIVED,
						dueDate: appeal.appealTimetable?.lpaQuestionnaireDueDate || null
					}
				}
			};
		}
	},
	/**
	 * @param {RepositoryGetByIdResultItem} appeal
	 * @returns {SingleLPAQuestionnaireResponse}}
	 */
	formatLpaQuestionnaire(appeal) {
		const { address, id, localPlanningDepartment, lpaQuestionnaire, reference } = appeal;

		return {
			affectsListedBuildingDetails: formatListedBuildingDetails(
				true,
				lpaQuestionnaire?.listedBuildingDetails
			),
			appealId: id,
			appealReference: reference,
			appealSite: formatAddress(address),
			communityInfrastructureLevyAdoptionDate:
				lpaQuestionnaire?.communityInfrastructureLevyAdoptionDate,
			designatedSites: lpaQuestionnaire?.designatedSites?.map(
				({ designatedSite: { name, description } }) => ({ name, description })
			),
			developmentDescription: lpaQuestionnaire?.developmentDescription,
			documents: {
				definitiveMapAndStatement: 'right-of-way.pdf',
				treePreservationOrder: 'tree-preservation-order.pdf',
				communityInfrastructureLevy: 'community-infrastructure-levy.pdf',
				conservationAreaMapAndGuidance: 'conservation-area-map-and-guidance.pdf',
				consultationResponses: 'consultation-responses.pdf',
				emergingPlans: ['emerging-plan-1.pdf'],
				environmentalStatementResponses: 'environment-statement-responses.pdf',
				issuedScreeningOption: 'issued-screening-opinion.pdf',
				lettersToNeighbours: 'letters-to-neighbours.pdf',
				otherRelevantPolicies: ['policy-1.pdf'],
				planningOfficersReport: 'planning-officers-report.pdf',
				policiesFromStatutoryDevelopment: ['policy-a.pdf'],
				pressAdvert: 'press-advert.pdf',
				representationsFromOtherParties: ['representations-from-other-parties-1.pdf'],
				responsesOrAdvice: ['responses-or-advice.pdf'],
				screeningDirection: 'screening-direction.pdf',
				siteNotice: 'site-notice.pdf',
				supplementaryPlanningDocuments: ['supplementary-1.pdf']
			},
			doesAffectAListedBuilding: lpaQuestionnaire?.doesAffectAListedBuilding,
			doesAffectAScheduledMonument: lpaQuestionnaire?.doesAffectAScheduledMonument,
			doesSiteHaveHealthAndSafetyIssues: lpaQuestionnaire?.doesSiteHaveHealthAndSafetyIssues,
			doesSiteRequireInspectorAccess: lpaQuestionnaire?.doesSiteRequireInspectorAccess,
			extraConditions: lpaQuestionnaire?.extraConditions,
			hasCommunityInfrastructureLevy: lpaQuestionnaire?.hasCommunityInfrastructureLevy,
			hasCompletedAnEnvironmentalStatement: lpaQuestionnaire?.hasCompletedAnEnvironmentalStatement,
			hasEmergingPlan: lpaQuestionnaire?.hasEmergingPlan,
			hasExtraConditions: lpaQuestionnaire?.hasExtraConditions,
			hasOtherAppeals: lpaQuestionnaire?.hasOtherAppeals,
			hasProtectedSpecies: lpaQuestionnaire?.hasProtectedSpecies,
			hasRepresentationsFromOtherParties: lpaQuestionnaire?.hasRepresentationsFromOtherParties,
			hasResponsesOrStandingAdviceToUpload: lpaQuestionnaire?.hasResponsesOrStandingAdviceToUpload,
			hasStatementOfCase: lpaQuestionnaire?.hasStatementOfCase,
			hasStatutoryConsultees: lpaQuestionnaire?.hasStatutoryConsultees,
			hasSupplementaryPlanningDocuments: lpaQuestionnaire?.hasSupplementaryPlanningDocuments,
			hasTreePreservationOrder: lpaQuestionnaire?.hasTreePreservationOrder,
			healthAndSafetyDetails: lpaQuestionnaire?.healthAndSafetyDetails,
			inCAOrrelatesToCA: lpaQuestionnaire?.inCAOrrelatesToCA,
			includesScreeningOption: lpaQuestionnaire?.includesScreeningOption,
			...(isOutcomeIncomplete(lpaQuestionnaire?.lpaQuestionnaireValidationOutcome?.name || '') && {
				incompleteReasons:
					lpaQuestionnaire?.lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire?.map(
						({ lpaQuestionnaireIncompleteReason }) => ({
							name: lpaQuestionnaireIncompleteReason.name
						})
					) || null
			}),
			inquiryDays: lpaQuestionnaire?.inquiryDays,
			inspectorAccessDetails: lpaQuestionnaire?.inspectorAccessDetails,
			isAffectingNeighbouringSites: lpaQuestionnaire?.isAffectingNeighbouringSites,
			isCommunityInfrastructureLevyFormallyAdopted:
				lpaQuestionnaire?.isCommunityInfrastructureLevyFormallyAdopted,
			isEnvironmentalStatementRequired: lpaQuestionnaire?.isEnvironmentalStatementRequired,
			isGypsyOrTravellerSite: lpaQuestionnaire?.isGypsyOrTravellerSite,
			isListedBuilding: lpaQuestionnaire?.isListedBuilding,
			isPublicRightOfWay: lpaQuestionnaire?.isPublicRightOfWay,
			isSensitiveArea: lpaQuestionnaire?.isSensitiveArea,
			isSiteVisible: lpaQuestionnaire?.isSiteVisible,
			isTheSiteWithinAnAONB: lpaQuestionnaire?.isTheSiteWithinAnAONB,
			listedBuildingDetails: formatListedBuildingDetails(
				false,
				lpaQuestionnaire?.listedBuildingDetails
			),
			localPlanningDepartment,
			lpaNotificationMethods: lpaQuestionnaire?.lpaNotificationMethods?.map(
				({ lpaNotificationMethod: { name } }) => ({ name })
			),
			lpaQuestionnaireId: lpaQuestionnaire?.id,
			meetsOrExceedsThresholdOrCriteriaInColumn2:
				lpaQuestionnaire?.meetsOrExceedsThresholdOrCriteriaInColumn2,
			neighbouringSiteContacts: lpaQuestionnaire?.neighbouringSiteContact?.length
				? lpaQuestionnaire.neighbouringSiteContact.map((contact) => ({
						address: formatAddress(contact.address),
						email: contact.email,
						firstName: contact.firstName,
						lastName: contact.lastName,
						telephone: contact.telephone
				  }))
				: null,
			otherAppeals: formatLinkedAppeals(appeal.otherAppeals, appeal.id),
			...(isOutcomeIncomplete(lpaQuestionnaire?.lpaQuestionnaireValidationOutcome?.name || '') && {
				...(isOutcomeIncomplete(
					lpaQuestionnaire?.lpaQuestionnaireValidationOutcome?.name || ''
				) && { otherNotValidReasons: lpaQuestionnaire?.otherNotValidReasons || null })
			}),
			procedureType: lpaQuestionnaire?.procedureType?.name,
			scheduleType: lpaQuestionnaire?.scheduleType?.name,
			sensitiveAreaDetails: lpaQuestionnaire?.sensitiveAreaDetails,
			siteWithinGreenBelt: lpaQuestionnaire?.siteWithinGreenBelt,
			statutoryConsulteesDetails: lpaQuestionnaire?.statutoryConsulteesDetails,
			validationOutcome: lpaQuestionnaire?.lpaQuestionnaireValidationOutcome?.name || null
		};
	},
	/**
	 * @param {RepositoryGetByIdResultItem} appeal
	 * @returns {SingleAppellantCaseResponse | void}}
	 */
	formatAppellantCase(appeal) {
		const { appellantCase, siteVisit } = appeal;

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
				appealSite: formatAddress(appeal.address),
				appellantCaseId: appellantCase.id,
				appellant: {
					company: appeal.appellant?.company || null,
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
				documents: {
					appealStatement: 'appeal-statement.pdf',
					applicationForm: 'application-form.pdf',
					decisionLetter: 'decision-letter.pdf',
					...(isFPA(appeal.appealType) && {
						designAndAccessStatement: 'design-and-access-statement.pdf',
						newPlansOrDrawings: ['new-plans-or-drawings-1.pdf', 'new-plans-or-drawings-2.pdf']
					}),
					newSupportingDocuments: [
						'new-supporting-documents-1.pdf',
						'new-supporting-documents-2.pdf'
					],
					...(isFPA(appeal.appealType) && {
						planningObligation: 'planning-obligation.pdf',
						plansDrawingsSupportingDocuments: [
							'plans-drawings-supporting-documents-1.pdf',
							'plans-drawings-supporting-documents-2.pdf'
						],
						separateOwnershipCertificate: 'separate-ownership-certificate.pdf'
					})
				},
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
				localPlanningDepartment: appeal.localPlanningDepartment,
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
				siteVisit: {
					siteVisitId: siteVisit?.id || null,
					visitType: siteVisit?.siteVisitType?.name || null
				},
				visibility: {
					details: appellantCase.visibilityRestrictions,
					isVisible: appellantCase.isSiteVisibleFromPublicRoad
				}
			};
		}
	}
};

export default appealFormatter;
