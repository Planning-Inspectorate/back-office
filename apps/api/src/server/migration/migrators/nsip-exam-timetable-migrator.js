import { databaseConnector } from '#utils/database-connector.js';
import { buildUpsertForEntity } from './sql-tools.js';
import { MigratedEntityIdCeiling } from '../migrator.consts.js';
import { getCaseIdFromRef, getExamTimetableTypeIdFromName } from './utils.js';
import * as folderRepository from '#repositories/folder.repository.js';

/**
 * Migrate NSIP Exam Timetable
 *
 * @param {import('pins-data-model').Schemas.ExaminationTimetable[]} examTimetables
 */
export const migrateExamTimetables = async (examTimetables) => {
	console.info(`Migrating ${examTimetables.length} NSIP Exam Timetables`);

	for (const timetableModel of examTimetables) {
		const { caseId } = await mapModelToTimetableEntity(timetableModel);

		const examTimetableFolderId = await getExamTimetableFolderId(caseId);

		// Timetable ID isn't important to preserve as it's not used as a FK anywhere - so we can just use any ID and upsert the entity
		const { id } = await databaseConnector.examinationTimetable.upsert({
			where: {
				caseId
			},
			update: {
				caseId
			},
			create: {
				caseId
			}
		});

		// Event entities do have unique IDs which we have to preserve
		for (const eventModel of timetableModel.events) {
			const eventEntity = await mapModelToEventEntity(id, examTimetableFolderId, eventModel);

			if (!eventEntity.id || eventEntity.id >= MigratedEntityIdCeiling) {
				throw Error(`Unable to migrate entity id=${eventEntity.id} - identity above threshold`);
			}

			const { statement, parameters } = buildUpsertForEntity(
				'ExaminationTimetableItem',
				eventEntity,
				'id'
			);

			console.info('Inserting event ', eventEntity);

			await databaseConnector.$transaction([
				databaseConnector.$executeRawUnsafe(statement, ...parameters)
			]);
		}
	}
};

/**
 * TODO: We have a dependency on nsip-folder being migrated (where the individual timetable item folders will be migrated)
 * For now, newly created projects get an 'Examination timetable' folder by default - so we can test Exam TT migration against cases which
 * are created manually on the portal.
 *
 * @param {number} caseId
 * @returns {Promise<number>} examTimetableFolderId
 */
const getExamTimetableFolderId = async (caseId) => {
	const examinationFolder = await folderRepository.getFolderByNameAndCaseId(
		caseId,
		'Examination timetable' // TODO: we'll need to make sure the Examination timetable folder is properly migrated
	);

	if (!examinationFolder) {
		throw Error(`Examination timetable folder does not exist for case ${caseId}. Ensure the`);
	}

	return examinationFolder.id;
};

/**
 *
 * @param {import('pins-data-model').Schemas.ExaminationTimetable} model
 * @returns {Promise<import('@prisma/client').Prisma.ExaminationTimetableUncheckedCreateInput>}
 */
const mapModelToTimetableEntity = async ({ caseReference }) => {
	const caseId = await getCaseIdFromRef(caseReference);

	if (!caseId) {
		throw Error(`Case does not exist for caseReference ${caseReference}`);
	}

	return {
		// TODO: published is missing
		caseId
	};
};

/**
 * @param {number} examinationTimetableId
 * @param {number} examTimetableFolderId
 * @param {import('pins-data-model').Schemas.Event} model
 * @returns {Promise<import('@prisma/client').Prisma.ExaminationTimetableItemUncheckedCreateInput>}
 */
const mapModelToEventEntity = async (
	examinationTimetableId,
	examTimetableFolderId,
	{ eventId, date, eventDeadlineStartDate, type, eventTitle, description }
) => {
	const examinationTypeId = await getExamTimetableTypeIdFromName(type);

	if (!examinationTypeId) {
		throw Error(`Unable to find examinationTypeId for type ${type}`);
	}

	return {
		id: eventId,
		date,
		startDate: eventDeadlineStartDate,
		examinationTimetableId,
		// For now, use the root 'Examination timetable' folder ID because we'll get constraints if we don't
		// When we are migrating folders, refactor this to fetch the actual folder ID
		folderId: examTimetableFolderId,
		name: eventTitle,
		description: formatEventDescription(description),
		examinationTypeId
	};
};

const bulletPoint = '*';

/**
 * 	Example input:
	"List of items
	* test 1
	* test 2"

	Example output:
	{
		"preText": "List of items",
		"bulletPoints": ["test 1", "test 2"]
	}

 * @param {string} description
 *
 * @returns {string} formattedDescription
 */
const formatEventDescription = (description) => {
	const splitDescription = description.split(bulletPoint);
	const preText = trimNewLines(splitDescription.shift() || '');

	/** @type {string[]} */
	const bulletPoints = [];

	if (splitDescription.length > 0) {
		bulletPoints.push(...splitDescription.map((lineItem) => trimNewLines(lineItem)));
	}

	return JSON.stringify({
		preText,
		bulletPoints
	});
};

/**
 *
 * @param {string} input
 * @returns
 */
const trimNewLines = (input) => input.trim().replace(/[\r\n]+$/, '');
