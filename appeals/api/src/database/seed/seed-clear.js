/**
 * @param {import('../../server/utils/db-client/index.js').PrismaClient} databaseConnector
 */
export async function deleteAllRecords(databaseConnector) {
	const deleteAudits = databaseConnector.auditTrail.deleteMany();
	const deleteFolders = databaseConnector.folder.deleteMany();
	const deleteAppeals = databaseConnector.appeal.deleteMany();
	const deleteUsers = databaseConnector.user.deleteMany();
	const deleteAddresses = databaseConnector.address.deleteMany();
	const deleteAppellantCase = databaseConnector.appellantCase.deleteMany();
	const deleteAppealStatus = databaseConnector.appealStatus.deleteMany();
	const deleteAppealTimetable = databaseConnector.appealTimetable.deleteMany();
	const deleteAppellant = databaseConnector.appellant.deleteMany();
	const deleteInspectorDecision = databaseConnector.inspectorDecision.deleteMany();
	const deleteLPAQuestionnaire = databaseConnector.lPAQuestionnaire.deleteMany();
	const deleteReviewQuestionnaire = databaseConnector.reviewQuestionnaire.deleteMany();
	const deleteSiteVisit = databaseConnector.siteVisit.deleteMany();
	const deleteValidationDecision = databaseConnector.validationDecision.deleteMany();
	const deleteServiceCustomers = databaseConnector.serviceCustomer.deleteMany();
	const deleteDocuments = databaseConnector.document.deleteMany();
	const deleteDocumentsVersions = databaseConnector.documentVersion.deleteMany();
	const deleteRepresentationContact = databaseConnector.representationContact.deleteMany();
	const deleteRepresentation = databaseConnector.representation.deleteMany();
	const deleteRepresentationAction = databaseConnector.representationAction.deleteMany();
	const deleteListedBuildingDetails = databaseConnector.listedBuildingDetails.deleteMany();
	const deleteDesignatedSitesOnLPAQuestionnaires =
		databaseConnector.designatedSitesOnLPAQuestionnaires.deleteMany();
	const deleteLPANotificationMethodsOnLPAQuestionnaires =
		databaseConnector.lPANotificationMethodsOnLPAQuestionnaires.deleteMany();
	const deleteAppellantCaseIncompleteReasonOnAppellantCase =
		databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.deleteMany();
	const deleteAppellantCaseInvalidReasonOnAppellantCase =
		databaseConnector.appellantCaseInvalidReasonOnAppellantCase.deleteMany();
	const deleteLPAQuestionnaireIncompleteReasonOnLPAQuestionnaire =
		databaseConnector.lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire.deleteMany();
	const deleteNeighbouringSiteContacts = databaseConnector.neighbouringSiteContact.deleteMany();
	const deleteAppellantCaseIncompleteReasonText =
		databaseConnector.appellantCaseIncompleteReasonText.deleteMany();
	const deleteAppellantCaseInvalidReasonText =
		databaseConnector.appellantCaseInvalidReasonText.deleteMany();
	const deleteLPAQuestionnaireIncompleteReasonText =
		databaseConnector.lPAQuestionnaireIncompleteReasonText.deleteMany();

	// and reference data tables
	const deleteAppealTypes = databaseConnector.appealType.deleteMany();
	const deleteDesignatedSites = databaseConnector.designatedSite.deleteMany();
	const deletelpaNotificationMethods = databaseConnector.lPANotificationMethods.deleteMany();
	const planningObligationStatus = databaseConnector.planningObligationStatus.deleteMany();
	const knowledgeOfOtherLandowners = databaseConnector.knowledgeOfOtherLandowners.deleteMany();
	const deleteAppellantCaseIncompleteReason =
		databaseConnector.appellantCaseIncompleteReason.deleteMany();
	const deleteAppellantCaseInvalidReason =
		databaseConnector.appellantCaseInvalidReason.deleteMany();
	const deleteAppellantCaseValidationOutcome =
		databaseConnector.appellantCaseValidationOutcome.deleteMany();
	const deleteLPAQuestionnaireValidationOutcome =
		databaseConnector.lPAQuestionnaireValidationOutcome.deleteMany();
	const deleteAppealAllocationLevels = databaseConnector.appealAllocation.deleteMany();
	const deleteAppealSpecialisms = databaseConnector.appealSpecialism.deleteMany();
	const deleteSpecialisms = databaseConnector.specialism.deleteMany();
	const deleteLPAQUestionnaireIncompleteReason =
		databaseConnector.lPAQuestionnaireIncompleteReason.deleteMany();

	// Truncate calls on data tables
	await deleteRepresentationAction;
	await deleteRepresentationContact;
	await deleteRepresentation;

	// delete document versions, documents, and THEN the folders.  Has to be in this order for integrity constraints
	// TODO: Currently an issue with cyclic references, hence this hack to clear the latestVersionId
	await databaseConnector.$queryRawUnsafe(`UPDATE Document SET latestVersionId = NULL;`);
	await deleteDocumentsVersions;
	await deleteDocuments;

	await databaseConnector.$transaction([
		deleteAppealAllocationLevels,
		deleteAppealSpecialisms,
		deleteServiceCustomers,
		deleteAppellantCaseIncompleteReasonText,
		deleteAppellantCaseIncompleteReasonOnAppellantCase,
		deleteAppellantCaseInvalidReasonText,
		deleteAppellantCaseInvalidReasonOnAppellantCase,
		deleteAppellantCase,
		deleteAppealStatus,
		deleteValidationDecision,
		deleteDesignatedSitesOnLPAQuestionnaires,
		deleteLPANotificationMethodsOnLPAQuestionnaires,
		deleteLPAQuestionnaireIncompleteReasonText,
		deleteLPAQuestionnaireIncompleteReasonOnLPAQuestionnaire,
		deleteNeighbouringSiteContacts,
		deleteLPAQuestionnaire,
		deleteReviewQuestionnaire,
		deleteSiteVisit,
		deleteAppealTimetable,
		deleteAddresses,
		deleteInspectorDecision,
		deleteAudits,
		deleteFolders,
		deleteAppeals,
		deleteUsers,
		deleteAppellant,
		deleteListedBuildingDetails
	]);

	// after deleting the case data, can delete the reference lookup tables
	await deleteAppealTypes;
	await deleteDesignatedSites;
	await deletelpaNotificationMethods;
	await planningObligationStatus;
	await knowledgeOfOtherLandowners;
	await deleteAppellantCaseIncompleteReason;
	await deleteAppellantCaseInvalidReason;
	await deleteAppellantCaseValidationOutcome;
	await deleteLPAQuestionnaireValidationOutcome;
	await deleteSpecialisms;
	await deleteLPAQUestionnaireIncompleteReason;
}
