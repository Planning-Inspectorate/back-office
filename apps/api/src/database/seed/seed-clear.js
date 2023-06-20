import { truncateTable } from '../prisma.truncate.js';

/**
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
export async function deleteAllRecords(databaseConnector) {
	const deleteCases = databaseConnector.case.deleteMany();
	const deleteCaseStatuses = databaseConnector.caseStatus.deleteMany();
	const deleteApplicationDetails = databaseConnector.applicationDetails.deleteMany();
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
	const deleteGridReference = databaseConnector.gridReference.deleteMany();
	const deleteDocuments = databaseConnector.document.deleteMany();
	const deleteDocumentsVersions = databaseConnector.documentVersion.deleteMany();
	const deleteFolders = databaseConnector.folder.deleteMany();
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

	// and reference data tables
	const deleteAppealTypes = databaseConnector.appealType.deleteMany();
	const deleteDesignatedSites = databaseConnector.designatedSite.deleteMany();
	const deletelpaNotificationMethods = databaseConnector.lPANotificationMethods.deleteMany();
	const deleteSubSector = databaseConnector.subSector.deleteMany();
	const deleteSector = databaseConnector.sector.deleteMany();
	const deleteRegion = databaseConnector.region.deleteMany();
	const deleteZoomLevel = databaseConnector.zoomLevel.deleteMany();
	const deleteExaminationTimetableType = databaseConnector.examinationTimetableItem.deleteMany();
	const planningObligationStatus = databaseConnector.planningObligationStatus.deleteMany();
	const knowledgeOfOtherLandowners = databaseConnector.knowledgeOfOtherLandowners.deleteMany();
	const deleteAppellantCaseIncompleteReason =
		databaseConnector.appellantCaseIncompleteReason.deleteMany();
	const deleteAppellantCaseInvalidReason =
		databaseConnector.appellantCaseInvalidReason.deleteMany();
	const deleteValidationOutcome = databaseConnector.validationOutcome.deleteMany();

	// Truncate calls on data tables
	await deleteRepresentationAction;
	await deleteRepresentationContact;
	await deleteRepresentation;

	// delete document versions, documents, and THEN the folders.  Has to be in this order for integrity constraints
	// TODO: Currently an issue with cyclic references, hence this hack to clear the latestVersionId
	await databaseConnector.$queryRawUnsafe(`UPDATE Document SET latestVersionId = NULL;`);
	await deleteDocumentsVersions;
	await deleteDocuments;

	// truncate tables
	await truncateTable('RegionsOnApplicationDetails');
	await truncateTable('ExaminationTimetableItem');

	await deleteLowestFolders(databaseConnector);
	await deleteLowestFolders(databaseConnector);
	await deleteLowestFolders(databaseConnector);
	await deleteLowestFolders(databaseConnector);
	await deleteLowestFolders(databaseConnector);

	await databaseConnector.$transaction([
		deleteGridReference,
		deleteServiceCustomers,
		deleteApplicationDetails,
		deleteCaseStatuses,
		deleteCases,
		deleteAppellantCaseIncompleteReasonOnAppellantCase,
		deleteAppellantCaseInvalidReasonOnAppellantCase,
		deleteAppellantCase,
		deleteAppealStatus,
		deleteValidationDecision,
		deleteDesignatedSitesOnLPAQuestionnaires,
		deleteLPANotificationMethodsOnLPAQuestionnaires,
		deleteLPAQuestionnaire,
		deleteReviewQuestionnaire,
		deleteSiteVisit,
		deleteUsers,
		deleteAppealTimetable,
		deleteAddresses,
		deleteInspectorDecision,
		deleteAppeals,
		deleteAppellant,
		deleteFolders,
		deleteListedBuildingDetails
	]);

	// after deleting the case data, can delete the reference lookup tables
	await deleteAppealTypes;
	await deleteDesignatedSites;
	await deletelpaNotificationMethods;
	await deleteSubSector;
	await deleteSector;
	await deleteRegion;
	await deleteZoomLevel;
	await deleteExaminationTimetableType;
	await planningObligationStatus;
	await knowledgeOfOtherLandowners;
	await deleteAppellantCaseIncompleteReason;
	await deleteAppellantCaseInvalidReason;
	await deleteValidationOutcome;
}

/**
 *
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
async function deleteLowestFolders(databaseConnector) {
	await databaseConnector.folder.deleteMany({
		where: {
			childFolders: {
				every: {
					parentFolder: null
				}
			}
		}
	});
}
