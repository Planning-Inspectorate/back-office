import { truncateTable } from '../prisma.truncate.js';

/**
 * Seeding function to clear down a database, deletes all cases, documents, records, reference tables, etc
 *
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
export async function deleteAllRecords(databaseConnector) {
	const deleteCases = databaseConnector.case.deleteMany();
	const deleteCaseStatuses = databaseConnector.caseStatus.deleteMany();
	const deleteCasePublishedStates = databaseConnector.casePublishedState.deleteMany();
	const deleteRegionsOnApplicationDetails =
		databaseConnector.regionsOnApplicationDetails.deleteMany();
	const deleteApplicationDetails = databaseConnector.applicationDetails.deleteMany();
	const deleteProjectTeam = databaseConnector.projectTeam.deleteMany();
	const deleteUsers = databaseConnector.user.deleteMany();
	const deleteAddresses = databaseConnector.address.deleteMany();
	const deleteServiceUsers = databaseConnector.serviceUser.deleteMany();
	const deleteGridReference = databaseConnector.gridReference.deleteMany();
	const deleteDocuments = databaseConnector.document.deleteMany();
	const deleteDocumentsVersions = databaseConnector.documentVersion.deleteMany();
	const deleteDocumentActivityLog = databaseConnector.documentActivityLog.deleteMany();
	const deletes51Advice = databaseConnector.s51Advice.deleteMany();
	const deletes51AdviceDocument = databaseConnector.s51AdviceDocument.deleteMany();
	const deleteFolders = databaseConnector.folder.deleteMany();
	const deleteLowestFolders = databaseConnector.folder.deleteMany({
		where: {
			childFolders: {
				every: {
					parentFolder: null
				}
			}
		}
	});
	const deleteRepresentationAttachment = databaseConnector.representationAttachment.deleteMany();
	const deleteRepresentation = databaseConnector.representation.deleteMany();
	const deleteRepresentationAction = databaseConnector.representationAction.deleteMany();
	const deleteProjectUpdates = databaseConnector.projectUpdate.deleteMany();
	const deleteExaminationTimetable = databaseConnector.examinationTimetable.deleteMany();

	// and reference data tables
	const deleteSubSector = databaseConnector.subSector.deleteMany();
	const deleteSector = databaseConnector.sector.deleteMany();
	const deleteRegion = databaseConnector.region.deleteMany();
	const deleteZoomLevel = databaseConnector.zoomLevel.deleteMany();
	const deleteExaminationTimetableType = databaseConnector.examinationTimetableItem.deleteMany();

	// start deleting ...
	await deleteRepresentationAttachment;
	await deleteRepresentationAction;
	await deleteRepresentation;

	// delete S51 advice documents, S51 Advice, document Activity logs, document versions, documents, and THEN the folders.
	// Has to be in this order for integrity constraints
	await deletes51AdviceDocument;
	await deletes51Advice;
	// TODO: Currently an issue with cyclic references, hence this hack to clear the latestVersionId
	await databaseConnector.$queryRawUnsafe(`UPDATE Document SET latestVersionId = NULL;`);
	await deleteDocumentActivityLog;
	await deleteDocumentsVersions;
	await deleteDocuments;

	// truncate / delete tables
	await truncateTable('RegionsOnApplicationDetails');
	await truncateTable('ExaminationTimetableItem');
	await truncateTable('Subscription');
	await deleteExaminationTimetable;

	// delete before cases
	await deleteProjectUpdates;

	await databaseConnector.$transaction([deleteLowestFolders, deleteRegionsOnApplicationDetails]);

	await databaseConnector.$transaction([deleteFolders, deleteServiceUsers]);

	await databaseConnector.$transaction([
		deleteGridReference,
		deleteProjectTeam,
		deleteApplicationDetails,
		deleteCaseStatuses,
		deleteCasePublishedStates
	]);

	await databaseConnector.$transaction([deleteCases, deleteUsers, deleteAddresses]);

	// after deleting the case data, can delete the reference lookup tables
	await deleteSubSector;
	await deleteSector;
	await deleteRegion;
	await deleteZoomLevel;
	await deleteExaminationTimetableType;
}
