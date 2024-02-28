/**
 * @typedef {import('pins-data-model').Schemas.Folder} FolderModel
 * @typedef {import('apps/api/src/database/schema.d.ts').Folder} Folder
 */

import { buildFolderHierarchy, getCaseIdFromRef } from './utils.js';
import { MigratedEntityIdCeiling } from '../migrator.consts.js';
import { buildUpsertForEntity } from './sql-tools.js';
import { databaseConnector } from '#utils/database-connector.js';

/**
 * @param {FolderModel[]} folderList
 */
export const migrateFolders = async (folderList) => {
	console.info(`Migrating ${folderList.length} Folder items`);

	const caseReference = folderList?.[0]?.caseReference;
	const caseId = await getCaseIdFromRef(caseReference);
	if (!caseId) throw Error(`Case does not exist for caseReference ${caseReference}`);

	const folderHierarchy = buildFolderHierarchy(folderList);
	await createFolders(folderHierarchy);

	await moveExaminationTimetableFolder(caseId);
};

const createFolders = async (folders) => {
	for (const folder of folders) {
		await createFolder(folder);
		if (Array.isArray(folder.children) && folder.children.length > 0) {
			await createFolders(folder.children);
		}
	}
};

const createFolder = async (folder) => {
	const folderEntity = await mapModelToFolderEntity(folder);

	if (folderEntity.id >= MigratedEntityIdCeiling) {
		throw Error(`Unable to migrate entity id=${folderEntity.id} - identity above threshold`);
	}

	const { statement: folderStatement, parameters: folderParameters } = buildUpsertForEntity(
		'Folder',
		folderEntity,
		'id'
	);

	console.info(`Upserting Folder with ID ${folderEntity.id}`);

	await databaseConnector.$transaction([
		databaseConnector.$executeRawUnsafe(folderStatement, ...folderParameters)
	]);
};

/**
 * @param {FolderModel} folder
 * @returns {Folder}
 */
const mapModelToFolderEntity = async ({
	id,
	caseReference,
	displayNameEnglish,
	parentFolderId,
	caseStage
}) => {
	const caseId = await getCaseIdFromRef(caseReference);
	if (!caseId) throw Error(`Case does not exist for caseReference ${caseReference}`);

	return {
		id,
		displayNameEn: getName(displayNameEnglish),
		displayOrder: getDisplayOrder(displayNameEnglish),
		parentFolderId,
		caseId,
		stage: caseStage
	};
};

const PREFIXED_FOLDER_REGEX =
	/^(\d{1,2}.?(?:\.\d{1,2})?(?:\.\d{1,2})?\s+(?:- )?(?!January|February|March|April|May|June|July|August|September|October|November|December|Day))(.*)/;

/**
 * Extracts folder name and maps to Back Office value if necessary
 * @example
 * // returns 'Drafts'
 * getName('02 - Drafts')
 * @example
 * // returns 'S51 advice'
 * getName('02 - Section 51 Advice')
 * @param displayName
 * @returns {*|string}
 */
const getName = (displayName) => {
	if (displayName.match(/Project Management/)) return 'Project management';
	if (displayName.match(/Section 51 Advice/)) return 'S51 advice';
	if (displayName.match(/Exam Timetable/)) return 'Examination timetable';
	if (displayName.match(/Pre-App/)) return 'Pre-application';
	if (displayName.match(/Land Rights/)) return 'Land rights';
	if (displayName.match(/Post Decision/)) return 'Post-decision';

	const matches = displayName.match(PREFIXED_FOLDER_REGEX);
	if (matches) {
		return matches[2];
	} else {
		return displayName;
	}
};

/**
 * Take folder prefix and use as display order
 * @example
 * // returns 2
 * getDisplayOrder('02 - Drafts')
 * @param displayName
 * @returns {number|null}
 */
const getDisplayOrder = (displayName) => {
	const matches = displayName.match(PREFIXED_FOLDER_REGEX);
	if (matches) {
		return parseInt(matches[1].match(/\d+/)) * 100;
	} else {
		return null;
	}
};

/**
 * Create an 'Examination' folder at root level, then look up 'Examination timetable' folder
 * and amend its parent to be the newly created 'Examination' folder
 * @param caseId
 * @returns {Promise<void>}
 */
const moveExaminationTimetableFolder = async (caseId) => {
	const examinationFolderData = {
		displayNameEn: 'Examination',
		caseId,
		stage: 'examination',
		displayOrder: 750
	};

	// find or create Examination parent folder
	let examinationFolder = await databaseConnector.folder.findFirst({
		where: {
			caseId,
			displayNameEn: examinationFolderData.displayNameEn,
			parentFolderId: null
		}
	});
	if (!examinationFolder) {
		examinationFolder = await databaseConnector.folder.create({ data: examinationFolderData });
	}

	await databaseConnector.folder.updateMany({
		where: {
			displayNameEn: 'Examination timetable',
			caseId: caseId
		},
		data: {
			parentFolderId: examinationFolder.id
		}
	});
};
