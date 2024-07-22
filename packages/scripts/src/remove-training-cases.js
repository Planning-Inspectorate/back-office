// @ts-nocheck
import {
	getByRef as getCaseByRef,
	getById as getCaseById
} from '@pins/applications.api/src/server/repositories/case.repository.js';
import { databaseConnector } from '@pins/applications.api/src/server/utils/database-connector.js';
import { Prisma } from '@prisma/client';

const isSimulatedTest = process.env.REMOVE_ALL_CASES?.toLowerCase() !== 'true';

/**
 * @typedef {import('@prisma/client')} PrismaClient
 */

/**
 * @param {PrismaClient} tx
 * @param {any} applicationDetails
 * @returns {Promise<void>}
 */
const removeApplicationDetails = async (tx, applicationDetails) => {
	if (applicationDetails?.id) {
		await tx.regionsOnApplicationDetails.deleteMany({
			where: { applicationDetailsId: applicationDetails.id }
		});
		await tx.applicationDetails.delete({ where: { id: applicationDetails.id } });
	}
};

/**
 * @param {import('@prisma/client')} tx
 * @param caseId
 * @returns {Promise<void>}
 */
const removeProjectUpdates = async (tx, caseId) => {
	const projectUpdates = await databaseConnector.projectUpdate.findMany({
		where: { caseId }
	});
	await Promise.all(
		projectUpdates.map(async (projectUpdate) => {
			const { id } = projectUpdate;
			await tx.projectUpdateNotificationLog.deleteMany({ where: { projectUpdateId: id } });
			await tx.projectUpdate.delete({ where: { id } });
		})
	);
};

/**
 * @param {import('@prisma/client')} tx
 * @param caseId
 * @returns {Promise<void>}
 */
const removeRepresentations = async (tx, caseId) => {
	const representations = await databaseConnector.representation.findMany({
		where: { caseId }
	});
	await Promise.all(
		representations.map(async (representation) => {
			const { id } = representation;
			await tx.representationAction.deleteMany({ where: { representationId: id } });
			await tx.representation.delete({ where: { id } });
		})
	);
};

/**
 * @param {import('@prisma/client')} tx
 * @param caseId
 * @returns {Promise<void>}
 */
const removeExaminationTimetables = async (tx, caseId) => {
	const examinationTimetables = await databaseConnector.examinationTimetable.findMany({
		where: { caseId }
	});
	await Promise.all(
		examinationTimetables.map(async (examinationTimetable) => {
			const { id } = examinationTimetable;
			await tx.examinationTimetableItem.deleteMany({ where: { examinationTimetableId: id } });
			await tx.examinationTimetable.delete({ where: { id } });
		})
	);
};

/**
 * @param {PrismaClient} tx
 * @param {any} serviceUser
 * @returns {Promise<void>}
 */
const removeServiceUser = async (tx, serviceUser) => {
	if (serviceUser?.id) {
		const { address } = serviceUser;
		if (address?.id) {
			await tx.address.delete({ where: { id: address.id } });
		}
		await tx.serviceUser.delete({ where: { id: serviceUser.id } });
	}
};

/**
 *
 * @param {PrismaClient} tx
 * @param document
 * @param folderPath
 * @returns {Promise<void>}
 */
const removeDocument = async (tx, document, folderPath) => {
	const { guid, documentReference } = document;

	console.log(`Removing document: ${folderPath}/${documentReference}`);

	// TODO: Currently an issue with cyclic references, hence this hack to clear the transcriptGuid
	// await tx.$queryRawUnsafe(
	// 	`UPDATE DocumentVersion SET transcriptGuid = NULL, version = NULL WHERE documentGuid = '${guid}';`
	// );

	await tx.document.updateMany({
		where: { guid },
		data: {
			latestVersionId: null
		}
	});

	await tx.documentActivityLog.deleteMany({
		where: {
			documentGuid: guid
		}
	});

	await tx.documentVersion.deleteMany({
		where: {
			documentGuid: guid
		}
	});

	// TODO: Currently an issue with cyclic references, hence this hack to clear the latestVersionId
	// await tx.$queryRawUnsafe(`-- UPDATE Document SET latestVersionId = NULL WHERE guid = '${guid}';`);

	await tx.document.delete({
		where: { guid },
		isTraining: true
	});
};
/**
 *
 * @param {PrismaClient} tx
 * @param caseId
 * @returns {Promise<void>}
 */
const removeS51Advices = async (tx, caseId) => {
	const advices = await databaseConnector.s51Advice.findMany({
		where: { caseId }
	});
	await Promise.all(
		advices.map(async ({ id: adviceId }) =>
			tx.s51AdviceDocument.deleteMany({ where: { adviceId } })
		)
	);
	await tx.s51Advice.deleteMany({ where: { caseId } });
};

/**
 *
 * @param {PrismaClient} tx
 * @param caseDetails
 * @returns {Promise<void>}
 */
const removeFoldersAndDocuments = async (tx, caseDetails) => {
	const { id: caseId, reference } = caseDetails;

	const folders = await databaseConnector.folder.findMany({
		where: { caseId }
	});
	const documents = await databaseConnector.document.findMany({
		where: { caseId }
	});

	const removeFoldersByParentId = async (folderId, folderPath = reference) => {
		const childFolders = folders.filter((folder) => folder.parentFolderId === folderId);

		for (const folder of childFolders) {
			await removeFoldersByParentId(folder.id, `${folderPath}/${folder.displayNameEn}`);
		}

		if (folderId) {
			const folderDocuments = documents.filter((document) => document.folderId === folderId);

			for (const document of folderDocuments) {
				await removeDocument(tx, document, folderPath);
			}

			console.log(`Removing folder: ${folderPath}`);

			await tx.folder.delete({ where: { id: folderId } });
		}
	};

	await removeFoldersByParentId(null);
};

/**
 *
 * @param {PrismaClient} tx
 * @param caseId
 * @returns {Promise<void>}
 */
const removeOtherAssociatedRecords = async (tx, caseId) => {
	await tx.caseStatus.deleteMany({
		where: { caseId }
	});
	await tx.casePublishedState.deleteMany({
		where: { caseId }
	});
	await tx.gridReference.deleteMany({
		where: { caseId }
	});
	await tx.projectTeam.deleteMany({
		where: { caseId }
	});
	await tx.subscription.deleteMany({
		where: { caseId }
	});
};

/**
 * @param {string} reference
 * @returns {Promise<void>}
 */
const removeCase = async (reference) => {
	try {
		await databaseConnector.$transaction(
			async (tx) => {
				const { id: caseId } = (await getCaseByRef(reference)) || {};
				if (!caseId) {
					throw new Error('No such case ' + reference);
				}
				const caseDetails = await getCaseById(caseId, {
					applicationDetails: true,
					applicant: true
				});

				const { applicant, ApplicationDetails } = caseDetails;

				await removeApplicationDetails(tx, ApplicationDetails);
				await removeExaminationTimetables(tx, caseId);
				await removeRepresentations(tx, caseId);
				await removeProjectUpdates(tx, caseId);
				await removeS51Advices(tx, caseId);
				await removeOtherAssociatedRecords(tx, caseId);
				await removeFoldersAndDocuments(tx, caseDetails);
				await removeServiceUser(tx, applicant);
				await removeS51Advices(tx, caseId);

				await tx.case.delete({ where: { id: caseId } });

				console.log(reference + ' Removed');

				if (isSimulatedTest) {
					throw new Error('Simulated deletion test');
				}
			},
			{
				maxWait: 20000, // default: 2000
				timeout: 100000, // default: 5000
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable // optional, default defined by database configuration
			}
		);
	} catch (e) {
		if (e.message !== 'Simulated deletion test') {
			console.log(reference + ' Removal failed');
			console.log(e.message);
			return e;
		}
	}
};

/**
 * Remove cases and associated records that match the references supplied
 *
 * @param {string[]} references
 * @returns {Promise<{successes,errors}>}
 */
export const removeCases = async (references) => {
	const errors = [];
	const successes = [];

	if (isSimulatedTest) {
		console.log('SIMULATED DELETION TEST, NO CASES WILL BE REMOVED\n');
	}

	for (const reference of references) {
		const error = await removeCase(reference);
		if (error) {
			errors.push({ reference, error });
		} else {
			successes.push({ reference });
		}
	}

	console.log('\n*************************************');
	console.log(`Removed ${successes.length} case${successes.length === 1 ? '' : 's'}`);
	successes.forEach(({ reference }) => console.log('- ' + reference));
	if (errors.length > 0) {
		console.log(`\nSkipped ${errors.length} cases due to errors:`);
		errors.forEach(({ reference }) => console.log('- ' + reference));
	}
	console.log('*************************************\n');
	if (errors.length > 0) {
		throw errors;
	}
};

/**
 * Retrieves the references for all the training cases
 *
 * @param {string} startsWith
 * @returns {Promise<string[]>}
 */
const getReferencesPrefixedWith = async (startsWith) => {
	const cases = await databaseConnector.case.findMany({
		where: {
			reference: {
				startsWith
			}
		}
	});

	return cases.map(({ reference }) => reference);
};

/**
 * Remove all training cases and associated records
 *
 * @returns {Promise<void>}
 */
export const removeAllTrainingCase = async () => {
	// const references = await getReferencesPrefixedWith('TRAIN0110001');
	const references = await getReferencesPrefixedWith('TRAIN');
	await removeCases(references);
};
