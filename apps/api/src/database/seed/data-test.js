/**
 * Test data used for development and testing
 */

import { createFolders } from '#repositories/folder.repository.js';
import { addressesList, caseStatusNames, representations } from './data-samples.js';
import { regions, subSectors, zoomLevels } from './data-static.js';
import { oneDatePerMonth, pseudoRandomInt } from './util.js';

// Application reference should be in the format (subSector)(5 digit sequential_number with leading 1) eg EN0110001
/**
 * @param {{abbreviation: string}} subSector
 * @param {number} referenceNumber
 * @returns {string}
 */
function generateApplicationReference(subSector, referenceNumber) {
	const formattedReferenceNumber = `1000${referenceNumber}`.slice(-5);

	return `${subSector.abbreviation}${formattedReferenceNumber}`;
}

/**
 *
 * @param {T[]} list
 * @returns {T}
 * @template T
 */
function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

/**
 *
 * @param {string} caseReference
 * @param {number} index
 * @param {boolean} isValidStatus
 * @returns {any}
 */
export function createRepresentation(caseReference, index, isValidStatus = false) {
	const { represented, representative, ...rep } = pickRandom(representations);

	const statuses = [
		'AWAITING_REVIEW',
		'REFERRED',
		'INVALID',
		'PUBLISHED',
		'WITHDRAWN',
		'ARCHIVED',
		'VALID'
	];

	const repTypes = [
		'Local authorities',
		'Members of the public/businesses',
		'Non-statutory organisations',
		'Statutory consultees',
		'Parish councils'
	];

	const status = isValidStatus ? 'VALID' : pickRandom(statuses);
	const unpublishedUpdates = status === 'PUBLISHED' ? Math.floor(Math.random() * 8) === 0 : false;

	// @ts-ignore
	represented.create.address = { create: pickRandom(addressesList) };

	const representation = {
		reference: `${caseReference}-${index}`,
		...rep,
		status,
		type: pickRandom(repTypes),
		unpublishedUpdates,
		represented
	};

	if (representative) {
		// @ts-ignore
		representative.create.address = { create: pickRandom(addressesList) };
		// @ts-ignore
		representation.representative = representative;
	}

	return representation;
}

/**
 *
 * @param {number} caseId
 * @returns {import('@prisma/client').Prisma.ProjectUpdateCreateManyInput}
 */
function generateProjectUpdate(caseId) {
	const statuses = ['draft', 'published', 'unpublished', 'archived'];
	const content = [
		'The application has been accepted for examination.',
		'The application is expected to be re-submitted to the Planning Inspectorate.',
		'The Registration and Relevant Representations form is available now.',
		'The applicant has agreed that all application documents can be published as soon as practicable to help everyone become familiar with the detail of what is being proposed in this application. The Planning Inspectorate will therefore make the application documents available as soon as practicable. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
		'The application has been withdrawn.'
	];
	const dates = oneDatePerMonth();
	/**
	 * @type {import('@prisma/client').Prisma.ProjectUpdateCreateManyInput}
	 */
	const projectUpdate = {
		caseId,
		htmlContent: pickRandom(content),
		status: pickRandom(statuses),
		emailSubscribers: true
	};
	if (projectUpdate.status === 'published') {
		projectUpdate.datePublished = pickRandom(dates);
	}

	return projectUpdate;
}

/**
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 * @param {number} caseId
 * @returns {Promise<import('@prisma/client').Prisma.BatchPayload>}
 */
function createProjectUpdates(databaseConnector, caseId) {
	const numUpdates = pseudoRandomInt(0, 28);
	const updates = [];
	for (let i = 0; i < numUpdates; i++) {
		updates.push(generateProjectUpdate(caseId));
	}
	return databaseConnector.projectUpdate.createMany({
		data: updates
	});
}

/**
 *
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 * @param {{name: string, abbreviation: string, displayNameEn: string}} subSector
 * @param {number} index
 */
const createApplication = async (databaseConnector, subSector, index) => {
	const title = `${subSector.displayNameEn} Test Application ${index}`;
	const caseStatus = pickRandom(caseStatusNames).name;
	// Draft cases do not have a reference assigned to them yet
	const reference = caseStatus === 'draft' ? null : generateApplicationReference(subSector, index);

	let representations = [];

	if (reference) {
		if (subSector.name === 'office_use' && index === 1) {
			for (let loopIndex = 0; loopIndex < 6000; loopIndex += 1) {
				representations.push(createRepresentation(reference, loopIndex, true));
			}
		} else {
			representations = [
				createRepresentation(reference, 1),
				createRepresentation(reference, 2),
				createRepresentation(reference, 3)
			];
		}
	}

	const newCase = await databaseConnector.case.create({
		data: {
			reference,
			modifiedAt: new Date(),
			description: `A description of test case ${index} which is a case of subsector type ${subSector.displayNameEn}`,
			title,
			ApplicationDetails: {
				create: {
					subSector: {
						connect: {
							name: subSector.name
						}
					},
					regions: {
						create: [
							{
								region: {
									connect: {
										name: pickRandom(regions).name
									}
								}
							}
						]
					},
					zoomLevel: {
						connect: {
							name: pickRandom(zoomLevels).name
						}
					}
				}
			},
			CaseStatus: {
				create: [
					{
						status: caseStatus
					}
				]
			},
			applicant: {
				create: {}
			},
			Representation: {
				create: representations
			}
		}
	});

	// create folders if case is not in draft state
	if (caseStatus !== 'draft') {
		Promise.all(createFolders(newCase.id));
	}
	await createProjectUpdates(databaseConnector, newCase.id);

	return newCase;
};

/**
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
export async function seedTestData(databaseConnector) {
	// now create some sample applications
	for (const { subSector } of subSectors) {
		for (let index = 1; index < 4; index += 1) {
			await createApplication(databaseConnector, subSector, index);
		}
	}
}
