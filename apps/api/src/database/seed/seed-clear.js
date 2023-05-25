import { truncateTable } from '../prisma.truncate.js';

/**
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
export async function deleteAllRecords(databaseConnector) {
	const deleteCases = databaseConnector.case.deleteMany();
	const deleteCaseStatuses = databaseConnector.caseStatus.deleteMany();
	const deleteApplicationDetails = databaseConnector.applicationDetails.deleteMany();
	const deleteSubSectors = databaseConnector.subSector.deleteMany();
	const deleteSectors = databaseConnector.sector.deleteMany();
	const deleteRegions = databaseConnector.region.deleteMany();
	const deleteZoomLevels = databaseConnector.zoomLevel.deleteMany();
	const deleteExaminationTimetables = databaseConnector.examinationTimetableType.deleteMany();
	const deleteAppeals = databaseConnector.appeal.deleteMany();
	const deleteUsers = databaseConnector.user.deleteMany();
	const deleteAppealTypes = databaseConnector.appealType.deleteMany();
	const deleteAddresses = databaseConnector.address.deleteMany();
	const deleteAppealDetailsFromAppellant =
		databaseConnector.appealDetailsFromAppellant.deleteMany();
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

	// Truncate calls
	const deleteRegionsOnApplicationDetails = truncateTable('RegionsOnApplicationDetails');

	await deleteRepresentationAction;
	await deleteRepresentationContact;
	await deleteRepresentation;

	// delete document versions, documents, and THEN the folders.  Has to be in this order for integrity constraints
	await deleteDocumentsVersions;
	await deleteDocuments;

	// truncate table
	await deleteRegionsOnApplicationDetails;

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
		deleteSubSectors,
		deleteSectors,
		deleteRegions,
		deleteZoomLevels,
		deleteExaminationTimetables,
		deleteAppealDetailsFromAppellant,
		deleteAppealStatus,
		deleteValidationDecision,
		deleteLPAQuestionnaire,
		deleteReviewQuestionnaire,
		deleteSiteVisit,
		deleteUsers,
		deleteAppealTypes,
		deleteAppealTimetable,
		deleteAddresses,
		deleteInspectorDecision,
		deleteAppeals,
		deleteAppellant,
		deleteFolders
	]);
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
