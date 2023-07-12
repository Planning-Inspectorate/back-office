import { truncateTable } from '../prisma.truncate.js';

/**
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
export async function deleteAllRecords(databaseConnector) {
	const deleteCases = databaseConnector.case.deleteMany();
	const deleteCaseStatuses = databaseConnector.caseStatus.deleteMany();
	const deleteApplicationDetails = databaseConnector.applicationDetails.deleteMany();
	const deleteUsers = databaseConnector.user.deleteMany();
	const deleteAddresses = databaseConnector.address.deleteMany();
	const deleteServiceCustomers = databaseConnector.serviceCustomer.deleteMany();
	const deleteGridReference = databaseConnector.gridReference.deleteMany();
	const deleteDocuments = databaseConnector.document.deleteMany();
	const deleteDocumentsVersions = databaseConnector.documentVersion.deleteMany();
	const deleteFolders = databaseConnector.folder.deleteMany();
	const deleteRepresentationContact = databaseConnector.representationContact.deleteMany();
	const deleteRepresentationAttachment = databaseConnector.representationAttachment.deleteMany();
	const deleteRepresentation = databaseConnector.representation.deleteMany();
	const deleteRepresentationAction = databaseConnector.representationAction.deleteMany();
	const deleteProjectUpdates = databaseConnector.projectUpdate.deleteMany();

	// and reference data tables
	const deleteSubSector = databaseConnector.subSector.deleteMany();
	const deleteSector = databaseConnector.sector.deleteMany();
	const deleteRegion = databaseConnector.region.deleteMany();
	const deleteZoomLevel = databaseConnector.zoomLevel.deleteMany();
	const deleteExaminationTimetableType = databaseConnector.examinationTimetableItem.deleteMany();

	// Truncate calls on data tables
	await deleteRepresentationAttachment;
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

	// delete before cases
	await deleteProjectUpdates;

	await databaseConnector.$transaction([
		deleteGridReference,
		deleteServiceCustomers,
		deleteApplicationDetails,
		deleteCaseStatuses,
		deleteCases,
		deleteUsers,
		deleteAddresses,
		deleteFolders
	]);

	// after deleting the case data, can delete the reference lookup tables
	await deleteSubSector;
	await deleteSector;
	await deleteRegion;
	await deleteZoomLevel;
	await deleteExaminationTimetableType;
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
