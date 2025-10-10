// @ts-nocheck
import { databaseConnector } from '@pins/applications.api/src/server/utils/database-connector.js';

const isSimulatedTest = process.env.REMOVE_ALL_CASES?.toLowerCase() !== 'true';
const maxCasesToDelete =
	parseInt(process.env.MAX_CASES_TO_DELETE ?? '0') || Number.MAX_SAFE_INTEGER;
const maxWaitInSeconds = parseInt(process.env.TRANSACTION_MAX_WAIT_IN_SECONDS ?? '0') || 20;
const maxTimeoutInSeconds = parseInt(process.env.TRANSACTION_TIMEOUT_IN_SECONDS ?? '0') || 100;
const specifiedCases =
	process.env.SPECIFIED_CASES?.split(',').map((reference) => reference.trim()) ?? [];

const blobs = [];

/**
 * @typedef {import('@prisma/client')} PrismaClient
 */

/**
 * Remove the RegionsOnApplicationDetails records, and the Application Details record for a case
 *
 * @param {PrismaClient} tx
 * @param {any} caseDetails
 * @returns {Promise<void>}
 */
const removeApplicationDetails = async (tx, caseDetails) => {
	const { reference, ApplicationDetails } = caseDetails || {};
	const { id } = ApplicationDetails || {};
	if (id) {
		console.log(`Removing application details: ${reference}-${id}`);
		await tx.regionsOnApplicationDetails.deleteMany({
			where: { applicationDetailsId: id }
		});
		await tx.applicationDetails.delete({ where: { id } });
	}
};

/**
 * Delete all the ProjectUpdateNotifications records for a case, and all the ProjectUpdate records on the case
 *
 * @param {import('@prisma/client')} tx
 * @param caseDetails
 * @returns {Promise<void>}
 */
const removeProjectUpdates = async (tx, caseDetails) => {
	const { id: caseId, reference } = caseDetails || {};
	const projectUpdates = await tx.projectUpdate.findMany({
		where: { caseId }
	});
	await Promise.all(
		projectUpdates.map(async (projectUpdate) => {
			const { id } = projectUpdate;
			console.log(`Removing project updates: ${reference}-${id}`);
			await tx.projectUpdateNotificationLog.deleteMany({ where: { projectUpdateId: id } });
			await tx.projectUpdate.delete({ where: { id } });
		})
	);
};

/**
 * Delete all the RepresentationAction records on Reps on the case, all RepresentationAttachment associative records, and all the Representations on the case,
 * and associated ServiceUser records and Address records
 *
 * @param {import('@prisma/client')} tx
 * @param caseDetails
 * @returns {Promise<void>}
 */
const removeRepresentations = async (tx, caseDetails) => {
	const { id: caseId } = caseDetails || {};
	const representations = await tx.representation.findMany({
		where: { caseId }
	});
	await Promise.all(
		representations.map(async (representation) => {
			const { id, reference, representativeId, representedId } = representation;
			console.log(`Removing representation: ${reference}`);
			await tx.representationAction.deleteMany({ where: { representationId: id } });
			await tx.representationAttachment.deleteMany({ where: { representationId: id } });
			await tx.representation.delete({ where: { id } });

			// and remove the server users for the representation, and any associated address records
			if (representedId) {
				console.log(`Removing representation service user: ${representedId}`);
				const repServiceUser = await tx.serviceUser.findUnique({ where: { id: representedId } });
				if (repServiceUser?.addressId) {
					await tx.address.delete({ where: { id: repServiceUser.addressId } });
				}
				await tx.serviceUser.delete({ where: { id: representedId } });
			}
			if (representativeId) {
				console.log(`Removing representative agent service user: ${representativeId}`);
				const repAgentServiceUser = await tx.serviceUser.findUnique({
					where: { id: representativeId }
				});
				if (repAgentServiceUser?.addressId) {
					await tx.address.delete({ where: { id: repAgentServiceUser.addressId } });
				}
				await tx.serviceUser.delete({ where: { id: representativeId } });
			}
		})
	);
};

/**
 * Delete the Exam timetable item records, and the exam timetable parent record on a case
 *
 * @param {import('@prisma/client')} tx
 * @param caseDetails
 * @returns {Promise<void>}
 */
const removeExaminationTimetables = async (tx, caseDetails) => {
	const { id: caseId, reference } = caseDetails || {};
	const examinationTimetables = await tx.examinationTimetable.findMany({
		where: { caseId }
	});
	await Promise.all(
		examinationTimetables.map(async (examinationTimetable) => {
			const { id } = examinationTimetable;
			console.log(`Removing examination timetable: ${reference}`);
			await tx.examinationTimetableItem.deleteMany({ where: { examinationTimetableId: id } });
			await tx.examinationTimetable.delete({ where: { id } });
		})
	);
};

/**
 * Delete the Applicant ServiceUser record on a case, and any associated Address record
 *
 * @param {PrismaClient} tx
 * @param {any} caseDetails
 * @returns {Promise<void>}
 */
const removeApplicant = async (tx, caseDetails) => {
	const { applicant, reference } = caseDetails;
	if (applicant?.id) {
		console.log(`Removing applicant: ${reference}`);
		const { address } = applicant;
		if (address?.id) {
			await tx.address.delete({ where: { id: address.id } });
		}
		await tx.serviceUser.delete({ where: { id: applicant.id } });
	}
};

/**
 * Soft-Delete a document on a case - DocumentActivityLog, DocumentVersions, Document table
 *
 * @param {PrismaClient} tx
 * @param document
 * @param folderPath
 * @returns {Promise<void>}
 */
const removeDocument = async (tx, document, folderPath) => {
	const { guid, documentReference } = document;

	console.log(`Removing document: ${folderPath}/${documentReference}`);

	await tx.document.updateMany({
		where: { guid },
		data: {
			latestVersionId: null
		}
	});

	const documentVersions = await tx.documentVersion.findMany({
		where: { documentGuid: guid }
	});

	documentVersions.forEach((documentVersion) => {
		const {
			privateBlobContainer,
			privateBlobPath,
			publishedBlobContainer,
			publishedBlobPath,
			fileName
		} = documentVersion;
		const privateBlob = `${privateBlobContainer}${privateBlobPath}/${fileName}`;
		console.log(`Private blob can be safely deleted: ${privateBlob}`);
		blobs.push(privateBlob);
		if (publishedBlobContainer && publishedBlobPath) {
			const publishedBlob = `${publishedBlobContainer}${publishedBlobPath}/${fileName}`;
			console.log(`Published blob can be safely deleted: ${publishedBlob}`);
			blobs.push(publishedBlob);
		}
	});

	await tx.documentVersion.updateMany({
		where: { documentGuid: guid },
		data: {
			transcriptGuid: null
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

	await tx.document.delete({
		where: { guid },
		hardDelete: true
	});
};

/**
 * Delete all the S51AdviceDocument records on the case (associating S51 advice with documents), and all the S51Advice records on the case
 *
 * @param {PrismaClient} tx
 * @param caseDetails
 * @returns {Promise<void>}
 */
const removeS51Advices = async (tx, caseDetails) => {
	const { id: caseId, reference } = caseDetails || {};
	const advices = await tx.s51Advice.findMany({
		where: { caseId }
	});
	await Promise.all(
		advices.map(async ({ id: adviceId, title }) => {
			console.log(`Removing S51 Advice: ${reference}-${title}`);
			await tx.s51AdviceDocument.deleteMany({ where: { adviceId } });
		})
	);
	await tx.s51Advice.deleteMany({ where: { caseId } });
};

/**
 * Recursively delete all the folders on the case, and Hard-Delete all the Documents, DocumentVersions and DocumentActivityLog records on the case
 *
 * @param {PrismaClient} tx
 * @param caseDetails
 * @returns {Promise<void>}
 */
const removeFoldersAndDocuments = async (tx, caseDetails) => {
	const { id: caseId, reference } = caseDetails;

	const folders = await tx.folder.findMany({
		where: { caseId }
	});

	const documents = await tx.document.findMany({
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

			await tx.folder.delete({ where: { id: folderId }, hardDelete: true });
		}
	};

	await removeFoldersByParentId(null);
};

/**
 * Delete various associated records on the case - CaseStatus, CasePublishedState, GridReference, ProjectTeam, and Subscriptions
 *
 * @param {PrismaClient} tx
 * @param caseDetails
 * @returns {Promise<void>}
 */
const removeOtherAssociatedRecords = async (tx, caseDetails) => {
	const { id: caseId, reference } = caseDetails || {};
	console.log(`Removing case status: ${reference}`);
	await tx.caseStatus.deleteMany({
		where: { caseId }
	});
	console.log(`Removing published state: ${reference}`);
	await tx.casePublishedState.deleteMany({
		where: { caseId }
	});
	console.log(`Removing grid reference: ${reference}`);
	await tx.gridReference.deleteMany({
		where: { caseId }
	});
	console.log(`Removing project team: ${reference}`);
	await tx.projectTeam.deleteMany({
		where: { caseId }
	});
	console.log(`Removing subscription: ${reference}`);
	await tx.subscription.deleteMany({
		where: { caseId }
	});
};

/**
 * Remove a case and associated records
 *
 * @param {string} reference
 * @returns {Promise<void>}
 */
const removeCase = async (reference) => {
	try {
		const startTime = Date.now();
		await databaseConnector.$transaction(
			async (tx) => {
				if (!reference.startsWith('TRAIN')) {
					throw new Error('Case is not a training case ' + reference);
				}
				const caseDetails = (await getCaseByReference(tx, reference)) || {};
				if (!caseDetails?.id) {
					throw new Error('No such case ' + reference);
				}
				const caseId = caseDetails.id;

				/* To remove a case fully:
					1 - Delete the RegionsOnApplicationDetails associative records, and the Application Details record
					2 - Delete the Exam timetable item records, and the exam timetable parent record
					3 - Delete all the RepresentationAction records on Reps on the case, all RepresentationAttachment associative records and all the Representations on the case, and all associated service users and their address records
					4 - Delete all the ProjectUpdateNotifications records for a case, and all the ProjectUpdate records on the case
					5 - Delete all the S51AdviceDocument records on the case (associating S51 advice with documents), and all the S51Advice records on the case
					6 - Delete various associated records on the case - CaseStatus, CasePublishedState, GridReference, ProjectTeam, and Subscriptions
					7 - Recursively delete all the folders on the case, and Hard-Deletes all the Documents, DocumentVersions and DocumentActivityLog records on the case
					8 - Delete the Applicant ServiceUser record on a case, and any associated Address record
				*/
				await removeApplicationDetails(tx, caseDetails);
				await removeExaminationTimetables(tx, caseDetails);
				await removeRepresentations(tx, caseDetails);
				await removeProjectUpdates(tx, caseDetails);
				await removeS51Advices(tx, caseDetails);
				await removeOtherAssociatedRecords(tx, caseDetails);
				await removeFoldersAndDocuments(tx, caseDetails);
				await removeApplicant(tx, caseDetails);

				await tx.case.delete({ where: { id: caseId } });

				console.log(`${reference} Removed in ${(Date.now() - startTime) / 1000} seconds`);

				if (isSimulatedTest) {
					throw new Error('Simulated deletion test');
				}
			},
			{
				maxWait: maxWaitInSeconds * 1000,
				timeout: maxTimeoutInSeconds * 1000
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
 * Remove cases and associated records that match the references supplied using the removeCase fn
 *
 * @param {string[]} references
 * @returns {Promise<{successes,errors}>}
 */
const removeCases = async (references) => {
	const errors = [];
	const successes = [];

	if (isSimulatedTest) {
		console.log('SIMULATED DELETION TEST, NO CASES WILL BE REMOVED\n');
	}

	console.log(`Attempting to delete ${references.length} cases\n`);

	for (const reference of references) {
		const error = await removeCase(reference.toUpperCase());
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
		console.log(`\nSkipped ${errors.length} case${errors.length === 1 ? '' : 's'} due to errors:`);
		errors.forEach(({ reference }) => console.log('- ' + reference));
	}
	if (blobs.length > 0) {
		console.log(`\nThere are ${blobs.length} blobs that can be safely deleted:`);
		blobs.forEach((blob) => console.log('- ' + blob));
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
		take: maxCasesToDelete,
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
export const removeAllTrainingCases = async () => {
	const references = await getReferencesPrefixedWith('TRAIN');
	await removeCases(references);
};

/**
 * Remove all specified cases and associated records
 *
 * @returns {Promise<void>}
 */
export const removeSpecifiedCases = async () => {
	if (specifiedCases.length > 0) {
		console.log('Specified cases to be removed:');
		specifiedCases.forEach((reference) => console.log('- ' + reference));
		console.log('');
	}
	await removeCases(specifiedCases);
};

// ----- database functions -----
/**
 * get a case using case reference
 *
 * @param {PrismaClient} tx
 * @param {string} reference
 * @returns {import('@prisma/client').PrismaPromise<import('@prisma/client').Case | null>}
 * */
const getCaseByReference = async (tx, reference) => {
	return tx.case.findFirst({
		include: { ApplicationDetails: true, applicant: true },
		where: { reference }
	});
};
