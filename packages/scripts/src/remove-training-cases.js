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
	const projectUpdates = await tx.projectUpdate.findMany({
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
	const representations = await tx.representation.findMany({
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
	const examinationTimetables = await tx.examinationTimetable.findMany({
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
 * @returns {Promise<void>}
 */
const removeDocument = async (tx, document) => {
	const { guid } = document;

	await databaseConnector.document.updateMany({
		where: { guid },
		data: {
			latestVersionId: null
		}
	});

	await databaseConnector.document.deleteMany({
		where: { guid }
	});

	await tx.documentActivityLog.deleteMany({
		where: {
			documentGuid: guid
		}
	});

	await databaseConnector.documentVersion.updateMany({
		where: { guid },
		data: {
			transcriptGuid: null
		}
	});

	await databaseConnector.documentVersion.deleteMany({
		where: { guid }
	});

	await databaseConnector.document.deleteMany({
		where: { guid }
	});
};

/**
 *
 * @param {PrismaClient} tx
 * @param caseId
 * @returns {Promise<void>}
 */
const removeS51Advices = async (tx, caseId) => {
	const advices = await tx.s51Advice.findMany({
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
 * @param caseId
 * @returns {Promise<void>}
 */
const removeFoldersAndDocuments = async (tx, caseId) => {
	const folders = await tx.folder.findMany({
		where: { caseId }
	});
	const documents = await tx.document.findMany({
		where: { caseId }
	});

	const removeFoldersByParentId = async (folderId) => {
		await Promise.all(
			folders
				.filter((folder) => folder.parentFolderId === folderId)
				.map((folder) => removeFoldersByParentId(folder.id))
		);
		if (folderId) {
			await Promise.all(
				documents
					.filter((document) => document.folderId === folderId)
					.map((document) => removeDocument(tx, document))
			);
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
	await Promise.all([
		tx.caseStatus.deleteMany({
			where: { caseId }
		}),
		tx.casePublishedState.deleteMany({
			where: { caseId }
		}),
		tx.gridReference.deleteMany({
			where: { caseId }
		}),
		tx.projectTeam.deleteMany({
			where: { caseId }
		}),
		tx.subscription.deleteMany({
			where: { caseId }
		})
	]);
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
				await removeFoldersAndDocuments(tx, caseId);
				await removeServiceUser(tx, applicant);
				await removeS51Advices(tx, caseId);

				await tx.case.delete({ where: { id: caseId } });

				console.log(reference + ' Removed');

				if (isSimulatedTest) {
					throw new Error('Simulated deletion test');
				}
			},
			{
				maxWait: 5000, // default: 2000
				timeout: 10000, // default: 5000
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable // optional, default defined by database configuration
			}
		);
	} catch (e) {
		if (e.message !== 'Simulated deletion test') {
			console.log(reference + ' Removal failed');
			console.log(JSON.stringify(e, null, 2));
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
	const references = await getReferencesPrefixedWith('TRAIN');
	// const references = await getReferencesPrefixedWith('TRAIN');
	await removeCases(references);
};
